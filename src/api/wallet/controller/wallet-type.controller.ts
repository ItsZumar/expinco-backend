// import { NextFunction, Request, Response } from "express";
// import { check } from "express-validator";
// import { apiOk, apiValidation, catchAsync } from "../../../util/apiHelpers";
// import {
//   listWalletTypeService,
//   addWalletTypeService,
//   updateWalletTypeService,
//   deleteWalletTypeService,
// } from "../service/wallet-type.service";

// export const listWalletType = catchAsync(async (req: any, res: Response, next: NextFunction) => {
//   apiValidation(req, res);
//   const result = await listWalletTypeService(req, res, next);
//   apiOk(res, result);
// });

// export const addWalletType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//   await check("name", "Name of wallet type is required.").isString().run(req);
//   apiValidation(req, res);
//   const result = await addWalletTypeService(req, res, next);
//   apiOk(res, result);
// });

// export const updateWalletType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//   await check("_id", "A valid id of wallet type is required.").isString().run(req);
//   apiValidation(req, res);
//   const result = await updateWalletTypeService(req, res, next);
//   apiOk(res, result);
// });

// export const deleteWalletType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//   apiValidation(req, res);

//   const result = await deleteWalletTypeService(req, res, next);
//   apiOk(res, result);
// });
