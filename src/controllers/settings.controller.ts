import { Response } from "express"
import { RequestAlt } from "../types/common"
import { BadRequestError } from "../utils/customError"
import AppSettings from "../models/AppSettings"
import { response } from "../utils/response"

// HANDLES GET SETTINGS 
export const handleGetAppSettings = async (req: RequestAlt, res: Response) => {
    const settings = await AppSettings.findOne({})
    res.status(201).send(response("App settings!", settings))
}

// HANDLES SETTINGS UPDATE
export const handleUpdateAppSettings = async (req: RequestAlt, res: Response) => {
    const settings = await AppSettings.findOne({})
    if(!settings) {
        // CREATE NEW ONE
        const setting = await AppSettings.create(req.body)
        return res.status(201).send(response("App settings updated!", setting))
    }

    const updatedSettings = await AppSettings.findByIdAndUpdate(settings?._id, req.body, { new: true })
    res.status(201).send(response("App settings updated!", updatedSettings))
}
