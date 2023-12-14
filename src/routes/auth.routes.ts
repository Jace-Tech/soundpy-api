import {
    handleInitializeVerifyEmail,
    handleLoginAdmin,
    handleRegisterAdmin,
    handleVerifyEmail,
} from "./../controllers/auth.controller";
import { Router } from "express";
import { handleSignIn } from "../controllers/auth.controller";

const authRoutes = Router();

// Routes Here

// USERS LOGIN ROUTE
authRoutes.post("/signin", handleSignIn);

// EMAIL VERIFICATION [INITIALIZE]
authRoutes.post("/verify/initiate", handleInitializeVerifyEmail);

// EMAIL VERIFICATION [VERIFY]
authRoutes.post("/verify", handleVerifyEmail);

// ADMIN REGISTER ROUTE
authRoutes.post("/signup/admin", handleRegisterAdmin);

// ADMIN LOGIN ROUTE
authRoutes.post("/signin/admin", handleLoginAdmin);

export default authRoutes;
