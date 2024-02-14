 import mongoose from "mongoose";
import Comment from "../models/Comment";
import Reply from "../models/Reply";

export const getContentComments = async ( contentId: mongoose.Schema.Types.ObjectId ) => {
  try {
    const comments = await Comment.find({ content: contentId }).populate(['user', 'content'])
    const allComments = []
    for (const comment of comments) {
        const reply = await Reply.find({ comment: comment._id }).populate('user')
        const item = { ...comment.toObject(), reply }
        allComments.push(item)
    }
    return allComments
  } catch (error: any) {
    return []
  }
};
