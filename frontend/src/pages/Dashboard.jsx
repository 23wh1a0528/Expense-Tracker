import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Required: register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [summary, setSummary] = useState({ total: 0, count: 0, byCategory: {} });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, expensesRes] = await Promise.all([
        API.get('/reports/summary'),
        API.get('/expenses?limit=5')
      ]);
      setSummary(summaryRes.data);
      setRecentExpenses(expensesRes.data.slice(0, 5));
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      fetchDashboardData(); // re-fetch to update totals + chart
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Top category calculation
  const topCategory = Object.entries(summary.byCategory).sort((a, b) => b[1] - a[1])[0];

  const chartData = {
    labels: Object.keys(summary.byCategory),
    datasets: [{
      data: Object.values(summary.byCategory),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      borderWidth: 2
    }]
  };

  const chartOptions = {
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  if (loading) return (
    <p style={{ textAlign: 'center', marginTop: '3rem', color: '#718096' }}>
      Loading dashboard...
    </p>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ color: '#2d3748', marginBottom: '1.5rem' }}>📊 Dashboard</h1>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Spent',    value: `Rs.${summary.total.toLocaleString()}`, color: '#667eea' },
          { label: 'Transactions',   value: summary.count,                           color: '#48bb78' },
          { label: 'Top Category',
            value: topCategory ? `${topCategory[0]} (Rs.${topCategory[1].toLocaleString()})` : 'N/A',
            color: '#ed8936' },
        ].map(card => (
          <div key={card.label} style={{
            flex: 1, minWidth: '160px', background: card.color,
            color: '#fff', borderRadius: '12px', padding: '1.25rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <p style={{ margin: 0, fontSize: '0.82rem', opacity: 0.85 }}>{card.label}</p>
            <h2 style={{ margin: '0.4rem 0 0', fontSize: '1.5rem' }}>{card.value}</h2>
          </div>
        ))}
      </div>

      {/* Chart + Recent side by side */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>

        {/* Doughnut Chart */}
        <div style={{
          flex: 1, minWidth: '260px', background: '#fff', borderRadius: '12px',
          padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>Category Breakdown</h3>
          {Object.keys(summary.byCategory).length > 0
            ? <Doughnut data={chartData} options={chartOptions} />
            : <p style={{ color: '#a0aec0', textAlign: 'center' }}>No data yet</p>
          }
        </div>

        {/* Recent Transactions */}
        <div style={{
          flex: 1, minWidth: '260px', background: '#fff', borderRadius: '12px',
          padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>Recent Transactions</h3>
          {recentExpenses.length === 0
            ? <p style={{ color: '#a0aec0' }}>No expenses yet</p>
            : recentExpenses.map(exp => (
              <div key={exp._id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.6rem 0', borderBottom: '1px solid #e2e8f0'
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: '#2d3748' }}>{exp.title}</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#718096' }}>
                    {exp.category} • {new Date(exp.date).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 700, color: '#667eea' }}>
                    Rs.{exp.amount.toLocaleString()}
                  </span>
                  <button onClick={() => handleDeleteExpense(exp._id)} style={{
                    background: '#fed7d7', color: '#c53030', border: 'none',
                    borderRadius: '6px', padding: '0.3rem 0.6rem',
                    cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600
                  }}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default Dashboard;