import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

function BookExpense() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', amount: '', category: 'Food',
    date: '', paymentMethod: 'cash', description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const expenseData = {
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        description: formData.description
      };
      await API.post('/expenses', expenseData);
      setSuccess(true);
      setTimeout(() => navigate('/expenses'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem',
      background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#2d3748' }}>
        Add New Expense
      </h2>

      {success && (
        <div style={{ background: '#c6f6d5', color: '#276749', padding: '0.75rem',
          borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
          ✅ Expense added! Redirecting...
        </div>
      )}
      {error && (
        <div style={{ background: '#fed7d7', color: '#c53030', padding: '0.75rem',
          borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {[
          { label: 'Title *', name: 'title', type: 'text' },
          { label: 'Amount (Rs.) *', name: 'amount', type: 'number' },
          { label: 'Date *', name: 'date', type: 'date' },
          { label: 'Description', name: 'description', type: 'text' },
        ].map(field => (
          <div key={field.name} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: '600',
              marginBottom: '0.3rem', color: '#4a5568' }}>{field.label}</label>
            <input type={field.type} name={field.name}
              value={formData[field.name]} onChange={handleChange}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '8px',
                border: '1px solid #cbd5e0', fontSize: '0.95rem', boxSizing: 'border-box' }} />
          </div>
        ))}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: '600',
            marginBottom: '0.3rem', color: '#4a5568' }}>Category</label>
          <select name='category' value={formData.category} onChange={handleChange}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px',
              border: '1px solid #cbd5e0', fontSize: '0.95rem' }}>
            <option>Food</option>
            <option>Travel</option>
            <option>Bills</option>
            <option>Entertainment</option>
            <option>Shopping</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: '600',
            marginBottom: '0.3rem', color: '#4a5568' }}>Payment Method</label>
          <select name='paymentMethod' value={formData.paymentMethod} onChange={handleChange}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px',
              border: '1px solid #cbd5e0', fontSize: '0.95rem' }}>
            <option value='cash'>Cash</option>
            <option value='card'>Card</option>
            <option value='online'>Online</option>
          </select>
        </div>

        <button type='submit' disabled={loading}
          style={{ width: '100%', padding: '0.75rem',
            background: loading ? '#a0aec0' : 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff', border: 'none', borderRadius: '8px',
            fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
}

export default BookExpense;