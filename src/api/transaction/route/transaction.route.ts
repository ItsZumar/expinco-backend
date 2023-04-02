import express, { Router } from "express";

const router: Router = express.Router();

router.get("/list-transactions", () => {});
router.post("/create-transaction", () => {});
router.patch("/update-transaction/:id", () => {});
router.delete("/delete-transaction/:id", () => {});

export default router;
