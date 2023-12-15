import mongoose from "mongoose"
import { INotification } from "../types/models"

const notificationSchema = new mongoose.Schema<INotification>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    required: false,
    default: null
  },
  message: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: null
  },
  link: {
    type: String,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

export default mongoose.model("notification", notificationSchema)