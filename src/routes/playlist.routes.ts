import { Router } from "express"
import { handleAddToPlaylist, handleDeleteFromPlaylist, handlePlayFromPlaylist } from '../controllers/playlist.controller';
import { authMiddleware } from "../middlewares/auth.middleware";
import roles from "../configs/roles";
import { isActiveMiddleware } from "../middlewares/active.middleware";

const playlistRoute = Router()


// ADD TO PLAYLIST ROUTE
playlistRoute.post("/", authMiddleware(roles.USER) as any, isActiveMiddleware as any, handleAddToPlaylist as any)

// UPDATE CONTENT PLAYTIME
playlistRoute.get("/:id/played", authMiddleware(roles.USER) as any, handlePlayFromPlaylist as any)

// REMOVE FROM PLAYLIST ROUTE
playlistRoute.delete("/", authMiddleware(roles.USER) as any, isActiveMiddleware as any, handleDeleteFromPlaylist as any)

export default playlistRoute