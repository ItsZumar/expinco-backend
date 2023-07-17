import { NextFunction, Request, Response } from "express";
import { uploadFileToCloudinary } from "../../../config/cloudinary";

export const fileStorageService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

  const cloudinaryFile = await uploadFileToCloudinary(dataURI);

  console.log("req.body === ", cloudinaryFile);

  return cloudinaryFile;
};
