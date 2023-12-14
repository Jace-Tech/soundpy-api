import mongoose from 'mongoose';
import { IBlockedContent } from '../types/models';

const blockedContentSchema = new mongoose.Schema<IBlockedContent>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: mongoose.Types.ObjectId,
    ref: "Content",
    required: true
  }
}, { timestamps: true });

export default mongoose.model('BlockedContent', blockedContentSchema)