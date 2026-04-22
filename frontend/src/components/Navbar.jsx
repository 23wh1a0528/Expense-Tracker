import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className='navbar'>
      <span className='brand'>💰 ExpenseFlow</span>
      {token && <Link to='/'>Dashboard</Link>}
      {token && <Link to='/expenses'>Expenses</Link>}
      {token && <Link to='/budget'>Budget</Link>}
      {role === 'admin' && <Link to='/admin'>Admin</Link>}
      {!token
        ? <Link to='/login'>Login</Link>
        : <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
}

export default Navbar;