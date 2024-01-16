import mongoose from 'mongoose';
import { IReply } from '../types/models';


const replySchema = new mongoose.Schema<IReply>({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  comment: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true
  },
  reply: { 
    type: String,
    required: true
  },
  date: { 
    type: Date,
    default: Date.now()
  }
}, { timestamps: true });

export default mongoose.model('Reply', replySchema)