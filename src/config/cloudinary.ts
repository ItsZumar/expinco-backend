import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "./secrets";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadFileToCloudinary = async (file: any) => {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
};

export const deleteFileFromCloudinary = async (publicId: any) => {
  cloudinary.uploader.destroy(publicId);
};

export const getFileFromCloudinary = async (publicId: any) => {
  const res = await cloudinary.api.resource(publicId, { resource_type: "raw" });
  console.log("res", res);
  return res;
};
