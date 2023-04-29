import express, { Router } from "express";
import * as AnalyticsController from "../controller/analytics.controller";
import { ProtectedRoute } from "../../../middleware/auth";

const router: Router = express.Router();

router.get("/list-spend-frequency", ProtectedRoute, AnalyticsController.spendFrequency);

export default router;