import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './ExpensesPage.css';

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    try {
      const res = await API.get('/expenses');
      setExpenses(res.data);
    } catch (err) {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading expenses...</p>;
  if (error) return <p className='error'>{error}</p>;

  return (
    <div className='expenses-container'>
      <h1>My Expenses</h1>
      {expenses.map(exp => (
        <div key={exp._id} className='expense-card'>
          <h3>{exp.title}</h3>
          <p>Amount: Rs.{exp.amount}</p>
          <p>Category: {exp.category}</p>
          <p>Date: {new Date(exp.date).toLocaleDateString()}</p>
          <p>Payment: {exp.paymentMethod}</p>
        </div>
      ))}
    </div>
  );
}
export default ExpensesPage;

