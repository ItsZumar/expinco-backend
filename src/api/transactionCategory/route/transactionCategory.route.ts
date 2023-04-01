import express, { Router } from "express";
import * as TransactionCategory from "../controller/transactionCategory.controller";

const router: Router = express.Router();

router.get("/list", TransactionCategory.listCategory)
router.post("/create", TransactionCategory.createCategory)
router.patch("/update/:id", TransactionCategory.updateCategory)
router.delete("/delete/:id", TransactionCategory.deleteCategory)

export default router;
