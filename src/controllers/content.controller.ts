import { Request, Response } from "express";
import { IContent, INotification } from "../types/models";
import { BadRequestError, NotFoundError, ServerError } from "../utils/customError";
import { fileUpload, uploadBinary } from "../utils/uploader";
import { getSlug } from "../utils/functions";
import Content from "../models/Content";
import { PaymentDTO, RequestAlt } from "../types/common";
import { NotifyAdmin, NotifyUser } from "./common.controller";
import { response } from "../utils/response";
import BlockedContent from "../models/BlockedContent";
import Like from "../models/Like";
import Comment from "../models/Comment";
import { getContents } from "../store/content";
import Report from "../models/Report";
import Transaction from "../models/Transaction";
import Reply from "../models/Reply";

// HANDLES CONTENT UPLOAD
export const handleAddContent = async (req: Request<{}, {}, IContent & { file: any }> & RequestAlt, res: Response) => {	 
  if(!req.body.title) throw new BadRequestError("Title is required!")
  if(!req.body.genre) throw new BadRequestError("Genre is required!")
  if(!req.body.type) throw new BadRequestError("Type is required!")
  if(!req.body.paymentId) throw new BadRequestError("PaymentId is required!")
  if(!req.body.txid) throw new BadRequestError("txid is required!")


  // CHECH FILES

  // META DATA CHECKS

  // GET TRANSACTION
  const transaction = await Transaction.findOne({ piPaymentId: req.body.paymentId })
  if(!transaction) throw new BadRequestError("Pay stake price to continue")
  if(transaction.status !== "success") throw new BadRequestError("Transaction was not success");

  // CHECK IF CONTENT EXISTS
  const exists = await Content.findOne({ title:req.body.title, genre: req.body.genre, type: "beat", user: req.user._id })
  if(exists && exists.price) {
    // REPORT TO ADMIN
    const notification: INotification = {
      message: `<b>${req.user.username}</b> Tried to update same paid beat twice ${exists.title}`,
      type: "content",
      title: "Content reaper caught!"
    }
    await NotifyAdmin(notification)
    throw new BadRequestError("Can't upload same beat twice.")
  }

  // UPLOAD FILES TO CLOUDINARY
  const uploaded: any = {}
  const files = req.files!

  for(const file of (files as any)) {
    const data = await uploadBinary(file).catch(e => null)
    uploaded[file.fieldname] = (data as any).secure_url
  }

  // CREATE CONTENT
  const content = await Content.create({
    ...req.body,
    coverImage: uploaded.coverImage,
    contentUrl: uploaded.file,
    user: req.user._id,
  })

  // NOTIFY ADMIN
  const notification: INotification = {
    message: `<b>${req.user.username}</b> uploaded a new content ${content.title}`,
    type: "content",
    title: "Content Upload"
  }
  await NotifyAdmin(notification)

  res.status(201).send(response("Content Uploaded!", content))
}

// HANDLE DELETE CONTENT [SOFT]
export const handleDeleteContent = async (req: RequestAlt, res: Response) => {
  if(!req.params.id) throw new BadRequestError("Content id is required!")

  // CHECK IF CONTENT EXISTS
  const content = await Content.findById(req.params.id)
  if(!content) throw new NotFoundError("Content does not exist!")

  // DELETE CONTENT
  content.isDeleted = true
  const updated = await content.save()

  res.status(200).send(response("Content Deleted!", updated))
}

// HANDLES GET CONTENT WITH LIKE & COMMENTS
export const handleGetAllContents = async (req: RequestAlt, res: Response) => {
  const contents = await getContents(req.user._id, req as any)
  res.status(200).send(response("All contents", contents))
}

// HANDLES GET USER CONTENT WITH LIKE & COMMENTS
export const handleGetUserContents = async (req: RequestAlt, res: Response) => {
  const contents = await getContents(req.params.id, req as any, { user: req.params.id })
  res.status(200).send(response("My contents", contents))
}

// HANDLES GET USER CONTENT WITH LIKE & COMMENTS
export const handleGetContentLikes = async (req: RequestAlt, res: Response) => {
  const id = req.params.id
  if(!id) throw new BadRequestError("Content id is required")
  const likes = await Like.find({ content: id }).populate(['user', 'content'])
  res.status(200).send(response("Content likes", likes))
}

