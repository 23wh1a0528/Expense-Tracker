import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './BudgetPage.css';

function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [spending, setSpending] = useState({});
  const [form, setForm] = useState({
    category: 'Food', limit: '', month: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [budgetRes, reportRes] = await Promise.all([
        API.get('/budgets'),
        API.get('/reports/by-category')
      ]);
      setBudgets(budgetRes.data);
      setSpending(reportRes.data);
    } catch (err) {
      setError('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!form.limit || !form.month) {
      alert('Please fill in limit and month');
      return;
    }
    try {
      await API.post('/budgets', form);
      fetchData();
      setForm({ category: 'Food', limit: '', month: '' });
    } catch (err) {
      alert('Failed to set budget');
    }
  };

  const getUsagePercent = (category, limit) => {
    const spent = spending[category] || 0;
    return Math.min((spent / limit) * 100, 100).toFixed(1);
  };

  const getColorClass = (pct) => {
    if (pct >= 90) return 'danger';
    if (pct >= 70) return 'warning';
    return 'safe';
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading budgets...</p>;
  if (error)   return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div className='budget-container'>
      <h1>Budget Tracker</h1>

      {/* Set Budget Form */}
      <form onSubmit={handleSetBudget} className='budget-form'>
        <select name='category' value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}>
          {['Food', 'Travel', 'Bills', 'Entertainment', 'Shopping']
            .map(c => <option key={c}>{c}</option>)}
        </select>

        <input type='number' placeholder='Budget Limit (Rs.)'
          value={form.limit}
          onChange={e => setForm({ ...form, limit: e.target.value })} />

        <input type='month' value={form.month}
          onChange={e => setForm({ ...form, month: e.target.value })} />

        <button type='submit'>Set Budget</button>
      </form>

      {/* Budget Cards */}
      {budgets.length === 0
        ? <p style={{ textAlign: 'center', color: '#a0aec0', marginTop: '2rem' }}>
            No budgets set yet. Add one above!
          </p>
        : budgets.map(b => {
            const pct = getUsagePercent(b.category, b.limit);
            const colorClass = getColorClass(Number(pct));
            const spent = spending[b.category] || 0;
            return (
              <div key={b._id} className='budget-card'>
                <h3>{b.category}</h3>
                <p>Limit: Rs.{b.limit.toLocaleString()} | Spent: Rs.{spent.toLocaleString()}</p>
                <div className='progress-bar'>
                  <div className={`fill ${colorClass}`}
                    style={{ width: pct + '%' }} />
                </div>
                <p className='pct-label'>{pct}% used</p>
                {Number(pct) >= 90 &&
                  <p className='alert'>⚠ Budget almost exhausted!</p>}
              </div>
            );
          })
      }
    </div>
  );
}

export default BudgetPage;