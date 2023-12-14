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