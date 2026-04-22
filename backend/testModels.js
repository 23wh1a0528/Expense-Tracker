import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Expense from './models/Expense.js';
import Category from './models/Category.js';
import Budget from './models/Budget.js';

dotenv.config();

async function testModels() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expenseflow_db');
  console.log('MongoDB Connected');
  console.log(`Connected to database: ${mongoose.connection.name}`);

  // List collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  const names = collections.map(c => c.name);

  console.log('\nCollections created:');
  console.log('1. users       - stores user profiles and authentication data');
  console.log('2. expenses    - stores individual expense records per user');
  console.log('3. categories  - stores default and custom expense categories');
  console.log('4. budgets     - stores per-category monthly spending limits');

  // Insert a sample expense (requires a dummy userId)
  const dummyUserId = new mongoose.Types.ObjectId();
  const sample = await Expense.create({
    userId: dummyUserId,
    title: 'Lunch',
    amount: 250,
    category: 'Food',
    paymentMethod: 'cash',
    date: new Date('2025-01-15')
  });

  console.log('\nSample document in expenses collection:');
  console.log({
    _id: sample._id,
    userId: sample.userId,
    title: sample.title,
    amount: sample.amount,
    category: sample.category,
    paymentMethod: sample.paymentMethod,
    date: sample.date,
    createdAt: sample.createdAt
  });

  await mongoose.connection.close();
}

testModels().catch(console.error);