import { Model } from "mongoose";
import { HttpStatusCode } from "../errors/types/HttpStatusCode";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/error.base";
import { catchAsync } from "../util/apiHelpers";

export interface IPaginateResult<T> {
  data: T[];
  pagination: IPagination;
}

export interface IPagination {
  page: number | null;
  perPage: number | null;
  hasPrevious: boolean | null;
  hasNext: boolean | null;
}

export const paginate = (model: Model<any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.perPage);

    if (page <= 0 || limit <= 0) {
      throw new AppError(HttpStatusCode.BadRequest, "Pagination parameters must be greater than 0!");
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const hasPrevious = startIndex > 0 ? true : false;
    const hasNext = endIndex < (await model.countDocuments().exec()) ? true : false;

    const result: IPaginateResult<any> = {
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
