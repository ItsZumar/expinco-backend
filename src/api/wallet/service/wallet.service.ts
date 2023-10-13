import { Wallet } from "../model/wallet.model";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../errors/error.base";
import { HttpStatusCode } from "../../../errors/types/HttpStatusCode";
import { AddWalletI, DeleteWalletI, ListWalletI, UpdateWalletI } from "./response/wallet.response";
import { isValidObjectId } from "mongoose";
// import { WalletType } from "../model/wallet-type.model";

export const listWalletService = async (req: Request, res: Response, next: NextFunction): Promise<ListWalletI> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.perPage as string) || 10;

  if (page <= 0 || limit <= 0) {
    throw new AppError(HttpStatusCode.BadRequest, "Pagination parameters must be greater than 0!");
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const hasPrevious = startIndex > 0 ? true : false;
  const hasNext = endIndex < (await Wallet.find({ owner: req.user._id }).countDocuments().exec()) ? true : false;

  const walletsInDB = await Wallet.find({ owner: req.user._id }).limit(limit).skip(startIndex).select(["-owner"]);
  // .populate("owner", ["firstname", "lastname", "email", "createdAt", "updatedAt"]);

  const result = {
    data: walletsInDB,
    pagination: {
      page: page,
      perPage: limit,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
    },
  };

  return result;
};

export const addWalletService = async (req: Request, res: Response, next: NextFunction): Promise<AddWalletI> => {
  const walletInDB = await Wallet.findOne({
    $and: [{ name: req.body.name }, { owner: req.user.id }],
  });

  if (walletInDB) {
    throw new AppError(HttpStatusCode.Conflict, "Your wallet with this name already exists!");
  }
  // else {
  //   if (!isValidObjectId(req.body.walletType)) {
  //     throw new AppError(HttpStatusCode.Conflict, "Id of Wallet Type is not valid!");
  //   }
  // }

  const newWallet = new Wallet({
    name: req.body.name,
    // walletType: req.body.walletType,
    amount: req.body.amount,
    owner: req.user._id,
  });

  const newlyCreatedwalletType = await newWallet.save();
  return newlyCreatedwalletType;
};

export const updateWalletService = async (req: Request, res: Response, next: NextFunction): Promise<UpdateWalletI> => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError(HttpStatusCode.NotFound, "Wallet id is not valid!");
  }

  const wallet = await Wallet.findById(req.params.id);

  if (!wallet) {
    throw new AppError(HttpStatusCode.NotFound, "A wallet doesn't exist with this id.");
  }

  const creatorId = wallet.owner;
  const userId = req.user._id;

  if (!wallet || creatorId.toString() !== userId.toString()) {
    throw new AppError(HttpStatusCode.NotFound, "A wallet doesn't exist with this id.");
  } else {
    // if (!isValidObjectId(req.body.walletType)) {
    //   throw new AppError(HttpStatusCode.NotFound, "Wallet type id is not valid!");
    // }
    // const walletType = await WalletType.findById({ _id: req.body.walletType });
    // if (!walletType) {
    //   throw new AppError(HttpStatusCode.NotFound, "Wallet type doesn't exist with this id.");
    // }

    const updatedWallet = await Wallet.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        amount: req.body.amount,
      },
      { new: true }
    );

    return updatedWallet;
  }
};

export const deleteWalletService = async (req: Request, res: Response, next: NextFunction): Promise<DeleteWalletI> => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError(HttpStatusCode.NotFound, "Wallet id is not valid!");
  }

  const wallet = await Wallet.findById(req.params.id);

  if (!wallet) {
    throw new AppError(HttpStatusCode.NotFound, "A wallet doesn't exist with this id.");
  }

  const creatorId = wallet.owner;
  const userId = req.user._id;

  if (creatorId.toString() !== userId.toString()) {
    throw new AppError(HttpStatusCode.NotFound, "A wallet doesn't exist with this id.");
  }

  const walletInDB = await Wallet.findByIdAndDelete({ _id: req.params.id });

  if (!walletInDB) {
    throw new AppError(HttpStatusCode.NotFound, "A wallet not found with this id.");
  } else {
    return {
      status: "Your wallet has been deleted successfully!",
    };
  }
};
