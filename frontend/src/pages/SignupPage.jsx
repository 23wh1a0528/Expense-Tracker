import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '', currency: 'INR' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role',  res.data.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.6rem', borderRadius: '8px',
    border: '1px solid #cbd5e0', fontSize: '0.95rem',
    marginTop: '0.3rem', boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: '420px', margin: '5rem auto', padding: '2rem',
      background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#2d3748' }}>
        Create Account
      </h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {[
          { label: 'Name',     field: 'name',     type: 'text'     },
          { label: 'Email',    field: 'email',    type: 'email'    },
          { label: 'Password', field: 'password', type: 'password' },
        ].map(({ label, field, type }) => (
          <div key={field} style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 600, color: '#4a5568' }}>{label}</label>
            <input type={type} value={form[field]} style={inputStyle}
              onChange={e => setForm({ ...form, [field]: e.target.value })} />
          </div>
        ))}
        <button type='submit' style={{
          width: '100%', padding: '0.75rem',
          background: 'linear-gradient(135deg,#667eea,#764ba2)',
          color: '#fff', border: 'none', borderRadius: '8px',
          fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem'
        }}>Register</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#718096' }}>
        Already have an account? <Link to='/login'>Login</Link>
      </p>
    </div>
  );
}

export default SignupPage;