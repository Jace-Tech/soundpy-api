import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import roles from '../configs/roles';
import { isActiveMiddleware } from '../middlewares/active.middleware';
import { handleAddContent, handleBlockContent, handleContentComment, handleDeleteContent, handleGetAllContents, handleGetUserContents, handleLikeContent, handleReportContent } from '../controllers/content.controller';
import multer from '../utils/multer';


const contentRoutes = Router()


// CREATE CONTENT ROUTE
contentRoutes.post("/create", authMiddleware(roles.USER) as any, isActiveMiddleware as any, multer.any(), handleAddContent as any)

// GET ALL CONTENTS ROUTE
contentRoutes.get("/", authMiddleware(roles.USER) as any, handleGetAllContents as any)

// GET USER CONTENT ROUTE
contentRoutes.get("/user", authMiddleware(roles.USER) as any, handleGetUserContents as any)

// DELETE ONE CONTENT ROUTE
contentRoutes.delete("/:id", authMiddleware(roles.USER) as any, isActiveMiddleware as any, handleDeleteContent as any)

// LIKE CONTENT ROUTE
contentRoutes.post("/:id/react", authMiddleware(roles.USER) as any, isActiveMiddleware as any, handleLikeContent as any)

// COMMENT CONTENT ROUTE
contentRoutes.post("/:id/comment", authMiddleware(roles.USER) as any, isActiveMiddleware as any, handleContentComment as any)

// BLOCK CONTENT ROUTE
contentRoutes.patch("/:id/block", authMiddleware(roles.USER) as any, isActiveMiddleware as any, handleBlockContent as any)
contentRoutes.put("/:id/block", authMiddleware(roles.USER) as any, isActiveMiddleware as any, handleBlockContent as any)

// REPORT CONTENT ROUTE
contentRoutes.post("/:id/report", authMiddleware(roles.USER) as any, isActiveMiddleware as any, handleReportContent as any)


export default contentRoutes