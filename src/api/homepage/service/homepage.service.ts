import { NextFunction, Request, Response } from "express";
import { Transaction } from "../../transaction/model/transaction.model";
import { Wallet } from "../../wallet/model/wallet.model";
import { HomepageI } from "./response/homepage.response";

export const homepageService = async (req: Request, res: Response, next: NextFunction): Promise<HomepageI> => {
  const year = req.body.year;
  const month = req.body.month;
  const startOfMonth = `${year}-${month}-01`;

  const userWallets = await Wallet.find({ owner: req.user._id });
  const availableBalance = userWallets.map((wal) => wal.amount).reduce((prev, curr) => prev + curr);

  const result = await Transaction.aggregate([
    {
      $match: {
        owner: req.user._id,
        createdAt: {
          $gte: new Date(startOfMonth),
          $lt: new Date(new Date(startOfMonth).setMonth(new Date(startOfMonth).getMonth() + 1)),
        },
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
  ])
    .exec()
    .then((response) => {
      if (response.length > 0) {
        response[0]._id = undefined;
        return response[0];
      } else {
        return null;
      }
    });

  return result;
};
