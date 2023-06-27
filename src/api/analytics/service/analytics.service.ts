import { NextFunction, Request, Response } from "express";
import { Transaction } from "../../transaction/model/transaction.model";
import { Wallet } from "../../wallet/model/wallet.model";
import { AppError } from "../../../errors/error.base";
import { HttpStatusCode } from "../../../errors/types/HttpStatusCode";

export const spendFrequencyService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { orderBy } = req.query;

  const validOrderByKeys = ["today", "week", "month", "year"];
  
  const isOrderByValid = validOrderByKeys.includes(String(orderBy));

  if (!isOrderByValid) {
    throw new AppError(HttpStatusCode.BadRequest, "OrderBy value is not valid!");
  }

  const result = {};

  return result;
};