import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import roles from "../configs/roles"
import { handleGetOneTransaction, handleGetTransactions, handleGetUsersTransactions } from "../controllers/transactions.controller"


const transactionRoute = Router()

transactionRoute.get("/", authMiddleware(roles.USER) as any, handleGetUsersTransactions as any)

transactionRoute.get("/user/:id", authMiddleware(roles.ADMIN) as any, handleGetTransactions as any)

transactionRoute.get("/:id", authMiddleware(roles.USER) as any, handleGetOneTransaction as any)

export default transactionRoute