import nodemailer, { TransportOptions } from 'nodemailer';
import dotenv from "dotenv";
import configs from "../configs/env"
import { CustomError } from './customError';
import ENV from "./../configs/env"

dotenv.config()

/**
 * It sends an email to the specified recipient(s) using the specified subject and message
 * @param {string[] | string} to - The email address of the recipient
 * @param {string} subject - The subject of the email
 * @param {string} message - The message to be sent
 * @param {string} [from] - The email address that the email is sent from.
 * @returns A boolean
 */

export const sendMail = async (to: string[] | string, subject: string, message: string, from?: string) => {
  from = from || `${ENV.APP_NAME} <no-reply${process.env.APP_DOMAIN}>`
  if(!to) return
  
  // create reus able transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: ENV.MAIL_HOST,
    port: ENV.MAIL_PORT,
    // secure: false,
    auth: {
      user: ENV.MAIL_USERNAME,
      pass: ENV.MAIL_PASSWORD
    }
  });

  // send mail with defined transport object
  const result = await transporter.sendMail({
    from, // sender address
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    // text: "Hello world?", // plain text body
    html: message, // html body,
    contentType: "text/html"
  } as any);

  if(!result) throw new CustomError("Unable to send email")

  return true
}