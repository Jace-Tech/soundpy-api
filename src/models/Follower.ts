import mongoose from 'mongoose';
import { IFollower } from '../types/models';


const followerSchema = new mongoose.Schema<IFollower>({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  date: {
    type: mongoose.Schema.Types.Date,
    default: Date.now()
  },
}, { timestamps: true });

export default mongoose.model('follower', followerSchema)