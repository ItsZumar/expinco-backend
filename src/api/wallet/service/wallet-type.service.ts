import { WalletType } from "../model/wallet-type.model";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../errors/error.base";
import { HttpStatusCode } from "../../../errors/types/HttpStatusCode";
import { ListWalletTypeReqI } from "./request/wallet-type.request";
import { ListWalletTypeI, AddWalletTypeI, UpdateWalletTypeI, DeleteWalletTypeI } from "./response/wallet-type.response";
import { isValidObjectId } from "mongoose";

export const listWalletTypeService = async (req: ListWalletTypeReqI, res: Response, next: NextFunction): Promise<ListWalletTypeI> => {
  return req.result;
};

export const addWalletTypeService = async (req: Request, res: Response, next: NextFunction): Promise<AddWalletTypeI> => {
  if (!isValidObjectId(req.body._id)) {
    throw new AppError(HttpStatusCode.BadRequest, "Wallet Type id is not valid!");
  }

  const walletTypeInDB = await WalletType.findOne({ _id: req.body._id });

  if (walletTypeInDB) {
    throw new AppError(HttpStatusCode.Conflict, "A wallet type with this name already exists!");
  } else {
    const newWalletType = new WalletType({
      name: req.body.name,
      icon: req.body.icon ? req.body.icon : null,
    });
    let newlyCreatedwalletType = await newWalletType.save();
    return newlyCreatedwalletType;
  }
};

export const updateWalletTypeService = async (req: Request, res: Response, next: NextFunction): Promise<UpdateWalletTypeI> => {
  const updatedWalletType = await WalletType.findByIdAndUpdate(
    { _id: req.body._id },
    {
      name: req.body.name,
      icon: req.body.icon,
    },
    { returnOriginal: false }
  );

  if (!updatedWalletType) {
    throw new AppError(HttpStatusCode.Conflict, "A wallet type is not found with this id.");
  } else {
    return updatedWalletType;
  }
};

export const deleteWalletTypeService = async (req: Request, res: Response, next: NextFunction): Promise<DeleteWalletTypeI> => {
  const updatedWalletType = await WalletType.findByIdAndDelete({ _id: req.params.id });

  if (!updatedWalletType) {
    throw new AppError(HttpStatusCode.Conflict, "A wallet type is not found with this id.");
  } else {
    return updatedWalletType;
  }
};
