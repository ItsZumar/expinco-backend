import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import { apiOk, apiValidation, catchAsync } from "../../../util/apiHelpers";
import {
  createTransactionService,
  deleteTransactionService,
  listTransactionService,
  updateTransactionService,
} from "../service/transaction.service";

export const listTransaction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  apiValidation(req, res);
  const result = await listTransactionService(req, res, next);
  apiOk(res, result);
});

export const createTransaction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await check("type", "Type of transaction is required.").isString().run(req);
  await check("amount", "Amount is required.").isNumeric().run(req);
  await check("category", "A valid transaction category is required").isString().run(req);
  await check("description", "A valid description is required").isString().optional().run(req);
  await check("wallet", "Please select a wallet").isString().run(req);
  await check("attachments", "Please add a valid attachments").isArray().default(null).optional().run(req);

  apiValidation(req, res);
  const result = await createTransactionService(req, res, next);
  apiOk(res, result);
});

export const updateTransaction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await check("type", "Type of transaction is required.").isString().optional().run(req);
  await check("amount", "Amount is required.").isNumeric().optional().run(req);
  await check("category", "A valid transaction category is required").isString().optional().run(req);
  await check("description", "A valid description is required").isString().optional().run(req);
  await check("wallet", "Please select a wallet").isString().optional().run(req);
  await check("attachments", "Please add a valid attachments").isArray().default(null).optional().run(req);

  apiValidation(req, res);
  const result = await updateTransactionService(req, res, next);
  apiOk(res, result);
});

export const deleteTransaction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  apiValidation(req, res);
  const result = await deleteTransactionService(req, res, next);
  apiOk(res, result);
});
