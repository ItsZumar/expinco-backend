import { Transaction } from "../model/transaction.model";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../errors/error.base";
import { HttpStatusCode } from "../../../errors/types/HttpStatusCode";
// import { AddWalletI, DeleteWalletI, ListWalletI, UpdateWalletI } from "./response/wallet.response";
import { isValidObjectId } from "mongoose";

export const listTransactionService = async (req: Request, res: Response, next: NextFunction): Promise<ListWalletI> => {
  let page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.perPage as string) || 10;

  if (page <= 0 || limit <= 0) {
    throw new AppError(HttpStatusCode.BadRequest, "Pagination parameters must be greater than 0!");
  }

  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;
  let hasPrevious = startIndex > 0 ? true : false;
  let hasNext = endIndex < (await Wallet.find({ owner: req.user._id }).countDocuments().exec()) ? true : false;

  let walletsInDB = await Wallet.find({ owner: req.user._id })
    .limit(limit)
    .skip(startIndex)
    .populate("walletType")
    .populate("owner", ["firstname", "lastname", "email", "createdAt", "updatedAt"]);

  let result = {
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

export const createTransactionService = async (req: Request, res: Response, next: NextFunction): Promise<AddWalletI> => {
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
      amount: req.body.amount,
      owner: req.user._id,
    });

    let newlyCreatedwalletType = await newWallet.save();
    return newlyCreatedwalletType;
  }
};

export const updateTransactionService = async (req: Request, res: Response, next: NextFunction): Promise<UpdateWalletI> => {
  // Check if the wallet ID is valid
  if (!isValidObjectId(req.params.id)) {
    throw new AppError(HttpStatusCode.NotFound, "Wallet id is not valid!");
  }

  // Find the wallet by ID
  const wallet = await Wallet.findById(req.params.id);

  if (!wallet) {
    throw new AppError(HttpStatusCode.NotFound, "A wallet doesn't exist with this id.");
  }

  // Create ObjectIds for the creator and current user
  const creatorId = wallet.owner;
  const userId = req.user._id;

  // Check if the wallet exists and if the current user is the creator
  if (!wallet || creatorId.toString() !== userId.toString()) {
    throw new AppError(HttpStatusCode.NotFound, "A wallet doesn't exist with this id.");
  } else {
    // Check if the wallet type ID is valid
    if (!isValidObjectId(req.body.walletType)) {
      throw new AppError(HttpStatusCode.NotFound, "Wallet type id is not valid!");
    }
    let walletType = await WalletType.findById({ _id: req.body.walletType });
    if (!walletType) {
      throw new AppError(HttpStatusCode.NotFound, "Wallet type doesn't exist with this id.");
    }

    // Update the wallet in the database
    const updatedWallet = await Wallet.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        walletType: req.body.walletType,
        amount: req.body.amount,
      },
      { new: true }
    );

    // Return the updated wallet
    return updatedWallet;
  }
};

export const deleteTransactionService = async (req: Request, res: Response, next: NextFunction): Promise<DeleteWalletI> => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError(HttpStatusCode.NotFound, "Wallet id is not valid!");
  }

  // Find the wallet by ID
  const wallet = await Wallet.findById(req.params.id);

  if (!wallet) {
    throw new AppError(HttpStatusCode.NotFound, "A wallet doesn't exist with this id.");
  }

  // Create ObjectIds for the creator and current user
  const creatorId = wallet.owner;
  const userId = req.user._id;

  // Check if the wallet exists and if the current user is the creator
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
