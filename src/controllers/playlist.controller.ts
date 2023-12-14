import { Response } from "express"
import { BadRequestError } from "../utils/customError"
import { RequestAlt } from "../types/common"
import Playlist from "../models/Playlist"
import { response } from "../utils/response"
import Content from "../models/Content"

// HANDLE ADD ITEM TO PLAYLIST
export const handleAddToPlaylist = async (req: RequestAlt, res: Response) => {
  if(!req.body.content) throw new BadRequestError("Content id is required!")

  // CHECK IF CONTENT ALREADY EXISTS
  const exists = await Playlist.findOne({ user: req.user._id, content: req.body.content })
  if(exists) throw new BadRequestError("Content is already in playlist")

  // ADD CONTENT
  const playlist = await Playlist.create({ user: req.user._id, content: req.body.content })
  await playlist.populate('content');

  res.status(201).send(response("Content added to playlist", playlist))
}

// HANDLE PLAY CONTENT IN PLAYLIST
export const handlePlayFromPlaylist = async (req: RequestAlt, res: Response) => {
  if(!req.body.content) throw new BadRequestError("Content id is required!")

  // CHECK IF CONTENT EXISTS
  const exists = await Playlist.findOne({ user: req.user._id, content: req.body.content }).populate(["user", "content"])
  if(!exists) throw new BadRequestError("Content is not found in playlist")

  // UPDATE CONTENT
  exists.lastTimePlayed = new Date()
  await exists.save()
  
  res.status(201).send(response("Content last play updated!", exists))
}


// HANDLE DELETE ITEM FROM PLAYLIST
export const handleDeleteFromPlaylist = async (req: RequestAlt, res: Response) => {
  if(!req.body.content) throw new BadRequestError("Content id is required!")

  // CHECK IF CONTENT EXISTS
  const exists = await Playlist.findOne({ user: req.user._id, content: req.body.content }).populate(["user", "content"])
  if(!exists) throw new BadRequestError("Content is not found in playlist")

  // DELETE CONTENT
  await exists.delete()
  res.status(201).send(response("Content deleted from playlist", exists))
}

// HANDLE GET USERS PLAYLIST
export const handleGetUsersPlaylist = async (req: RequestAlt, res: Response) => {
  const playlists = await Playlist.find({ user: req.user._id }).populate(["user", "content"])
  res.status(201).send(response("Playlist items", playlists))
}

// HANDLE GET USERS CONTENTS
export const handleGetUsersContent = async (req: RequestAlt, res: Response) => {
  const contents = await Content.find({ user: req.user._id }).populate("user")
  res.status(201).send(response("User's contents", contents))
}

