import mongoose from 'mongoose';
import { IToken } from '../types/models';


const tokenSchema = new mongoose.Schema<IToken>({
  code: String,
  email: String,
  expires: {
    type: Date
  }
}, { timestamps: true });

export default mongoose.model('Token', tokenSchema)