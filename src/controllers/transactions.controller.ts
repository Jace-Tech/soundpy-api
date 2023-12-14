import { Response } from "express";
import Transaction from "../models/Transaction";
import { RequestAlt } from "../types/common";
import { response } from "../utils/response";
import { BadRequestError } from "../utils/customError";
import { getTransactionPaginated } from "../store/transaction";

export const handleGetUsersTransactions = async (req: RequestAlt, res: Response) => {
    const transactions = await getTransactionPaginated(req, req.user._id)
    return res.send(response("All transactions", transactions))
}

export const handleGetTransactions = async (req: RequestAlt, res: Response) => {
    const transactions = await getTransactionPaginated(req, req.params.id)
    return res.send(response("All transactions", transactions))
}

export const handleGetOneTransaction = async (req: RequestAlt, res: Response) => {
    if(!req.params.id) throw new BadRequestError("Transaction id is required!")

    const transaction = await Transaction.findById(req.params.id).populate('user')
    return res.send(response("Transaction", transaction))
}