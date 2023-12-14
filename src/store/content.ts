import { Request } from "express"
import BlockedContent from "../models/BlockedContent"
import BlockedUser from "../models/BlockedUser"
import Comment from "../models/Comment"
import Content from "../models/Content"
import Like from "../models/Like"
import Playlist from "../models/Playlist"
import PurchasedContents from "../models/PurchasedContents"
import { RequestAlt } from "../types/common"

export const getContents = async (userId: any, req?: RequestAlt, filter?: any) => {

  const page = Number(req?.query.page) || 1
  const perPage = Number(req?.query.perPage) || 12
  let total = 0

  const contents = []
  // GET TOTAL
  total =  await Content.find({ isDeleted: false, ...filter }).populate(["user", "genre"]).count()

  // GET PAGINATED DATA
  let allContents = await Content.find({ isDeleted: false, ...filter })
    .populate(["user", "genre"])
    .sort({ createdAt: -1 }) // Sorting in descending order based on createdAt field
    .skip((page - 1) * perPage)
    .limit(perPage);

  if (req?.query.type) {
    total = await Content.find({ isDeleted: false, type: req.query.type, ...filter }).populate(["user", "genre"]).count()
    allContents = await Content.find({ isDeleted: false, type: req.query.type, ...filter })
      .populate(["user", "genre"])
      .sort({ createdAt: -1 }) // Sorting in descending order based on createdAt field
      .skip((page - 1) * perPage)
      .limit(perPage);
  }
  const allBlockedContents = await BlockedContent.find({ user: userId })
  const allBlockedUsers = await BlockedUser.find({ user: userId })

  for (const content of allContents) {
    if (allBlockedContents.find(item => item.content === content._id)
      || allBlockedUsers.find(item => item.user === userId)) continue;

    // GET CONTENT LIKES AND COMMENTS
    const likes = await Like.find({ content: content._id }).populate(["content", "user"]).sort({ createdAt: -1 })
    const comments = await Comment.find({ content: content._id }).populate(["content", "user"]).sort({ createdAt: -1 })
    const playlists = await Playlist.find({ content: content._id }).populate(["content", "user"]).sort({ createdAt: -1 })
    const isPurchased = await PurchasedContents.findOne({ user: req?.user._id, content: content._id })

    contents.push({
      ...content.toObject(),
      likes,
      comments,
      playlists,
      isPurchased: Boolean(isPurchased)
    })
  }
  return { contents, page, perPage, total}
}

export const getOneContents = async (id: any, req?: RequestAlt) => {

  // GET PAGINATED DATA
  let item = await Content.findOne({ _id: id, isDeleted: false }).populate(["user", "genre"])
  if(!item) return {}
  // GET CONTENT LIKES AND COMMENTS
  const likes = await Like.find({ content: item._id }).populate(["content", "user"]).sort({ createdAt: -1 })
  const comments = await Comment.find({ content: item._id }).populate(["content", "user"]).sort({ createdAt: -1 })
  const playlists = await Playlist.find({ content: item._id }).populate(["content", "user"]).sort({ createdAt: -1 })
  const isPurchased = await PurchasedContents.findOne({ user: req?.user._id, content: item._id })

  const contents = {
    ...item.toObject(),
    likes,
    comments,
    playlists,
    isPurchased: Boolean(isPurchased),
  };
  return contents
}