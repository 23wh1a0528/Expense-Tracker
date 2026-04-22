import React, { useState, useEffect } from 'react';
import API from '../services/api';

function AdminPage() {
  const [users,    setUsers]    = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/admin/users'),
      API.get('/admin/expenses')
    ]).then(([uRes, eRes]) => {
      setUsers(uRes.data);
      setExpenses(eRes.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign:'center', marginTop:'2rem' }}>Loading admin data...</p>;

  const totalSystem = expenses.reduce((s, e) => s + e.amount, 0);
  const byCategory  = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const cardStyle = {
    background: '#fff', borderRadius: '12px', padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '1.5rem'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ color: '#2d3748', marginBottom: '1.5rem' }}>🛡️ Admin Dashboard</h1>

      {/* System Summary */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Users',    value: users.length,                       color: '#667eea' },
          { label: 'Total Expenses', value: expenses.length,                    color: '#48bb78' },
          { label: 'System Total',   value: `Rs.${totalSystem.toLocaleString()}`, color: '#ed8936' },
        ].map(c => (
          <div key={c.label} style={{ flex: 1, minWidth: '150px', background: c.color,
            color: '#fff', borderRadius: '12px', padding: '1.25rem' }}>
            <p style={{ margin: 0, fontSize: '0.82rem', opacity: 0.85 }}>{c.label}</p>
            <h2 style={{ margin: '0.4rem 0 0', fontSize: '1.5rem' }}>{c.value}</h2>
          </div>
        ))}
      </div>

      {/* All Users */}
      <div style={cardStyle}>
        <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>All Users</h3>
        {users.map(u => (
          <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between',
            padding: '0.6rem 0', borderBottom: '1px solid #e2e8f0' }}>
            <span style={{ fontWeight: 600, color: '#2d3748' }}>{u.name}</span>
            <span style={{ color: '#718096' }}>{u.email}</span>
            <span style={{ background: u.role === 'admin' ? '#667eea' : '#e2e8f0',
              color: u.role === 'admin' ? '#fff' : '#4a5568',
              padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.78rem' }}>
              {u.role}
            </span>
          </div>
        ))}
      </div>

      {/* Category Analytics */}
      <div style={cardStyle}>
        <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>Category Analytics (System-wide)</h3>
        {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => {
          const pct = Math.round((amt / totalSystem) * 100);
          return (
            <div key={cat} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, color: '#4a5568' }}>{cat}</span>
                <span style={{ color: '#2d3748' }}>Rs.{amt.toLocaleString()} ({pct}%)</span>
              </div>
              <div style={{ background: '#e2e8f0', borderRadius: '99px', height: '8px' }}>
                <div style={{ width: `${pct}%`, background: '#667eea',
                  borderRadius: '99px', height: '8px' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminPage;