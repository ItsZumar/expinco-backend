import { NextFunction, Request, Response } from "express";
import { apiOk, apiValidation, catchAsync } from "../../../util/apiHelpers";
import { spendFrequencyService } from "../service/analytics.service";

export const spendFrequency = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  apiValidation(req, res);
  const result = await spendFrequencyService(req, res, next);
  apiOk(res, result);
});
