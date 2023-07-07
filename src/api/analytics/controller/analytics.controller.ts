import { NextFunction, Request, Response } from "express";
import { apiOk, apiValidation, catchAsync } from "../../../util/apiHelpers";
import { financialReportService, spendFrequencyService } from "../service/analytics.service";

export const spendFrequency = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  apiValidation(req, res);
  const result = await spendFrequencyService(req, res, next);
  apiOk(res, result);
});

export const financialReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  apiValidation(req, res);
  const result = await financialReportService(req, res, next);
  apiOk(res, result);
});
