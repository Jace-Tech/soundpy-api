import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { handleGetUserProfile, handleProfileImageUpload, handleUpdateProfile } from '../controllers/profile.controller';
import roles from "../configs/roles"
import { handleUpdateUserProfle } from '../controllers/user.controller';


const profileRoutes = Router()


// UPDATE PROFILE ROUTE
profileRoutes.post("/", authMiddleware(roles.USER) as any, handleUpdateUserProfle as any)

// GET USER PROFILE DATA
profileRoutes.get("/:username", authMiddleware(roles.USER) as any, handleGetUserProfile as any)


// Routes Here
profileRoutes.patch("/:id", authMiddleware(roles.USER) as any, handleUpdateProfile as any)
profileRoutes.post("/image/", authMiddleware(roles.USER) as any, handleProfileImageUpload as any)



export default profileRoutes