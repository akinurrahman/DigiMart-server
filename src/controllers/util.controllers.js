import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const uploadFiles = asyncHandler(async (req, res) => {
  if (!req.files || !req.files.length) {
    throw new ApiError(400, "Please upload at least 1 file");
  }

  const fileUrls = [];
  for (let file of req.files) {
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
