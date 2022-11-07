import express from "express";
const router = express.Router();

import { getUserProfile } from "../controllers";

router.get("/", getUserProfile);

export default router;