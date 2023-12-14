import mongoose from 'mongoose';
import { IComment } from '../types/models';


const commentSchema = new mongoose.Schema<IComment>({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content",
    required: true
  },
  comment: { 
    type: String,
    required: true
  },
  date: { 
    type: Date,
    default: Date.now()
  }
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema)