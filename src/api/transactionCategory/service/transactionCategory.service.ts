import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { AppError } from "../../../errors/error.base";
import { HttpStatusCode } from "../../../errors/types/HttpStatusCode";
import { TransactionCategory } from "../model/transactionCategory.model";
import { ListCategoryI, CreateCategoryI, DeleteCategoryI, UpdateCategoryI } from "./response/transactionCategory.response";

export const listCategoryService = async (req: Request, res: Response, next: NextFunction): Promise<ListCategoryI> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.perPage as string) || 10;

  if (page <= 0 || limit <= 0) {
    throw new AppError(HttpStatusCode.BadRequest, "Pagination parameters must be greater than 0!");
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const hasPrevious = startIndex > 0 ? true : false;
  const hasNext = endIndex < (await TransactionCategory.find().countDocuments().exec()) ? true : false;

  const categoriesInDB = await TransactionCategory.find().limit(limit).skip(startIndex);

  const result = {
    data: categoriesInDB,
    pagination: {
      page: page,
      perPage: limit,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
    },
  };

  return result;
};

export const createCategoryService = async (req: Request, res: Response, next: NextFunction): Promise<CreateCategoryI> => {
  const categoryInDB = await TransactionCategory.findOne({ name: req.body.name });

  if (categoryInDB) {
    throw new AppError(HttpStatusCode.Conflict, "A category with this name already exists!");
  } else {
    const newTransCategory = new TransactionCategory({
      name: req.body.name,
    });

    await newTransCategory.save();
    return newTransCategory;
  }
};

export const updateCategoryService = async (req: Request, res: Response, next: NextFunction): Promise<UpdateCategoryI> => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError(HttpStatusCode.BadRequest, "Category ID is not valid.");
  }

  const updatedCategory = await TransactionCategory.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (!updatedCategory) {
    throw new AppError(HttpStatusCode.NotFound, "Category with this id doesn't exists.");
  }
  return updatedCategory;
};

export const deleteCategoryService = async (req: Request, res: Response, next: NextFunction): Promise<DeleteCategoryI> => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError(HttpStatusCode.BadRequest, "Category ID is not valid.");
  }

  const updatedCategory = await TransactionCategory.findByIdAndDelete(req.params.id);

  if (!updatedCategory) {
    throw new AppError(HttpStatusCode.NotFound, "Category with this id doesn't exists.");
  }
  return {
    status: "The category has been deleted successfully.",
  };
};
