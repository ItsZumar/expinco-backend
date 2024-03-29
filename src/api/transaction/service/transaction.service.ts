import { isValidObjectId } from "mongoose";
import { NextFunction, Request, Response } from "express";
import { Transaction } from "../model/transaction.model";
import { AppError } from "../../../errors/error.base";
import { HttpStatusCode } from "../../../errors/types/HttpStatusCode";
import {
  CreateTransactionI,
  DeleteTransactionI,
  ListTransactionI,
  UpdateTransactionI,
} from "./response/transaction.response";
import { Wallet } from "../../wallet/model/wallet.model";
import { TransactionCategories, TransactionSortType, TransactionType } from "../../../enums";
import { FileStorage } from "../../fileStorage/model/fileStorage.model";
import { getPagination } from "../../../util/common";

export const listTransactionService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ListTransactionI> => {
  const page: number = parseInt(req.query.page as string) || 1;
  const perPage: number = parseInt(req.query.perPage as string) || 10;
  const transactionsInDB = [];
  const { type, sortTransactionBy, category } = req.query;

  if (page <= 0 || perPage <= 0) {
    throw new AppError(HttpStatusCode.BadRequest, "Pagination parameters must be greater than 0!");
  }

  const totalItems = await Transaction.find({ owner: req.user._id }).countDocuments().exec();
  const pagination = getPagination(page, perPage, totalItems);

  let transactionsQuery: { owner: string; type?: string } = { owner: req.user._id };

  switch (type) {
    case TransactionType.INCOME:
      transactionsQuery.type = TransactionType.INCOME;
      break;
    case TransactionType.EXPENSE:
      transactionsQuery.type = TransactionType.EXPENSE;
      break;
    case TransactionType.TRANSFER:
      transactionsQuery.type = TransactionType.TRANSFER;
      break;
    default:
      break;
  }

  const transactions = await Transaction.find(transactionsQuery)
    .sort("-createdAt")
    .limit(perPage)
    .skip(pagination.startIndex)
    .populate("category")
    .populate({
      path: "wallet",
      select: ["_id", "amount", "name"],
    })
    .populate("attachments")
    .select(["-owner"])
    .exec();

  transactionsInDB.push(transactions);

  switch (sortTransactionBy) {
    case TransactionSortType.HIGHEST: {
      transactionsInDB[0].sort((a, b) => b.amount - a.amount);
      break;
    }

    case TransactionSortType.LOWEST: {
      transactionsInDB[0].sort((a, b) => a.amount - b.amount);
      break;
    }

    case TransactionSortType.NEWEST: {
      transactionsInDB[0].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    }

    case TransactionSortType.OLDEST: {
      transactionsInDB[0].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      break;
    }
  }

  switch (category) {
    case TransactionCategories.FOOD: {
      const filteredTransactions = transactionsInDB[0].filter((transaction) => {
        return transaction.category._id.toString() === TransactionCategories.FOOD;
      });
      transactionsInDB[0] = filteredTransactions;
      break;
    }

    case TransactionCategories.GAMING: {
      const filteredTransactions = transactionsInDB[0].filter((transaction) => {
        return transaction.category._id.toString() === TransactionCategories.GAMING;
      });
      transactionsInDB[0] = filteredTransactions;
      break;
    }

    case TransactionCategories.SHOPPING: {
      const filteredTransactions = transactionsInDB[0].filter((transaction) => {
        return transaction.category._id.toString() === TransactionCategories.SHOPPING;
      });
      transactionsInDB[0] = filteredTransactions;
      break;
    }

    case TransactionCategories.SUBSCRIPTION: {
      const filteredTransactions = transactionsInDB[0].filter((transaction) => {
        return transaction.category._id.toString() === TransactionCategories.SUBSCRIPTION;
      });
      transactionsInDB[0] = filteredTransactions;
      break;
    }

    default: {
      break;
    }
  }

  const result = {
    data: transactionsInDB[0],
    pagination: {
      page,
      perPage,
      ...pagination,
    },
  };

  return result;
};

