import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/LoginPage';
import Register from './pages/SignupPage';
import ExpensesPage from './pages/ExpensesPage';
import BookExpense from './pages/BookExpense';
import BudgetPage from './pages/BudgetPage';
import AdminPage from './pages/AdminPage';

// Protected route wrapper
const Protected = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to='/login' />;
};

// Admin only route wrapper
const AdminOnly = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to='/login' />;
  if (role !== 'admin') return <Navigate to='/' />;
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/login'    element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={
          <Protected><Dashboard /></Protected>} />
        <Route path='/expenses' element={
          <Protected><ExpensesPage /></Protected>} />
        <Route path='/expenses/add' element={
          <Protected><BookExpense /></Protected>} />
        <Route path='/budget' element={
          <Protected><BudgetPage /></Protected>} />
        <Route path='/admin' element={
          <AdminOnly><AdminPage /></AdminOnly>} />
      </Routes>
    </Router>
  );
}

export default App;