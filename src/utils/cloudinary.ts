import fs from "fs";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envConfig } from "../config/env.config.js";

cloudinary.config({
  cloud_name: envConfig.cloudinary_cloud_name,
  api_key: envConfig.cloudinary_api_key,
  api_secret: envConfig.cloudinary_api_secret,
});

export const uploadToCloudinary = async (
  localFilePath: string
): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "digimart",
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath); 
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); 
    return null;
  }
};
