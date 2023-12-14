import mongoose from 'mongoose';
import { IGenre } from '../types/models';


const genreSchema = new mongoose.Schema<IGenre>({
  name: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Genre', genreSchema)