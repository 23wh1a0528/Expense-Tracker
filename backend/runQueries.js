import mongoose from 'mongoose';
import Expense from './models/Expense.js';
import connectDB from './util/db.js';
import dotenv from 'dotenv';
dotenv.config();

const runQueries = async () => {
  await connectDB();

  const userId = '69e4ae0588b5f6992ca17dea'; // ← from seedExpenses.js output

  const total = await Expense.countDocuments({ userId });
  console.log('Total expenses:', total);

  const recent = await Expense.find({ userId })
    .sort({ date: -1 }).limit(5);
  console.log('Recent 5 expenses:', recent.length, 'records');

  const byAmount = await Expense.find({ userId })
    .sort({ amount: -1 });
  console.log('Sorted by amount (highest first):');
  byAmount.forEach(e =>
    console.log(`  ${e.title}: Rs.${e.amount}`));

  const page = 2;
  const limit = 5;
  const paginated = await Expense.find({ userId })
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  console.log('Page 2 expenses:', paginated.length, 'records');

  mongoose.disconnect();
};

runQueries();