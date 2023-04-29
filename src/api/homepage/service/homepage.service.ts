import { NextFunction, Request, Response } from "express";
import { Transaction } from "../../transaction/model/transaction.model";
import { Wallet } from "../../wallet/model/wallet.model";
import { HomepageI } from "./response/homepage.response";

export const homepageService = async (req: Request, res: Response, next: NextFunction): Promise<HomepageI> => {
  let userWallets = await Wallet.find({ owner: req.user._id });
  let availableBalance = userWallets.map((wal) => wal.amount).reduce((prev, curr) => prev + curr);

  let result = await Transaction.aggregate([
    {
      $match: {
        owner: req.user._id,
      },
    },
    {
      $group: {
        _id: "$owner",
        totalIncome: {
          $sum: {
            $cond: {
              if: { $eq: ["$type", "INCOME"] },
              then: "$amount",
              else: 0,
            },
          },
        },
        totalExpense: {
          $sum: {
            $cond: {
              if: { $eq: ["$type", "EXPENSE"] },
              then: "$amount",
              else: 0,
            },
          },
        },
      },
    },
    {
      $addFields: {
        availableBalance: availableBalance,
      },
    },
  ]).exec().then(response => {response[0]._id = undefined; return response[0]});

  return result;
};
