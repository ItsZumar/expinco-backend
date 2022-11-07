import express from "express";
import { getUserProfile } from "../controllers";

const router = express.Router();

router.get("/", getUserProfile);
router.post("/", (req, res) => console.log("req :: ", req));
router.patch("/", (req, res) => console.log("req :: ", req));

export default router;