import mongoose from 'mongoose';
import { ITransaction } from '../types/models';

const transactionSchema = new mongoose.Schema<ITransaction>({
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "success", "cancelled", "error"],
    default: "pending"
  },
  piPaymentId: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  trxId: {
    type: String,
    default: null
  },
  meta: mongoose.Schema.Types.Mixed,
  desc: String,
  type: { // content, subscription, message
    type: String,
    enum: ["content", "subscription", "message", "stake"],
    required: true
  },
  isCredit: { // content, subscription, message
    type: Boolean,
    default: false
  },
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema)