import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";
import { flattenObj } from "./common";
import { check } from "express-validator";
import { extractFields } from "./common";
import { AppError } from "../errors/error.base";
import { HttpStatusCode } from "../errors/types/HttpStatusCode";
import logger from "./logger";

export interface ApiResponse {
  result: any;
  error: string;
  stack: string;
}

export const errorHandlerAll = (err: AppError | Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode: HttpStatusCode | number = 500;
  let toSend: ApiResponse = null;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    toSend = {
      result: null,
      error: err.error,
      stack: err.stack,
    };
  }
  else if (err instanceof Error) {
    toSend = {
      result: null,
      error: err.message,
      stack: err.stack,
    };
  } else {
    toSend = {
      result: null,
      error: "Something went wrong.",
      stack: "No stack traces found.",
    };
  }
  res.status(statusCode).json(toSend);
};

export const errorHandler404 = (req: Request, res: Response, next: NextFunction) => {
  const error = `Can't find ${req.originalUrl} on this server!`;
  throw new AppError(HttpStatusCode.NotFound, error);
};

export const apiValidation = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errs = errors.array().map(x => x.msg.toString());
    const err = new AppError(500, errs[0]);
    throw err;
  }
};

export const createServiceResponse = <T>(data: any, dto: T): T => {
  const mergedData = { ...dto, ...data._doc };
  return extractFields(dto, mergedData);
};

export const apiOk = async <T>(res: Response, result: any, model?: any) => {
  const okResult = generateApiOkResponse(result);
  return res.status(200).json(okResult);
};

const generateApiOkResponse = (result: any): ApiResponse => {
  return {
    result: result,
    error: "",
    stack: "",
  };
};

// ================== ABOVE CODE IS WRITTEN BY ME =================================


export const errorUnhandledRejection = (err: any) => {
  console.error("Unhandle rejection: ", err);
};

export const errorUncughtException = (err: any) => {
  logger.error("UNCAUGHT EXCEPTION! Shutting down...");
  logger.error("Uncaught EXCEPTION: ", err);
  process.exit(1);
};

export const catchAsync = (fn: any) => (...args: any[]) => fn(...args).catch(args[2]);

export const validateAPI = async (req: Request, res: Response, m: any) => {
  m = flattenObj(m);
  const keys = Object.keys(m);

  let body = req.body as any;
  body = flattenObj(body);
  for (const k of keys) {
    const val = m[k];
    if (val === undefined) {
      await check(k, `${k} is invalid`).optional().run(req);
      continue;
    }
    await check(k, `${k} is invalid`).exists().run(req);
  }
  apiValidation(req, res);
};