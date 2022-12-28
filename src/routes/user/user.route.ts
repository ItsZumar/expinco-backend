import express, { Router } from "express";
import { UserController } from "../../controllers";

const router = express.Router();

router.post("/email-signup", UserController.emailSignup);
router.post("/email-signin", UserController.emailSignin);

export default router;