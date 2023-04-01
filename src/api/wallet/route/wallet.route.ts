import express, { Router } from "express";
import * as WalletTypeController from "../controller/wallet-type.controller";
import * as WalletController from "../controller/wallet.controller";
import { paginate } from "../../../middleware/paginate";
import { WalletType } from "../model/wallet-type.model";
import { ProtectedRoute } from '../../../middleware/auth'

const router: Router = express.Router();

// Routes for Wallet Types
router.get("/list-wallet-type", paginate(WalletType), WalletTypeController.listWalletType);
router.post("/add-type", WalletTypeController.addWalletType);
router.patch("/update-type", WalletTypeController.updateWalletType);
router.delete("/delete-type/:id", WalletTypeController.deleteWalletType);

// Routes for Wallet
router.post("/add-wallet", ProtectedRoute, WalletController.addWallet);
router.patch("/update-wallet/:id", ProtectedRoute, WalletController.updateWallet);
router.delete("/delete-wallet/:id", ProtectedRoute, WalletController.deleteWallet);

export default router;
