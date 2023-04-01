import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import { apiOk, apiValidation, catchAsync } from "../../../util/apiHelpers";
import { addWalletService, deleteWalletService, listWalletService, updateWalletService } from "../service/wallet.service";

export const listWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  apiValidation(req, res);
  const result = await listWalletService(req, res, next);
  apiOk(res, result);
});

export const addWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await check("name", "Name of wallet is required.").isString().run(req);
  await check("walletType", "Wallet type is required").isString().run(req);
  await check("amount", "Amount is required.").isNumeric().run(req);

  apiValidation(req, res);
  const result = await addWalletService(req, res, next);
  apiOk(res, result);
});

export const updateWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await check("name", "Name of wallet is required.").isString().optional().run(req);
  await check("walletType", "Wallet type is required").isString().optional().run(req);
  await check("amount", "Amount is required.").isNumeric().optional().run(req);

  apiValidation(req, res);
  const result = await updateWalletService(req, res, next);
  apiOk(res, result);
});

export const deleteWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  apiValidation(req, res);
  const result = await deleteWalletService(req, res, next);
  apiOk(res, result);
});
