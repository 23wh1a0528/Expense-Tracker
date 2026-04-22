import mongoose from "mongoose";
const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId,
            ref: 'User', required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  month: { type: Date, required: true },
  alertEnabled: { type: Boolean, default: true },
  alertThreshold: { type: Number, default: 80 }
}, { timestamps: true });
export default mongoose.model('Budget', budgetSchema);
