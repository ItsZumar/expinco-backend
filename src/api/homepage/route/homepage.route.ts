import express, { Router } from "express";
import * as HomepageController from "../controller/homepage.controller";
import { ProtectedRoute } from "../../../middleware/auth";

const router: Router = express.Router();

router.post("/", ProtectedRoute, HomepageController.homepage);

export default router;