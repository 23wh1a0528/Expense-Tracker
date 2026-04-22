import mongoose from 'mongoose';
import Expense from './models/Expense.js';
import User from './models/User.js';
import connectDB from './util/db.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const runSeed = async () => {
  await connectDB();

  // Create a test user or find existing
  let user = await User.findOne({ email: 'test@test.com' });
  if (!user) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    user = await User.create({
      name: 'Test User',
      email: 'test@test.com',
      password: hashedPassword,
      role: 'user',
      currency: 'INR'
    });
    console.log('Test user created:', user._id);
  } else {
    console.log('Using existing user:', user._id);
  }

  // Clear old expenses for this user
  await Expense.deleteMany({ userId: user._id });

  // Seed 24 sample expenses
  const sampleExpenses = [
    { title: 'Rent',              amount: 12000, category: 'Housing',       paymentMethod: 'online' },
    { title: 'Electricity Bill',  amount: 1800,  category: 'Utilities',     paymentMethod: 'online' },
    { title: 'Groceries',         amount: 950,   category: 'Food',          paymentMethod: 'card'   },
    { title: 'Movie Ticket',      amount: 300,   category: 'Entertainment', paymentMethod: 'card'   },
    { title: 'Petrol',            amount: 500,   category: 'Transport',     paymentMethod: 'cash'   },
    { title: 'Dinner Out',        amount: 750,   category: 'Food',          paymentMethod: 'card'   },
    { title: 'Gym Membership',    amount: 600,   category: 'Health',        paymentMethod: 'online' },
    { title: 'Internet Bill',     amount: 999,   category: 'Utilities',     paymentMethod: 'online' },
    { title: 'Books',             amount: 450,   category: 'Education',     paymentMethod: 'card'   },
    { title: 'Clothes Shopping',  amount: 2200,  category: 'Shopping',      paymentMethod: 'card'   },
    { title: 'Coffee',            amount: 180,   category: 'Food',          paymentMethod: 'cash'   },
    { title: 'Bus Pass',          amount: 350,   category: 'Transport',     paymentMethod: 'cash'   },
    { title: 'Medicine',          amount: 420,   category: 'Health',        paymentMethod: 'cash'   },
    { title: 'OTT Subscription',  amount: 199,   category: 'Entertainment', paymentMethod: 'online' },
    { title: 'Mobile Recharge',   amount: 299,   category: 'Utilities',     paymentMethod: 'online' },
    { title: 'Snacks',            amount: 120,   category: 'Food',          paymentMethod: 'cash'   },
    { title: 'Uber Ride',         amount: 230,   category: 'Transport',     paymentMethod: 'online' },
    { title: 'Stationery',        amount: 150,   category: 'Education',     paymentMethod: 'cash'   },
    { title: 'Restaurant',        amount: 880,   category: 'Food',          paymentMethod: 'card'   },
    { title: 'Water Bill',        amount: 200,   category: 'Utilities',     paymentMethod: 'cash'   },
    { title: 'Haircut',           amount: 250,   category: 'Personal',      paymentMethod: 'cash'   },
    { title: 'Online Course',     amount: 1500,  category: 'Education',     paymentMethod: 'card'   },
    { title: 'Gift',              amount: 700,   category: 'Shopping',      paymentMethod: 'card'   },
    { title: 'Parking Fee',       amount: 100,   category: 'Transport',     paymentMethod: 'cash'   },
  ];

  const expenseDocs = sampleExpenses.map((e, i) => ({
    ...e,
    userId: user._id,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000) // each 1 day apart
  }));

  await Expense.insertMany(expenseDocs);
  console.log('✅ 24 expenses seeded successfully');
  console.log('User ID to use in queries:', user._id.toString());

  mongoose.disconnect();
};

runSeed();