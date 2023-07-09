import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "./secrets";
import { AppError } from "../errors/error.base";
import { HttpStatusCode } from "../errors/types/HttpStatusCode";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadFileToCloudinary = async (file: any) => {
  //   return cloudinary.uploader.upload(file, { allowed_formats: ["png"] }, (err, result) => {
  //     if (err) {
  //       throw new AppError(HttpStatusCode.InternalServerError, err.message);
  //     }

  //     if (result) {
  //       return result;
  //     }
  //   });

  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
};
