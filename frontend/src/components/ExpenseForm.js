import React, { useState } from 'react';
import './ExpenseForm.css';

function ExpenseForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '', amount: '', category: 'Food',
    date: '', paymentMethod: 'cash', description: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim())
      errors.title = 'Title is required';
    else if (formData.title.trim().length < 3)
      errors.title = 'Title must be at least 3 characters';
    if (!formData.amount)
      errors.amount = 'Amount is required';
    else if (isNaN(formData.amount) || Number(formData.amount) <= 0)
      errors.amount = 'Amount must be a positive number';
    if (!formData.date)
      errors.date = 'Date is required';
    else if (new Date(formData.date) > new Date())
      errors.date = 'Date cannot be in the future';
    if (!formData.category)
      errors.category = 'Please select a category';
    return errors;
  };

  const resetForm = () => {
    setFormData({
      title: '', amount: '', category: 'Food',
      date: '', paymentMethod: 'cash', description: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      // If onSubmit is passed from parent, call it
      if (onSubmit) await onSubmit(formData);
      setSuccess('Expense added successfully!');
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to add expense' });
    }
  };

  return (
    <div className='expense-form-container'>
      <h2>Add New Expense</h2>

      {success && <div className='success-msg'>{success}</div>}
      {errors.submit && <div className='error-msg'>{errors.submit}</div>}

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Title *</label>
          <input type='text' name='title'
            value={formData.title} onChange={handleChange} />
          {errors.title && <span className='field-error'>{errors.title}</span>}
        </div>

        <div className='form-row'>
          <div className='form-group'>
            <label>Amount (Rs.) *</label>
            <input type='number' name='amount'
              value={formData.amount} onChange={handleChange} />
            {errors.amount && <span className='field-error'>{errors.amount}</span>}
          </div>
          <div className='form-group'>
            <label>Category</label>
            <select name='category'
              value={formData.category} onChange={handleChange}>
              <option>Food</option>
              <option>Travel</option>
              <option>Bills</option>
              <option>Entertainment</option>
              <option>Shopping</option>
            </select>
            {errors.category && <span className='field-error'>{errors.category}</span>}
          </div>
        </div>

        <div className='form-row'>
          <div className='form-group'>
            <label>Date *</label>
            <input type='date' name='date'
              value={formData.date} onChange={handleChange} />
            {errors.date && <span className='field-error'>{errors.date}</span>}
          </div>
          <div className='form-group'>
            <label>Payment Method</label>
            <select name='paymentMethod'
              value={formData.paymentMethod} onChange={handleChange}>
              <option value='cash'>Cash</option>
              <option value='card'>Card</option>
              <option value='online'>Online</option>
            </select>
          </div>
        </div>

        <button type='submit' className='submit-btn'>Add Expense</button>
      </form>
    </div>
  );
}

export default ExpenseForm;