// ROUTE: /api/v1/content/:id/react
// ROUTE PARAMS:
// - :id -> Content id
// HEADERS:
// - Authorization
// HANDLES CONTENT LIKE & UNLIKE
export const handleLikeContent = async (req: RequestAlt, res: Response) => {
  if(!req.params.id) throw new BadRequestError("Content id param is required!")

  // CHECK IF CONTENT EXISTS
  const content = await Content.findById(req.params.id).populate(["user", "genre"])
  if(!content) throw new NotFoundError("Content does not exist!")


  // CHECK IF LIKE EXISTS
  const check = await Like.findOne({ user: req.user._id, content: req.params.id })
  if (check) {
    // DELETE LIKE
    await check.delete()
    
    // GET CONTENT'S LIKE AND COMMENTS
    const contentLikes = await Like.find({ content: req.params.id }).populate(['user', 'content'])
    const contentComments = await Comment.find({ content: req.params.id }).populate(['user', 'content'])

    // UPDATE THE DATA OBJECT
    const data = {
      ...content.toObject(),
      likes: contentLikes,
      comments: contentComments
    }

    // ADD NOTIFICATION
    

    // SEND BACK REQUEST
    return res.status(200).send(response("Post unliked!", data))
  }

  // LIKE POST
  await Like.create({ user: req.user._id, content: req.params.id })

  // GET CONTENT'S LIKE AND COMMENTS
  const contentLikes = await Like.find({ content: req.params.id }).populate(['user', 'content'])
  const contentComments = await Comment.find({ content: req.params.id }).populate(['user', 'content'])

  // UPDATE THE DATA OBJECT
  const data = {
    ...content.toObject(),
    likes: contentLikes,
    comments: contentComments
  }

  // NOTIFY USER
  const notification: INotification = {
    message: `<b>${req.user.username}</b> liked your content "${content.title}"`,
    type: "content"
  }
  await NotifyUser(content.user!, notification)

  // SEND BACK REQUEST
  return res.status(200).send(response("Post liked!", data))
}

// HANDLE COMMENT ON CONTENT
export const handleContentComment = async (req: RequestAlt, res: Response) => {
  if(!req.params.id) throw new BadRequestError("Content id is required!")
  if(!req.body.comment) throw new BadRequestError("Comment is required!")

  // CHECK IF CONTENT EXISTS
  const content = await Content.findById(req.params.id)
  if(!content) throw new NotFoundError("Content does not exist!")

  // CREATE COMMENT
  const comment = await Comment.create({
    user: req.user._id,
    comment: req.body.comment,
    content: req.params.id,
  })
  await comment.populate(['user', 'content'])

  // NOTIFY USER
  const notification: INotification = {
    message: `<b>${req.user.username}</b> commented on your content "${content.title}"`,
    type: "content"
  }
  await NotifyUser(content.user!, notification)

  res.status(201).send(response("Comment posted!", comment))
}

// HANDLE COMMENT ON CONTENT
export const handleContentCommentReply = async (req: RequestAlt, res: Response) => {
  if(!req.params.id) throw new BadRequestError("Comment id is required!")
  if(!req.body.comment) throw new BadRequestError("Reply is required!")

  // CHECK IF CONTENT EXISTS
  const comment = await Comment.findById(req.params.id)
  if(!comment) throw new NotFoundError("Comment does not exist!")

  // CREATE COMMENT
  const reply = await Reply.create({
    user: req.user._id,
    reply: req.body.comment,
    comment: req.params.id,
  })
  await reply.populate(['user', 'comment'])

  // NOTIFY USER
  const notification: INotification = {
    message: `<b>${req.user.username}</b> replied your comment`,
    type: "reply"
  }
  await NotifyUser(comment.user!, notification)

  res.status(201).send(response("Comment posted!", reply))
}

// HANDLE COMMENT ON CONTENT
export const handleBlockContent = async (req: RequestAlt, res: Response) => {
  if(!req.params.id) throw new BadRequestError("Content id is required!")

  // CHECK IF CONTENT EXISTS
  const content = await Content.findById(req.params.id)
  if(!content) throw new NotFoundError("Content does not exist!")

  // ADD TO BLOCKED CONTENTS
  await BlockedContent.create({
    content: req.params.id,
    user: req.user._id
  })
  
  const contents = await getContents(req.user._id)
  res.status(201).send(response("Comment created!", contents))
}

// HANDLE REPORT CONTENT 
export const handleReportContent = async (req: RequestAlt, res: Response) => {
  if(!req.params.id) throw new BadRequestError("Content id is required!")
  if(!req.body.title) throw new BadRequestError("Title is required!")
  if(!req.body.email) throw new BadRequestError("Email is required!")
  if(!req.body.message) throw new BadRequestError("Message is required!")

  // CHECK IF CONTENT EXISTS
  const content = await Content.findById(req.params.id)
  if(!content) throw new NotFoundError("Content does not exist!")

  // CREATE REPORT
  const report = await Report.create({
    ...req.body,
    user: req.user._id
  })

  await report.populate("user")

  // NOTIFY ADMIN
  const notification: INotification = {
    message: `<b>${req.user.username}</b> submitted a new report on a content ${content.title}`,
    type: "report",
    title: "Content Report"
  }
  await NotifyAdmin(notification)

  res.status(201).send(response("Report submitted!", report))
}