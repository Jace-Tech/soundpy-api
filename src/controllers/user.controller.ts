import { Request, Response } from "express";
import { RequestAlt } from "../types/common";
import { BadRequestError, NotFoundError, UnAuthorizedError } from "../utils/customError";
import { INotification, IUser } from "../types/models";
import User from "../models/User";
import { NotifyAdmin } from "./common.controller";
import { response } from "../utils/response";
import { getPronoun } from "../utils/functions";
import Follower from "../models/Follower";
import { getUserFollowers } from "./profile.controller";


// HANDLES USERS PROFILE UPDATE
export const handleUpdateUserProfle = async (req: Request<{}, {}, IUser> & RequestAlt, res: Response) => {
  if (!req.user) throw new UnAuthorizedError("Unauthorized, please login to continue")
  if (!req.body.musicCareer) throw new BadRequestError("Music career is required")
  if (!req.body.musicName) throw new BadRequestError("Music name is required")
  if (!req.body.genre) throw new BadRequestError("Genre is required")

  // GET USERS DETAILS
  const user = await User.findById(req.user._id)

  // CHECK IF USER EXISTS
  if (!user) throw new NotFoundError("Unknown user, please login")

  // UPDATE THE PROFILE 
  const updatedProfile = await User.findByIdAndUpdate(req.user._id, {
    ...user?.toObject(),
    ...req.body
  }, { new: true }).populate("genre");

  // SEND ADMIN NOTIFICATION
  const pronoun = getPronoun(updatedProfile?.gender)
  const notification: INotification = {
    message: `<b>${user.username}</b> just <b>updated</b> ${pronoun} profile`,
    title: "Profile Update",
  }
  await NotifyAdmin(notification)

  res.status(201).send(response("Profile updated!", updatedProfile))
}

// HANDLES GET ALL USERS 
export const handleGetAllUsers = async (req: Request<{}, {}, IUser> & RequestAlt, res: Response) => {
  const users = await User.find({}).populate("genre")
  res.status(200).send(response("All users", users))
}

// HANDLE FOLLOW
export const handleUserFollow = async (req: RequestAlt, res: Response) => {
  if (!req.params.id) throw new BadRequestError("Person id is required")

  // CHECK IF USER EXISTS
  const person = await User.findById(req.params.id).populate("genre")
  if (!person) throw new NotFoundError("User does not exist")

  // CHECK IF ALREADY FOLLOWING
  const follow = await Follower.findOne({ user: req.params.id, follower: req.user._id })
  if (follow) {
    // UNFOLLOW USER
    await follow.delete()

    // GET FOLLOWERS AND THOSE FOLLOWED
    const userFollow = await getUserFollowers(req.user._id)

    const data = {
      ...req.user,
      ...userFollow
    }

    return res.status(200).send(response("User unfollowed!", data))
  }


  // FOLLOW USER
  await Follower.create({ user: req.params.id, follower: req.user._id })
  // GET FOLLOWERS AND THOSE FOLLOWED
  const followers = await Follower.find({ user: req.user._id })
  const following = await Follower.find({ follower: req.user._id })

  const data = {
    ...req.user,
    followers,
    following,
  }

  return res.status(200).send(response("User followed!", data))
}


export const handleGetUserFollow = async (req: RequestAlt, res: Response) => {
  const followers = await Follower.find({ user: req.user._id })
  const following = await Follower.find({ follower: req.user._id })

  const data = {
    followers,
    following,
  }

  return res.status(200).send(response("Followers!", data))
}
