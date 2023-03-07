import express, { Router } from "express";
import * as UserController from "../controller/user.controller";
import { ProtectedRoute } from '../../../middleware/auth'

const router: Router = express.Router();

router.post("/email-signup", UserController.emailSignup);
router.post("/email-signin", UserController.emailSignin);
router.post("/verify-email", UserController.verifyEmail);
router.post("/resend-verify-email", UserController.resendVerifyEmail);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/change-password", ProtectedRoute, UserController.changePassword)
router.post("/reset-password", UserController.resetPassword)
router.get("/me", ProtectedRoute.bind(this), (req, res) => {
    res.send("Hello World")
})

export default router;