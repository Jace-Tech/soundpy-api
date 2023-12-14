import { Router } from "express"
import { handleUpload } from "../controllers/upload.controller" 
const uploadRoute = Router()

// UPLOAD PICTURES
uploadRoute.post("/", handleUpload)

export default uploadRoute