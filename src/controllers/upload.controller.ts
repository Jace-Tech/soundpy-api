import { response } from "../utils/response";
import { BadRequestError } from "../utils/customError";
import { Request, Response } from "express";
import { fileUpload } from "../utils/uploader";



export const handleUpload = async (req: Request, res: Response) => {
  if (!req.body.image) throw new BadRequestError("Image not specified");
  const data = await fileUpload(req.body.image);
  res.status(200).send(response("Image url generated", data, true));
};
