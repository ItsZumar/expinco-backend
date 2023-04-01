import { Wallet } from "../model/wallet.model";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../errors/error.base";
import { HttpStatusCode } from "../../../errors/types/HttpStatusCode";
import { isValidObjectId } from "mongoose";

export const addWalletService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const walletInDB = await Wallet.findOne({ name: req.body.name });

  if (walletInDB) {
    throw new AppError(HttpStatusCode.Conflict, "A wallet with this name already exists!");
  } else {
    if (!isValidObjectId(req.body.walletType)) {
      throw new AppError(HttpStatusCode.Conflict, "Id of Wallet Type is not valid!");
    }

    const newWallet = new Wallet({
      name: req.body.name,
      walletType: req.body.walletType,
      amount: req.body.amount ? req.body.amount : 0,
    });

    let newlyCreatedwalletType = await newWallet.save();
    return newlyCreatedwalletType;
  }
};

export const updateWalletService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const walletInDB = await Wallet.findOne({ name: req.body.name });

  if (walletInDB) {
    throw new AppError(HttpStatusCode.Conflict, "A wallet with this name already exists!");
  } else {
    if (!isValidObjectId(req.body.walletType)) {
      throw new AppError(HttpStatusCode.Conflict, "Id of Wallet Type is not valid!");
    }

    const newWallet = new Wallet({
      name: req.body.name,
      walletType: req.body.walletType,
      amount: req.body.amount ? req.body.amount : 0,
    });

    let newlyCreatedwalletType = await newWallet.save();
    return newlyCreatedwalletType;
  }
};
