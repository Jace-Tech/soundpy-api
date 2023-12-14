import mongoose, { Document } from "mongoose";

export interface IUser {
  _id?: mongoose.Schema.Types.ObjectId;
  userId?: string;
  wallet?: string;
  username: string;
  musicName?: string;
  musicCareer?: string;
  dateRegistered: Date;
  lastSubcriptionDate: Date;
  bio?: string;
  genre?:  mongoose.Schema.Types.ObjectId;
  profileImage?: string;
  coverImage?: string;
  shadowBanned?: boolean;
  isSubscribed?: boolean;
  gender?: string;
  password?: string;
  country?: string;
  isVerified?: boolean;
  isActive?: boolean;
  canMessage?: boolean;
  accessToken?: string;
  email?: string;
  role?: string;
}

export interface INotification {
  _id?: mongoose.Schema.Types.ObjectId;
  user?: mongoose.Schema.Types.ObjectId;
  message: string;
  title?: string;
  type?: string;
  link?: string;
  isRead?: boolean;
}

export interface IReport {
  _id?: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  message?: string;
  email: string;
  title: string;
}


export interface IToken {
  _id?: mongoose.Schema.Types.ObjectId;
  email: string;
  code: string;
  expires: Date;
}


export interface ILike {
  _id?: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  content: mongoose.Schema.Types.ObjectId;
}



export interface IPurchaseContent {
  _id?: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  transaction: mongoose.Schema.Types.ObjectId;
  content: mongoose.Schema.Types.ObjectId;
}


export interface IPlaylist {
  _id?: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  content: mongoose.Schema.Types.ObjectId;
  lastTimePlayed: Date;
}

export interface IContent {
  _id?: mongoose.Schema.Types.ObjectId;
  user?: mongoose.Schema.Types.ObjectId;
  type: string;
  title: string;
  features?: string[];
  genre: mongoose.Schema.Types.ObjectId;
  price: number | null;
  coverImage: string;
  contentUrl: string; 
  displayCutUrl: string;
  isDeleted: boolean;
  isActive: boolean;
  metadata: {},
  date: Date
}

export interface IFollower {
  _id?: mongoose.Schema.Types.ObjectId;
  user?: mongoose.Schema.Types.ObjectId;
  follower: mongoose.Schema.Types.ObjectId;
  date: Date
}

export interface ISocialLink {
  _id?: mongoose.Schema.Types.ObjectId;
  user?: mongoose.Schema.Types.ObjectId;
  name: string;
  link: string;
}

export interface IAppSettings {
  _id?: mongoose.Schema.Types.ObjectId;
  contentPrice: number;
  subscriptionPrice: number;
  appName: string;
  stakePrice: number;
}

export interface IComment {
  _id?: mongoose.Schema.Types.ObjectId;
  user:  mongoose.Schema.Types.ObjectId;
  content:  mongoose.Schema.Types.ObjectId;
  comment: string;
  date: Date;
}

export interface IGenre {
  _id?: mongoose.Schema.Types.ObjectId;
  name: string;
}

export interface IBlockedUser {
  _id: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  blockedUser: mongoose.Schema.Types.ObjectId;
}

export interface IBlockedContent {
  _id: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  content: mongoose.Schema.Types.ObjectId;
}

export interface ITransaction {
  _id: mongoose.Schema.Types.ObjectId;
  piPaymentId: string;
  isCredit: boolean;
  trxId: string;
  desc?: string;
  meta?: any;
  amount: number;
  user: mongoose.Schema.Types.ObjectId;
  status: "pending" | "success" | "cancelled" | "error",
  type: string;
}

export interface IRoyalty {
  user: mongoose.Schema.Types.ObjectId;
  isClaimed: boolean;
  amount: number;
  transaction: ongoose.Schema.Types.ObjectId;
}