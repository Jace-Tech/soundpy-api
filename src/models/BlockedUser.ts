import mongoose from 'mongoose';
import { IBlockedUser } from '../types/models';


const blockedUserSchema = new mongoose.Schema<IBlockedUser>({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  blockedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

export default mongoose.model('BlockedUser', blockedUserSchema)