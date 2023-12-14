import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import roles from "../configs/roles"
import { handleApprovePayment, handleCancelPayment, handleCompleteContentPayment, handleCompleteStakePayment, handleCompleteSubscriptionPayment, handleIncompletePayment, handlePaymentError } from "../controllers/payment.controller"

const paymentRoutes = Router()


// APPROVE PAYMENT
paymentRoutes.post("/approve", authMiddleware(roles.USER) as any, handleApprovePayment as any)

// INCOMPLETE PAYMENT
paymentRoutes.post("/incomplete", handleIncompletePayment as any)

// CANCEL PAYMENT
paymentRoutes.post("/cancel", authMiddleware(roles.USER) as any, handleCancelPayment as any)

// ERROR PAYMENT
paymentRoutes.post("/error", authMiddleware(roles.USER) as any, handlePaymentError as any)

// CONTENT PAYMENT
paymentRoutes.post("/content", authMiddleware(roles.USER) as any, handleCompleteContentPayment as any)

// STAKE PAYMENT
paymentRoutes.post("/stake", authMiddleware(roles.USER) as any, handleCompleteStakePayment as any)

// ERROR PAYMENT
paymentRoutes.post("/subscribe", authMiddleware(roles.USER) as any, handleCompleteSubscriptionPayment as any)


export default paymentRoutes