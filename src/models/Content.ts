import mongoose from 'mongoose';
import { IContent } from '../types/models';
import Joi from 'joi';

const myEnum = ["song", "beat", "music-video", "live"]

const ContentSchema = new mongoose.Schema<IContent>({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: myEnum,
    required: true
  },
  features: [{
    type: String,
    default: null
  }],
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  genre: {
    type: mongoose.Types.ObjectId,
    ref: "Genre",
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  contentUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0.00
  },
  displayCutUrl: {
    type: String,
    default: null
  },
  metadata: {
    type: Object,
    default: {}
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
}, { timestamps: true });

const isValidContent = Joi.object<IContent>({
  type: Joi.string().valid(...myEnum),
  title: Joi.string()
})

export default mongoose.model('Content', ContentSchema)