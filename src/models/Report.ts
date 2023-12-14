import mongoose from 'mongoose';
import { IReport } from '../types/models';


const reportSchema = new mongoose.Schema<IReport>({
  email: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String
  },
  title: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Report', reportSchema)