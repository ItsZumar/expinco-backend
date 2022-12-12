import express from "express";
import { UserAuthController } from "../../controllers";

const router = express.Router();

router.post("/email-signup", UserAuthController.emailSignup);

// router.get("/", (req, res) => console.log("req :: ", req);
// router.patch("/", (req, res) => console.log("req :: ", req));

export default router;