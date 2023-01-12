import express, { Router } from "express";
import * as UserController from "../controller/user.controller";

const router = express.Router();

router.post("/email-signup", UserController.emailSignup);
router.post("/email-signin", UserController.emailSignin);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/verify-email", UserController.verifyEmail);
router.post("/resend-verify-email", UserController.resendVerifyEmail);
router.post("/change-password", UserController.changePassword)
router.post("/reset-password", UserController.resetPassword)

export default router;