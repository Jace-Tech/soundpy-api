import mongoose from 'mongoose';
import { ILike } from '../types/models';


const likeSchema = new mongoose.Schema<ILike>({
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

export default mongoose.model('Like', likeSchema)