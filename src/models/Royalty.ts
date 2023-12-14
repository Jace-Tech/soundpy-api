import mongoose from 'mongoose';
import { IRoyalty } from '../types/models';

const royaltySchema = new mongoose.Schema<IRoyalty>({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isClaimed: {
    type: Boolean,
    default: false
  },
  amount: {
    type: Number,
    required: true
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }
}, { timestamps: true });

export default mongoose.model('Royalty', royaltySchema)