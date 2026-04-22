import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './util/db.js';
import Expense from './models/Expense.js';
import Category from './models/Category.js';
import { protect } from './middleware/authMiddleware.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import { validateExpense } from './middleware/validateExpense.js';
import Budget from './models/Budget.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('ExpenseFlow API is running');
});


// ================= AUTH ROUTES =================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, currency } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      currency: currency || 'INR'
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role        // ← make sure this line exists
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// =================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`ExpenseFlow server running on port ${PORT}`)
);

// ================= EXPENSE ROUTES =================

// Get all expenses
app.get('/api/expenses', protect, async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

    const filter = { userId: req.user._id };

    if (category) filter.category = category;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });

    res.json(expenses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Create expense
app.post('/api/expenses', protect, validateExpense, async (req, res) => {
  try {
    const { title, amount, category, date, paymentMethod } = req.body;

    const expense = await Expense.create({
      userId: req.user._id,
      title,
      amount,
      category,
      date: date || new Date(),
      paymentMethod
    });

    res.status(201).json(expense);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get expense by ID
app.get('/api/expenses/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!expense)
      return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update expense
app.put('/api/expenses/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense)
      return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Delete expense
app.delete('/api/expenses/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!expense)
      return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reports/summary
app.get('/api/reports/summary', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    res.json({ total, byCategory, count: expenses.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get categories
app.get('/api/categories', protect, async (req, res) => {
  try {
    const categories = await Category.find({
      $or: [{ userId: req.user._id }, { userId: null }]
    });

    res.json(categories);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/budgets
app.get('/api/budgets', protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/budgets
app.post('/api/budgets', protect, async (req, res) => {
  try {
    const { category, limit, month } = req.body;
    // Update if exists for same category+month, else create
    const budget = await Budget.findOneAndUpdate(
      { userId: req.user._id, category, month: new Date(month) },
      { limit },
      { upsert: true, new: true }
    );
    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reports/by-category
app.get('/api/reports/by-category', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id });
    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    res.json(byCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/users  (admin only)
app.get('/api/admin/users', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied' });
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/expenses  (admin only)
app.get('/api/admin/expenses', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Access denied' });
    const expenses = await Expense.find().populate('userId', 'name email');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});