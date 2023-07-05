import express, { Router } from "express";
import * as TransactionController from "../controller/transaction.controller";
import { ProtectedRoute } from "../../../middleware/auth";

const router: Router = express.Router();

router.get("/list", ProtectedRoute, TransactionController.listTransaction);

//transactions by type
router.get("/list/:type", ProtectedRoute, TransactionController.getTransactionsByType);

router.post("/create-transaction", ProtectedRoute, TransactionController.createTransaction);
router.patch("/update-transaction/:id", ProtectedRoute, TransactionController.updateTransaction);
router.delete("/delete-transaction/:id", ProtectedRoute, TransactionController.deleteTransaction);

export default router;
