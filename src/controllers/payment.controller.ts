import { Response } from "express"
import Transaction from "../models/Transaction"
import { PaymentDTO, RequestAlt } from "../types/common"
import { PI_APPROVE_ENDPOINT, PI_COMPLETE_ENDPOINT } from "../utils/contants"
import { BadRequestError, NotFoundError } from "../utils/customError"
import piRequest from "../utils/request"
import { response } from "../utils/response"
import User from "../models/User"
import Content from "../models/Content"
import Playlist from "../models/Playlist"
import PurchasedContents from "../models/PurchasedContents"


// GLOBAL APPROVE PAYMENT HANDLER
export const handleApprovePayment = async (req: RequestAlt, res: Response) => {
  if(!req.body.payment_id) throw new BadRequestError("Payment ID is required!")
  if(!req.body.type) throw new BadRequestError("Type is required!")
  if(!req.body.amount) throw new BadRequestError("Amount is required!")

  // CREATE A PAYMENT INFO
  const transaction = await Transaction.create({
    piPaymentId: req.body.payment_id,
    amount: req.body.amount,
    type: req.body.type,
    user: req.user._id,
    desc: req.body.description
  })

  // APPROVE TRANSACTION
  const paymentData = await piRequest.post(PI_APPROVE_ENDPOINT(req.body.payment_id));
  if(paymentData) {
    transaction.meta = paymentData.data as PaymentDTO
    await transaction.save()
  }
  res.status(200).send(response("Payment request approved, Proceed with transaction"))
}


// GLOBAL APPROVE PAYMENT HANDLER
export const handleIncompletePayment = async (req: RequestAlt, res: Response) => {
  if(!req.body.payment) throw new BadRequestError("Payment is required!")

  // CHECK IF THE PAYMENT EXISTS
  const payment = req.body.payment as PaymentDTO
  const transaction = await Transaction.findOne({ piPaymentId:  payment.identifier })
  if(!transaction) throw new NotFoundError("Transaction not found!")

  // APPROVE TRANSACTION
  await piRequest.post(PI_COMPLETE_ENDPOINT(payment.identifier), { txid: (payment.transaction && payment.transaction.txid) || "" });
  res.status(200).send(response("Payment request approved, Proceed with transaction"))
}


// GLOBAL CANCEL PAYMENT HANDLER
export const handleCancelPayment = async (req: RequestAlt, res: Response) => {
  if(!req.body.paymentId) throw new BadRequestError("Payment id is reqiured!")

  // CHECK FOR TRANSACTION
  const transaction = await Transaction.findOne({ piPaymentId: req.body.paymentId })
  if(!transaction) throw new NotFoundError("Transaction not found!")

  // UPDATED THE TRANSACTION STATUS
  transaction.status = "cancelled"
  await transaction.save()

  res.status(200).send(response("Payment cancelled!", transaction))
}


// GLOBAL PAYMENT ERROR HANDLER
export const handlePaymentError = async (req: RequestAlt, res: Response) => {
  if(!req.body.payment) throw new BadRequestError("Payment data is reqiured!")

  const paymentData = req.body.payment as PaymentDTO
  // CHECK FOR TRANSACTION
  const transaction = await Transaction.findOne({ piPaymentId: paymentData.identifier })
  if(!transaction) throw new NotFoundError("Transaction not found!")

  // UPDATED THE TRANSACTION STATUS
  transaction.status = "error"
  await transaction.save()

  res.status(200).send(response("Error occured during payment!", transaction))
}


// HANDLE FOR SUBSCRIPTION PAYMENT
export const handleCompleteSubscriptionPayment = async (req: RequestAlt, res: Response) => {
  if(!req.body.paymentId) throw new BadRequestError("Payment id is required!")
  if(!req.body.txid) throw new BadRequestError("Payment id is required!")

  const transaction = await Transaction.findOne({ piPaymentId: req.body.paymentId })
  if(!transaction) throw new NotFoundError("Transaction not found!")

  // UPDATE THE USERS SUBSCRIPTION STATUS
  const user = await User.findByIdAndUpdate({ _id: req.user._id }, { isSubscribed: true }, { new: true })
  
  // UPDATE THE PI SERVERS
  const paymentData = await piRequest.post(PI_COMPLETE_ENDPOINT(req.body.paymentId), { txid: req.body.txid });

  // UPDATE THE TRANSACTION STATUS
  transaction.status = "success"
  transaction.meta = paymentData.data
  transaction.trxId = req.body.txid

  const updatedTransaction = await transaction.save()
  res.status(200).send(response("Payment completed!", { user, transaction: updatedTransaction }))
}


// HANDLE FOR SUBSCRIPTION PAYMENT
export const handleCompleteContentPayment = async (req: RequestAlt, res: Response) => {
  if(!req.body.paymentId) throw new BadRequestError("Payment id is required!")
  if(!req.body.txid) throw new BadRequestError("Payment id is required!")

  const transaction = await Transaction.findOne({ piPaymentId: req.body.paymentId })
  if(!transaction) throw new NotFoundError("Transaction not found!")

  // UPDATE THE PI SERVERS / GET PAYMENT DATA
  const { data } = await piRequest.post(PI_COMPLETE_ENDPOINT(req.body.paymentId), { txid: req.body.txid });
  const paymentData = data as PaymentDTO

  // GET CONTENT ID
  const content = await Content.findById(paymentData.metadata?.content)

  // UPDATE ADD TO PURCHASED CONTENTS
  const purchaseContent = await PurchasedContents.create({
    content: content?._id,
    user: req.user._id,
    transaction: transaction._id
  });

  // UPDATE THE TRANSACTION STATUS
  transaction.status = "success"
  transaction.meta = paymentData
  transaction.trxId = req.body.txid

  const updatedTransaction = await transaction.save()
  res.status(200).send(response("Payment completed!", { transaction: updatedTransaction, purchaseContent }))
}


// HANDLE FOR STAKE PAYMENT
export const handleCompleteStakePayment = async (req: RequestAlt, res: Response) => {
  if(!req.body.paymentId) throw new BadRequestError("Payment id is required!")
  if(!req.body.txid) throw new BadRequestError("Payment id is required!")

  const transaction = await Transaction.findOne({ piPaymentId: req.body.paymentId })
  if(!transaction) throw new NotFoundError("Transaction not found!")

  // UPDATE THE PI SERVERS / GET PAYMENT DATA
  const { data } = await piRequest.post(PI_COMPLETE_ENDPOINT(req.body.paymentId), { txid: req.body.txid });
  const paymentData = data as PaymentDTO

  // UPDATE THE TRANSACTION STATUS
  transaction.status = "success"
  transaction.meta = paymentData
  transaction.trxId = req.body.txid

  const updatedTransaction = await transaction.save()
  res.status(200).send(response("Payment completed! Proceed to upload content", updatedTransaction ))
}