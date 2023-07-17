import { NextFunction, Request, Response } from "express";
import { apiOk, apiValidation, catchAsync } from "../../../util/apiHelpers";
import { deleteFileStorageService, fileStorageService } from "../service/fileStorage.service";

export const fileStorage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  apiValidation(req, res);
  const result = await fileStorageService(req, res, next);
  apiOk(res, result);
});

export const deleteFileStorage = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  apiValidation(req, res);
  const result = await deleteFileStorageService(req, res, next);
  apiOk(res, result);
});
