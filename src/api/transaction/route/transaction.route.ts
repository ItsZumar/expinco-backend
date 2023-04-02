import express, { Router } from "express";
import * as TransactionController from '../controller/transaction.controller'
import { ProtectedRoute } from "../../../middleware/auth";

const router: Router = express.Router();

router.get("/list-transactions", () => {});
router.post("/create-transaction", ProtectedRoute, TransactionController.createTransaction);
router.patch("/update-transaction/:id", () => {});
router.delete("/delete-transaction/:id", () => {});

export default router;
