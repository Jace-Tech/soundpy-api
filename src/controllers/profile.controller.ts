import { Request, Response } from "express";
import { RequestAlt } from "../types/common";
import { BadRequestError, NotFoundError, UnAuthorizedError } from "../utils/customError";
import User from "../models/User";
import { response } from "../utils/response";
import { IUser } from "../types/models";
import { fileUpload } from "../utils/uploader";
import { except } from "../utils/functions";
import { Types } from "mongoose";
import Follower from "../models/Follower";
import { getContents } from "../store/content";


export const getUserFollowers = async (id: any) => {
  if (!id) return { followers: [], following: [] }

  const followers = await Follower.find({ user: id }).populate(["user", "follower"])
  const following = await Follower.find({ follower: id }).populate(["user", "follower"])

  const data = {
    followers,
    following,
  }

  return data
}


export const handleUpdateProfile = async (req: Request<{ id: any }> & RequestAlt, res: Response) => {
  if (!req.params.id) throw new UnAuthorizedError("ID param is required")

  const user = await User.findById(req.params.id).populate("genre")
  if (!user) throw new NotFoundError("User not found")

  const prevData = user.toObject()
  const update = await user.update({ ...prevData, ...req.body }, { new: true })

  res.status(201).send(response("Profile updated!", update))
}


// HANDLE GET USER'S PROFILE
export const handleGetUserProfile = async (req: Request<{ username: any }> & RequestAlt, res: Response) => {
  if (!req.params.username) throw new BadRequestError("Username is required")

  // GET USER DATA
  const user = await User.findOne({ username: req.params.username }).populate("genre")
  if (!user) throw new NotFoundError("User not found")

  // GET USERS FOLLOWERS
  const userFollow = await getUserFollowers(user._id)

  // USERS CONTENT
  // const contents = await getContents(user._id, req as any, { user: user._id })

  const data = {
    ...except(user.toObject(), "password"),
    ...userFollow,
    // contents
  }

  res.status(201).send(response("Profile data!", data))
}



// UPDATE USERS DP
export const handleProfileImageUpload = async (req: Request<{}, {}, IUser> & RequestAlt, res: Response) => {
  if (!req.body.image) throw new BadRequestError("Image is required")
  if (!req.body.name) throw new BadRequestError("Name is required")

  // GET USER
  const user = await User.findById(req.user?._id).populate("genre")
  if (!user) throw new NotFoundError("User not found")

  // UPLOAD IMAGE TO CLOUDINARY
  const data = await fileUpload(req.body.image, req.user.username)
  if (!data) return res.status(500).send(response("Failed to upload profile", null, false))

  const prevData = user.toObject()
  const update = await User.findByIdAndUpdate(req.user._id, { ...prevData, [req.body.name]: data.url }, { new: true }).populate("genre")

  res.status(200).send(response("Profile image updated!", update))

}