import { Request } from "express";
import Transaction from "../models/Transaction";
import { except } from "../utils/functions";

export const getTransactionPaginated = async (req: Request, userId?: any) => {
    const page = Number(req.query.page) || 1
    const perPage = Number(req.query.perPage) || 12
    let total = 0

    let queries = except(req.query, "page", "perPage")

    if(queries?.search) {
        const regex = new RegExp(queries?.search, 'i');
        const transactions = await Transaction.find({ user: userId, desc: { $regex: regex }})
        .populate('user')
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

        return { contents: transactions, page, perPage, total }  
    }

    if(userId) {
        const transactions = await Transaction.find({ user: userId })
        .populate('user')
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

        return { contents: transactions, page, perPage, total }
    }

    
    if(Object.keys(queries).length) {
        if(queries.isCredit) {
            const isCredit =  queries.isCredit === "credit" ? true : false
            queries.isCredit = isCredit
        }
        const transactions = await Transaction.find({ ...queries })
        .populate('user')
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

        return { contents: transactions, page, perPage, total }  
    }

    const transactions = await Transaction.find({})
    .populate('user')
    .sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);

    return { contents: transactions, page, perPage, total }
}