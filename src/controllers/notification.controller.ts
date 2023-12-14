import { Request, Response } from "express";
import { RequestAlt } from "../types/common";
import Notification from "../models/Notification";
import { response } from "../utils/response";

export const handleGetUserNotification = async (req: Request & RequestAlt, res: Response) => {
  const usersNotifications = await Notification.find({ _id: req.user._id })
  res.status(200).send(response("Notifications", usersNotifications))
}


