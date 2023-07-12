import { NextFunction, Request, Response } from "express";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../../../config/cloudinary";
import { FileStorage } from "../model/fileStorage.model";

export const fileStorageService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

  const cloudinaryFile = await uploadFileToCloudinary(dataURI);

  const newFileStorage = new FileStorage({
    type: cloudinaryFile.type,
    secureURL: cloudinaryFile.secure_url,
  });

  await newFileStorage.save();

  // let data = {
  //   publicId: cloudinaryFile.public_id,
  //   url: cloudinaryFile.secure_url,
  //   format: cloudinaryFile.format,
  //   resourceType: cloudinaryFile.resource_type,
  //   type: cloudinaryFile.type,
  //   createdAt: cloudinaryFile.created_at,
  // };

  return { newFileStorage };
};

export const deleteFileStorageService = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const publicId = req.params.public_id;

  const deletedCloudinaryFile = await deleteFileFromCloudinary(publicId);

  return { deletedCloudinaryFile };
};
