import mongoose from 'mongoose';
import Notification from '../models/Notification';
import User from '../models/User';
import { sendMail } from '../utils/mailer';
import { INotification } from './../types/models.d';

export const NotifyAdmin = async (data: INotification) => {
  const admin = await User.findOne({ role: "admin" })
  if(!admin) return 

  // SEND NOTIFICATION
  await Notification.create({ ...data, user: admin._id })

  // SEND EMAIL
  const message = `
    <h3>${data.title}</h3>
    <p>${data.message}</p>
  `

  // await sendMail(admin.email!, data.title!, message)
}

export const NotifyUser = async (id: mongoose.Schema.Types.ObjectId, data: INotification, sendEmail = false) => {
  const user = await User.findOne({ _id: id })
  if(!user) return 

  // SEND NOTIFICATION
  await Notification.create({ ...data, user: user._id })

  if (sendEmail) {
    // SEND EMAIL
    const message = `
      <h3>${data.title ?? "Notification from Sound pi"}</h3>
      <p>${data.message}</p>
    `
  
    await sendMail(user.email!, data.title || "Notification from Sound pi", message)
  }
}