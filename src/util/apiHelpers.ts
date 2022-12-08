import { NextFunction, Response, Request } from "express";
import { ENVIRONMENT } from "./secrets";
import logger from "./logger";
import _ from "lodash";
import { validationResult } from "express-validator";
import { IPaginateResult } from "../services/pagination";
import { flattenObj, isPlainObj } from "./common";
import { check, sanitize, oneOf } from "express-validator";
import { extractFields } from "./common";
import { AppError } from "../errors/error.base";
import { HttpStatusCode } from "../errors/types/HttpStatusCode";

export interface ApiResponse {
  result: any;
  error: string;
  stack: string;
}

export const errorHandlerAll = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  const toSend: ApiResponse = {
    result: null,
    error: err.error,
    stack: err.stack,
  }
  res.status(err.statusCode).json(toSend);
}

export const errorHandler404 = (req: Request, res: Response, next: NextFunction) => {
  let error: string = `Can't find ${req.url} on this server!`;
  next(new AppError(HttpStatusCode.NotFound, error));
};

export const apiValidation = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errs = errors.array().map(x => x.msg.toString());
    const err = new AppError(500, errs[0])
    throw err;
  }
};

// ================== ABOVE CODE IS WRITTEN BY ME =================================


export const apiOk = async (res: Response, result: any) => {
  let nresult = injectPaginationIfResultIsTruthy(res, result);
  let fresult = generateApiOkResponse(nresult);
  res.status(200).json(fresult);
};

const injectPaginationIfResultIsTruthy = (res: Response, result: any) => {
  return result ? injectPagination(res, result) : result;
};

const generateApiOkResponse = (result: any): ApiResponse => {
  return {
    result: result,
    error: "",
    stack: "",
  };
};

const injectPagination = (res: Response, result: any) => {
  console.log("result.pagination :: ", result.pagination)
  
  if (result.pagination && (result.pagination.next === "" || result.pagination.next)) {
    const fullUrl = res.req?.protocol + "://" + res.req?.get("host") + res.req?.originalUrl;
    const nextpage = fullUrl + `?page=${result.pagination.page + 1}&perPage=${result.pagination.perPage}`;
    const prevpage = fullUrl + `?page=${result.pagination.page - 1}&perPage=${result.pagination.perPage}`;
    result.pagination.next = null;
    result.pagination.previous = null;
    if (result.pagination.hasNext) {
      result.pagination.next = nextpage;
    }
    if (result.pagination.hasPrevious) {
      result.pagination.previous = prevpage;
    }
  }
  return result;
};

export const errorUnhandledRejection = (err: any) => {
  console.error("Unhandle rejection: ", err);
};

export const errorUncughtException = (err: any) => {
  // logger.error("UNCAUGHT EXCEPTION! Shutting down...");
  // logger.error("Uncaught EXCEPTION: ", err);
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