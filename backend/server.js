import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './util/db.js';
import Expense from './models/Expense.js';
import Category from './models/Category.js';
import { protect } from './middleware/authMiddleware.js';

// 👇 ADD THESE
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

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
app.post('/api/expenses', protect, async (req, res) => {
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