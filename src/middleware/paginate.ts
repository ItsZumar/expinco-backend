import { Model } from "mongoose";
import { HttpStatusCode } from "../errors/types/HttpStatusCode";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/error.base";
import { catchAsync } from "../util/apiHelpers";

export interface IPaginateResult<T> {
  data: T[];
  pagination: PaginationI;
}

export interface PaginationI {
  page: number | null;
  perPage: number | null;
  hasPrevious: boolean | null;
  hasNext: boolean | null;
}

export const paginate = <T>(model: Model<T>): ((req: Request & { result: IPaginateResult<T> }, res: Response, next: NextFunction) => Promise<void>) => {
  return catchAsync(async (req: Request & { result: IPaginateResult<T> }, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.perPage as string) || 10;

    if (page <= 0 || limit <= 0) {
      throw new AppError(HttpStatusCode.BadRequest, "Pagination parameters must be greater than 0!");
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const hasPrevious = startIndex > 0 ? true : false;
    const hasNext = endIndex < (await model.countDocuments().exec()) ? true : false;

    const result: IPaginateResult<T> = {
      data: await model.find().limit(limit).skip(startIndex),
      pagination: {
        page: page,
        perPage: limit,
        hasPrevious: hasPrevious,
        hasNext: hasNext,
      },
    };

    req.result = result;
    next();
  });
};
