import { Request, Response } from "express";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// Define the Multer file type
interface MulterFile {
  path: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
}

// Use type assertion inside the handler function to avoid asyncHandler typing issue
export const uploadFiles = asyncHandler(async (req, res) => {
  const files = req.files as MulterFile[] | undefined;

  if (!files || !files.length) {
    throw new ApiError(400, "Please upload at least 1 file");
  }

  const fileUrls = [];
  for (let file of files) {
    const fileUrl = await uploadToCloudinary(file.path);
    if (fileUrl) {
      fileUrls.push(fileUrl.url);
    }
  }

  if (!fileUrls.length) {
    throw new ApiError(500, "Failed to upload files");
  }

  res.status(201).json(new ApiResponse(201, { urls: fileUrls }));
});
