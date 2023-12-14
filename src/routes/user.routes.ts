import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import roles from '../configs/roles';
import { isActiveMiddleware } from '../middlewares/active.middleware';
import { handleGetAllUsers, handleUserFollow, handleGetUserFollow } from '../controllers/user.controller';
import { handleGetUsersContent, handleGetUsersPlaylist } from '../controllers/playlist.controller';


const userRoutes = Router()

// GET USERS ROUTE
userRoutes.get("/", authMiddleware(roles.ADMIN) as any, isActiveMiddleware as any, handleGetAllUsers as any)

// FOLLOW USER ROUTE
userRoutes.post("/:id/follow", authMiddleware(roles.USER) as any, isActiveMiddleware as any, handleUserFollow as any)

// GET USERS FOLLOWERS
userRoutes.get("/followers", authMiddleware(roles.USER) as any, handleGetUserFollow as any)

// USER PLAYLIST
userRoutes.get("/playlist", authMiddleware(roles.USER) as any, isActiveMiddleware as any, handleGetUsersPlaylist as any)

// USERS CONTENT
userRoutes.get("/content", authMiddleware(roles.USER) as any, isActiveMiddleware as any, handleGetUsersContent as any)


export default userRoutes
