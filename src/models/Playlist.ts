import mongoose, { Model } from "mongoose";
import { IPlaylist } from "../types/models";

const PlaylistSchema = new mongoose.Schema<IPlaylist>({
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content",
    required: true
  },
  lastTimePlayed: {
    type: Date,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
},{ timestamps: false });

export default mongoose.model("Playlist", PlaylistSchema);