export const createTransactionService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<CreateTransactionI> => {
  const { type, amount, category, description, wallet, attachments }: Partial<CreateTransactionI> = req.body;

  const attachmentIds = [];

  if (!isValidObjectId(category)) {
    throw new AppError(HttpStatusCode.NotFound, "Cateogry id is not valid");
  } else if (!isValidObjectId(wallet)) {
    throw new AppError(HttpStatusCode.NotFound, "Wallet id is not valid");
  }

  if (attachments && attachments.length) {
    for (const attachId of attachments) {
      if (!isValidObjectId(attachId)) {
        throw new AppError(HttpStatusCode.BadRequest, "Attachment id is not valid");
      }
      const attachment = await FileStorage.findById({ _id: attachId });
      attachmentIds.push(attachment);
    }
  }

  // const walletById = await Wallet.findById({ _id: wallet });

  const walletById = await Wallet.findOne({
    $and: [{ _id: wallet }, { owner: req.user.id }],
  });

  if (!walletById) {
    throw new AppError(HttpStatusCode.Conflict, "Create wallet First!");
  }

  switch (type) {
    case TransactionType.EXPENSE: {
      if (walletById.amount > amount) {
        walletById.amount = Number(walletById.amount) - Number(amount);
        walletById.save();
      } else {
        throw new AppError(HttpStatusCode.BadRequest, "You don't have sufficient amount");
      }
      break;
    }
    case TransactionType.INCOME: {
      if (amount < 0) {
        throw new AppError(HttpStatusCode.BadRequest, "The amount cannot be in negative!");
      } else {
        walletById.amount = Number(walletById.amount) + Number(amount);
        walletById.save();
      }
      break;
    }
  }

  console.log(attachmentIds);

  const newTransaction = new Transaction({
    type: type,
    amount: amount,
    category: category,
    description: description,
    wallet: wallet,
    owner: req.user._id,
    attachments: attachmentIds,
  });

  await newTransaction.save();
  return newTransaction;
};

export const updateTransactionService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<UpdateTransactionI> => {
  const { type, amount, category, description, wallet, attachments } = req.body;

  // Check if the wallet ID is valid
  if (category && !isValidObjectId(category)) {
    throw new AppError(HttpStatusCode.NotFound, "Category id is not valid");
  } else if (wallet && !isValidObjectId(wallet)) {
    throw new AppError(HttpStatusCode.NotFound, "Wallet id is not valid");
  }

  if (attachments && attachments.length) {
    for (const attachId of attachments) {
      if (!isValidObjectId(attachId)) {
        throw new AppError(HttpStatusCode.NotFound, "Attachment id is not valid");
      }
    }
  }

  // Update the wallet in the database
  const updatedTransaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    {
      type: type,
      amount: amount,
      category: category,
      description: description,
      wallet: wallet,
      attachments: attachments || [],
    },
    { new: true }
  );

  if (updatedTransaction) {
    return updatedTransaction;
  } else {
    throw new AppError(HttpStatusCode.NotFound, "Transaction with is this not found");
  }
};

export const deleteTransactionService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<DeleteTransactionI> => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError(HttpStatusCode.NotFound, "Transaction id is not valid");
  }

  // Find the Transaction by ID
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    throw new AppError(HttpStatusCode.NotFound, "A transaction doesn't exist with this id");
  }

  // Create ObjectIds for the creator and current user
  const creatorId = transaction.owner;
  const userId = req.user._id;

  // Check if the wallet exists and if the current user is the creator
  if (creatorId.toString() !== userId.toString()) {
    throw new AppError(HttpStatusCode.NotFound, "A transaction doesn't exist with this id");
  }

  const transactionInDB = await Transaction.findByIdAndDelete({ _id: req.params.id });

  if (!transactionInDB) {
    throw new AppError(HttpStatusCode.NotFound, "A transaction not found with this id");
  } else {
    return {
      status: "Your transaction has been deleted successfully",
    };
  }
};

export const getTransactionsByTypeService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<ListTransactionI> => {
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.perPage as string) || 10;

  if (page <= 0 || perPage <= 0) {
    throw new AppError(HttpStatusCode.BadRequest, "Pagination parameters must be greater than 0!");
  }

  const totalItems = await Transaction.find({ owner: req.user._id }).countDocuments().exec();
  const pagination = getPagination(page, perPage, totalItems);

  const transactionsInDB = await Transaction.find({ type: req.params.type.toUpperCase() })
    .sort("-createdAt")
    .limit(perPage)
    .skip(pagination.startIndex)
    .populate("category")
    .populate({
      path: "wallet",
      select: ["_id", "amount", "name"],
    })
    .populate("attachments")
    .select(["-owner"])
    .exec();

  const result = {
    data: transactionsInDB,
    pagination: {
      page,
      perPage,
      ...pagination,
    },
  };

  return result;
};
