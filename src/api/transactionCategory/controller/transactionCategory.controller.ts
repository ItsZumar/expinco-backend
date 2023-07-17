import { NextFunction, Request, Response } from "express";
import { check } from "express-validator";
import { apiOk, apiValidation, catchAsync } from "../../../util/apiHelpers";
import {
  listCategoryService,
  createCategoryService,
  deleteCategoryService,
  updateCategoryService,
} from "../service/transactionCategory.service";

export const listCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  apiValidation(req, res);
  const result = await listCategoryService(req, res, next);
  apiOk(res, result);
});

export const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await check("name", "Category name is required.").isString().run(req);

  apiValidation(req, res);
  const result = await createCategoryService(req, res, next);
  apiOk(res, result);
});

export const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await check("name", "Category name is required.").isString().optional().run(req);

  apiValidation(req, res);
  const result = await updateCategoryService(req, res, next);
  apiOk(res, result);
});

export const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  apiValidation(req, res);
  const result = await deleteCategoryService(req, res, next);
  apiOk(res, result);
});
