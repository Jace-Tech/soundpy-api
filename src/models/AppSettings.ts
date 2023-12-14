import mongoose from 'mongoose';
import { IAppSettings } from '../types/models';


const appSettingsSchema = new mongoose.Schema<IAppSettings>({
  contentPrice: {
    type: Number,
    default: 0.5
  },
  subscriptionPrice: {
    type: Number,
    default: 1
  },
  appName: {
    type: String,
    default: "Soundpy"
  },
  stakePrice: {
    type: Number,
    default: 0.324
  },
}, { timestamps: true });

export default mongoose.model('AppSettings', appSettingsSchema)