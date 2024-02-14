import mongoose from "mongoose"
import Like from "../models/Like"

export const getContentLikes = async (contentId: mongoose.Schema.Types.ObjectId) => {
    try {
        const likes = await Like.find({ content: contentId }).populate(['user', 'content'])
        return likes
    } catch (error: any) {
        return []
    }
}