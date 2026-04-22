import React, { useState } from 'react';
import API from '../services/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);   // ← add this line
      window.location.href = '/';
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '5rem auto', padding: '2rem',
      background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>
          <input type='email' value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px',
              border: '1px solid #cbd5e0', marginTop: '0.3rem' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>
          <input type='password' value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px',
              border: '1px solid #cbd5e0', marginTop: '0.3rem' }} />
        </div>
        <button type='submit'
          style={{ width: '100%', padding: '0.75rem', background: '#667eea',
            color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;