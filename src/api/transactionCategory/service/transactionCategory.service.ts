import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { AppError } from "../../../errors/error.base";
import { HttpStatusCode } from "../../../errors/types/HttpStatusCode";
import { TransactionCategory } from "../model/transactionCategory.model";
import { ListCategoryI, CreateCategoryI, DeleteCategoryI, UpdateCategoryI } from "./response/transactionCategory.response";
import { FileStorage } from "../../../api/fileStorage/model/fileStorage.model";
import { getPagination } from "../../../util/common";

export const listCategoryService = async (req: Request, res: Response, next: NextFunction): Promise<ListCategoryI> => {
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.perPage as string) || 10;

  if (page <= 0 || perPage <= 0) {
    throw new AppError(HttpStatusCode.BadRequest, "Pagination parameters must be greater than 0!");
  }

  const totalItems = await TransactionCategory.find().countDocuments().exec();
  const pagination = getPagination(page, perPage, totalItems);

  const categoriesInDB = await TransactionCategory.find().limit(perPage).skip(pagination.startIndex);

  const result = {
    data: categoriesInDB,
    pagination: {
      page,
      perPage,
      ...pagination,
    },
  };

  return result;
};

export const createCategoryService = async (req: Request, res: Response, next: NextFunction): Promise<CreateCategoryI> => {
  const { name, icon } = req.body;
  let categoryIcon = {};

  const categoryInDB = await TransactionCategory.findOne({ name });

  if (icon) {
    if (!isValidObjectId(icon)) {
      throw new AppError(HttpStatusCode.BadRequest, "Attachment id is not valid");
    }
    categoryIcon = await FileStorage.findById({ _id: icon });
  }

  if (categoryInDB) {
    throw new AppError(HttpStatusCode.Conflict, "A category with this name already exists!");
  } else {
    const newTransCategory = new TransactionCategory({
      name: req.body.name,
      icon: categoryIcon,
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
