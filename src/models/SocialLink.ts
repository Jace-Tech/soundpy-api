import mongoose from 'mongoose';
import { ISocialLink } from '../types/models';


const socialLinkSchema = new mongoose.Schema<ISocialLink>({
  link: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  }
}, { timestamps: true });

export default mongoose.model('socialLink', socialLinkSchema)