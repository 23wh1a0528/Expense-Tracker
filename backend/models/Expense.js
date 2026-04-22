import mongoose from 'mongoose';
const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId,
            ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  paymentMethod: {
    type: String,
    enum: ['cash','card','online'],
    default: 'cash'
  },
  tags: [{ type: String }],
  receipt: { type: String }
}, { timestamps: true });
export default mongoose.model('Expense', expenseSchema);
