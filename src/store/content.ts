import BlockedContent from "../models/BlockedContent"
import BlockedUser from "../models/BlockedUser"
import Comment from "../models/Comment"
import Content from "../models/Content"
import Like from "../models/Like"
import Playlist from "../models/Playlist"
import PurchasedContents from "../models/PurchasedContents"
import { RequestAlt } from "../types/common"
import Reply from "../models/Reply"
import { getContentLikes } from "./likes"
import mongoose from "mongoose"
import { getContentComments } from "./comment"

export const getContents = async (userId: any, req?: RequestAlt, filter?: any) => {

  const page = Number(req?.query.page) || 1
  const perPage = Number(req?.query.perPage) || 12
  let total = 0

  const contents = []
  // GET TOTAL
  total =  await Content.find({ isDeleted: false, ...filter }).count()

  // GET PAGINATED DATA
  let allContents = await Content.find({ isDeleted: false, ...filter })
    .populate(["user", "genre"])
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);

  if (req?.query.type) {
    total = await Content.find({ isDeleted: false, type: req.query.type, ...filter }).count()
    allContents = await Content.find({ isDeleted: false, type: req.query.type, ...filter })
      .populate(["user", "genre"])
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);
  }
  
  const allBlockedContents = await BlockedContent.find({ user: userId })
  const allBlockedUsers = await BlockedUser.find({ user: userId })

  for (const content of allContents) {
    if (allBlockedContents.find(item => item.content === content._id)
      || allBlockedUsers.find(item => item.user === userId)) continue;

    // GET CONTENT LIKES AND COMMENTS
    const likes = await Like.find({ content: content._id }).count()
    const comments = await Comment.find({ content: content._id }).count()

    const playlists = await Playlist.find({ content: content._id }).count()
    const isPurchased = await PurchasedContents.findOne({ user: req?.user._id, content: content._id })
    const isLiked = await Like.findOne({ user: req?.user._id, content: content._id })
    const isMine = String((content.toObject().user as any)._id) == String(req?.user._id)
    // console.log("USER OBJ:",  String  ((content.toObject().user as any)._id))


    contents.push({
      ...content.toObject(),
      likes,
      isLiked: Boolean(isLiked),
      isMine: Boolean(isMine),
      comments,
      playlists,
      isPurchased: Boolean(isPurchased)
    })
  }
  const isLastPage = page === Math.ceil(total / perPage)
  return { contents, page, perPage, total, isLastPage }
}


export const getOneContent = async (id: any, req?: RequestAlt) => {

  // GET PAGINATED DATA
  let item = await Content.findOne({ _id: id, isDeleted: false }).populate(["user", "genre"])
  if(!item) return {}
  // GET CONTENT LIKES AND COMMENTS
  
  const likes = await Like.find({ content: id }).count()
  const comments = await Comment.find({ content: id }).count()
  
  const playlists = await Playlist.find({ content: id }).count()
  const isPurchased = await PurchasedContents.findOne({ user: req?.user._id, content: id })
  const isLiked = await Like.findOne({ user: req?.user._id, content: id })
  const isMine = String((item.toObject().user as any)._id) == String(req?.user._id)
  // console.log("USER OBJ:",  (item.toObject().user as any)._id)

  
  const contents = {
    ...item.toObject(),
    likes,
    comments,
    playlists,
    isLiked: Boolean(isLiked),
    isMine: Boolean(isMine),
    isPurchased: Boolean(isPurchased),
  };
  return contents
}

export const getLikesAndComment = async (id: mongoose.Schema.Types.ObjectId) => {
  const likes = await getContentLikes(id);
  const comments = await getContentComments(id);

  return { likes, comments }
}