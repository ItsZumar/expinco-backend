// import { WalletType } from "../model/wallet-type.model";
// import { NextFunction, Request, Response } from "express";
// import { AppError } from "../../../errors/error.base";
// import { HttpStatusCode } from "../../../errors/types/HttpStatusCode";
// import { ListWalletTypeI, AddWalletTypeI, UpdateWalletTypeI, DeleteWalletTypeI } from "./response/wallet-type.response";
// import { isValidObjectId } from "mongoose";

// export const listWalletTypeService = async (req: Request, res: Response, next: NextFunction): Promise<ListWalletTypeI> => {
//   const page = parseInt(req.query.page as string) || 1;
//   const limit = parseInt(req.query.perPage as string) || 10;

//   if (page <= 0 || limit <= 0) {
//     throw new AppError(HttpStatusCode.BadRequest, "Pagination parameters must be greater than 0!");
//   }

//   const startIndex = (page - 1) * limit;
//   const endIndex = page * limit;
//   const hasPrevious = startIndex > 0 ? true : false;
// const hasNext = endIndex < (await WalletType.countDocuments().exec()) ? true : false;

// const walletTypeData = await WalletType.find().limit(limit).skip(startIndex);

// const result = {
// data: walletTypeData,
// pagination: {
//   page: page,
//   perPage: limit,
//   hasPrevious: hasPrevious,
// hasNext: hasNext,
//     },
//   };

//   return result;
// };

// export const addWalletTypeService = async (req: Request, res: Response, next: NextFunction): Promise<AddWalletTypeI> => {
//   const walletTypeInDB = await WalletType.findOne({ name: req.body.name });

//   if (walletTypeInDB) {
//     throw new AppError(HttpStatusCode.Conflict, "A wallet type with this name already exists!");
//   } else {
//     const newWalletType = new WalletType({
//       name: req.body.name,
//       icon: req.body.icon ? req.body.icon : null,
//     });
//     await newWalletType.save();
//     return newWalletType;
//   }
// };

// export const updateWalletTypeService = async (req: Request, res: Response, next: NextFunction): Promise<UpdateWalletTypeI> => {
//   const updatedWalletType = await WalletType.findByIdAndUpdate(
//     { _id: req.body._id },
//     {
//       name: req.body.name,
//       icon: req.body.icon,
//     },
//     { returnOriginal: false }
//   );

//   if (!updatedWalletType) {
//     throw new AppError(HttpStatusCode.Conflict, "A wallet type is not found with this id.");
//   } else {
//     return updatedWalletType;
//   }
// };

// export const deleteWalletTypeService = async (req: Request, res: Response, next: NextFunction): Promise<DeleteWalletTypeI> => {
//   const updatedWalletType = await WalletType.findByIdAndDelete({ _id: req.params.id });

//   if (!updatedWalletType) {
//     throw new AppError(HttpStatusCode.Conflict, "A wallet type is not found with this id.");
//   } else {
//     return updatedWalletType;
//   }
// };
