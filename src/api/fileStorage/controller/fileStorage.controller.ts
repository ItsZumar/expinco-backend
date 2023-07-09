import { NextFunction, Request, Response } from "express";
import { apiOk, apiValidation, catchAsync } from "../../../util/apiHelpers";
import { fileStorageService } from "../service/fileStorage.service";

export const fileStorage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  apiValidation(req, res);
  const result = await fileStorageService(req, res, next);
  apiOk(res, result);
});
