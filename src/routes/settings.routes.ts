import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import roles from "../configs/roles";
import { handleGetAppSettings, handleUpdateAppSettings } from "../controllers/settings.controller";

const settingsRoutes = Router();

// Routes Here

// ALL GENRE ROUTE
settingsRoutes.get("/", authMiddleware(roles.USER) as any, handleGetAppSettings as any)

// UPDATE GENRE ROUTE
settingsRoutes.route("/")
    .put(authMiddleware(roles.ADMIN) as any, handleUpdateAppSettings as any)
    .patch(authMiddleware(roles.ADMIN) as any, handleUpdateAppSettings as any)

export default settingsRoutes;
