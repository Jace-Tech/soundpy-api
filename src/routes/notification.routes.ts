import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { isActiveMiddleware } from '../middlewares/active.middleware';
import { handleGetUserNotification } from '../controllers/notification.controller';
import roles from "../configs/roles"

const notificationRoute = Router()

notificationRoute.get("/:user", authMiddleware(roles.USER) as any, isActiveMiddleware as any, handleGetUserNotification as any)
// Routes Here
export default notificationRoute