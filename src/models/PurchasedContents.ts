import mongoose from 'mongoose';
import { IPurchaseContent } from '../types/models';


const purchasedContentSchema = new mongoose.Schema<IPurchaseContent>({
  transaction: {
    type: mongoose.Types.ObjectId,
    ref: "Transaction",
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: mongoose.Types.ObjectId,
    ref: "Content",
    required: true
  },
}, { timestamps: true });

export default mongoose.model('PurchasedContent', purchasedContentSchema)