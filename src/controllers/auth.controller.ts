import { Request, Response } from "express";
import { AuthResult } from "../types/common";
import { BadRequestError, NotFoundError, UnAuthorizedError } from "../utils/customError";
import User, { userLoginValidator } from "../models/User";
import { generateToken } from "../utils/token";
import { response } from "../utils/response";
import { NotifyAdmin } from "./common.controller";
import { INotification } from "../types/models";
import { compare, hash } from "bcrypt"

import axios from "axios"
import { USER_ENDPOINT } from "../utils/contants";
import { except, generateRandNumber } from "../utils/functions";
import Token from "../models/Token";
import { sendMail } from "../utils/mailer";


// SIGN IN
export const handleSignIn = async (req: Request<{}, {}, AuthResult>, res: Response) => {
  // VALIDATE THE DATA
  // console.log(JSON.stringify(req.body, null, 4))
  const { error, value } = userLoginValidator.validate(req.body)
  if (error) throw new BadRequestError(error.details.map(err => err.message).join(', '));

  // VERIFY IF USER IS A REAL PIONEER
  const headers = {
    "Authorization": `Bearer ${value.accessToken}`
  }
  const { data, status } = await axios.get(USER_ENDPOINT, { headers })
  if (!(status > 100 && status < 300)) throw new NotFoundError("Pioneer not found")

  // CHECK IF USER ALREADY EXISTS
  let user = await User.findOne({
    $or: [
      { userId: data.uid }, { username: data.username }
    ]
  }).populate("genre")

  // SIGN IN USER IF EXISTS
  if (user) {
    // TODO: SEND LOGIN MESSAGE

    // CHECK IF ACCOUNT IS ACTIVE
    if (!user.isActive) throw new UnAuthorizedError("Account not active")

    const token = generateToken({ userId: user._id as any, role: user.role! })
    return res.status(200).send(response("Logged in", { user, token, isNew: false }))
  }

  // ELSE IF NOT EXISTING
  user = await User.create({ ...data, userId: data.uid, accessToken: value.accessToken })

  // NOTIFY ADMIN
  const notification: INotification = {
    message: `A new user <b>${user.username}</b> just signed in`,
    title: "Account Creation"
  }
  await NotifyAdmin(notification)

  // SEND RESPONSE
  const token = generateToken({ userId: user._id as any, role: user.role! })
  res.status(201).send(response("Account Created!", { user, token, isNew: true }))
}

// ADMIN REGISTER
export const handleRegisterAdmin = async (req: Request, res: Response) => {
  if (!req.body.code) throw new BadRequestError("Admin secret is required");
  if (!req.body.email) throw new BadRequestError("Email is required");
  if (!req.body.password) throw new BadRequestError("Password is required");


  // CHECK IF CODES MATCH
  const code = process.env.ADMIN_SECRET_CODE
  if (req.body.code !== code) throw new BadRequestError("Incorrect Admin Code");

  // CHECK IF ACCOUNT EXIST
  const exists = await User.find({ email: req.body.email }).count()
  if (exists) throw new BadRequestError("Email already exists!");

  // HASH PASSWORD
  const hashedPassword = await hash(req.body.password, 10)

  // CREATE ADMIN [USER]
  const admin = await User.create({
    role: 'admin',
    password: hashedPassword,
    email: req.body.email,
    username: req.body.username || "ADMIN"
  })

  const data = except(admin.toObject(), "password", "__v")

  // SEND BACK RESPONSE
  res.status(201).send(response("Admin created!", data))
}


// ADMIN LOGIN
export const handleLoginAdmin = async (req: Request, res: Response) => {
  if (!req.body.email) throw new BadRequestError("Email is required");
  if (!req.body.password) throw new BadRequestError("Password is required");

  // CHECK ADMIN [USER]
  const admin = await User.findOne({ email: req.body.email }).populate("genre")



  if (!admin) throw new NotFoundError("Invalid credentials")

  // CHECK IF PASSWORDS MATCH
  if (! await compare(req.body.password, admin.password!)) throw new BadRequestError("Invalid credentials")

  // SEND BACK RESPONSE
  const token = generateToken({ userId: admin._id as any, role: admin.role! })
  const data = {
    ...except(admin.toObject(), "password", "__v")
  }
  return res.status(200).send(response("Logged in", { admin: data, token }))
}


// VERIFY EMAIL [INITIALIZE]
export const handleInitializeVerifyEmail = async (req: Request, res: Response) => {
  if (!req.body.email) throw new BadRequestError("Email is required")

  // DELETE PREV TOKEN IF ANY
  await Token.find({ email: req.body.email }).deleteMany()

  const code = generateRandNumber(6)
  const expires = Date.now() + (10 * 60 * 1000) // 10 mins
  await Token.create({ code, email: req.body.email, expires })

  // SEND EMAIL
  const message = `<h2>Here is your email verification code <b>${code}</b></h2>`
  await sendMail(req.body.email, "Email Verification", message)

  res.status(200).send("Token send to your email, Token expires in 10 minutes")
}


// VERIFY EMAIL
export const handleVerifyEmail = async (req: Request, res: Response) => {
  if (!req.body.email) throw new BadRequestError("Email is required")
  if (!req.body.token) throw new BadRequestError("Token is required")

  // CHECK TOKEN
  const storedToken = await Token.findOne({ email: req.body.email, token: req.body.token })
  if (!storedToken) throw new BadRequestError("Invalid token")

  // CHECK EXPIRY
  const now = Date.now()
  const expiryTime = Date.parse(storedToken.expires as any)
  if (now > expiryTime) {
    // DELETE TOKEN
    await storedToken.delete()
    throw new BadRequestError("Token has expired")
  }

  // SEND EMAIL
  const message = `<h2>Email verification successful</h2>`
  await sendMail(req.body.email, "Email Verification", message)

  res.status(200).send("Email verification successful")
}