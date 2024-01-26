import mongoose, { Model, Types } from "mongoose";
import { IUser } from "../types/models";
import Joi from "joi";
import { AuthResult, UserDTO } from "../types/common";

const UserSchema = new mongoose.Schema<IUser>(
  {
    userId: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: null
    },
    email:  {
      type: String,
      default: null
    },
    coverImage:  {
      type: String,
      default: null
    },
    musicName:  {
      type: String,
      default: null
    },
    musicCareer:  {
      type: String,
      enum: ["producer", "artist", "music lover"],
    },
    genre:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
      default: null
    },
    gender:  {
      type: String,
      enum: ["male", "female", null],
      default: null
    },
    profileImage:  {
      type: String,
      default: null
    },
    shadowBanned: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accessToken: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    dateRegistered: {
      type: mongoose.Schema.Types.Date,
      default: Date.now(),
    },
    username: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: null,
    },
    isSubscribed: {
      type: Boolean,
      default: false
    },
    lastSubcriptionDate: {
      type: Date,
      default: null
    },  
    wallet: {
      type: String,
      default: null
    },
    xLink: {
      type: String,
      default: null
    },
    tiktokLink: {
      type: String,
      default: null
    },
    instaLink: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: false }
);


export const userLoginValidator = Joi.object<AuthResult>({
  accessToken: Joi.string().required(),
  user: Joi.object<UserDTO>({
    uid: Joi.string().max(50),
    username: Joi.string().required()
  })
})

export default mongoose.model("User", UserSchema);