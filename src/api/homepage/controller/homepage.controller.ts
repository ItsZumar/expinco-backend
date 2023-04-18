import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import { apiOk, apiValidation, catchAsync } from "../../../util/apiHelpers";
import { homepageService } from "../service/homepage.service";

export const homepage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  apiValidation(req, res);
  const result = await homepageService(req, res, next);
  apiOk(res, result);
});
