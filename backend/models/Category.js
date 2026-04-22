import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String },
  color: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId,
            ref: 'User', default: null }
}, { timestamps: true });
export default mongoose.model('Category', categorySchema);
