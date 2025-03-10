import { ERROR_CODES } from "../constants.js";
import { Category, SubCategory } from "../models/category.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

export const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const isExists = await Category.findOne({ name });

  if (isExists) {
    throw new ApiError(
      409,
      "Category Already Exists",
      ERROR_CODES.DUPLICATE_ENTRY
    );
  }

  const category = await Category.create({ name });

  res
    .status(201)
    .json(new ApiResponse(201, category, "New Category Added Successfully!"));
});

export const addSubCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;
  const { subCategory } = req.body;

  if (!(categoryId && subCategory)) {
    throw new ApiError(400, "Invalid Input", ERROR_CODES.VALIDATION_ERROR);
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "No category found", ERROR_CODES.BAD_REQUEST);
  }

  const isExists = await SubCategory.findOne({ categoryId, subCategory });

  if (isExists) {
    throw new ApiError(
      409,
      "SubCategory Already Exists",
      ERROR_CODES.DUPLICATE_ENTRY
    );
  }

  const newSubCategory = await SubCategory.create({ categoryId, subCategory });

  res
    .status(201)
    .json(
      new ApiResponse(201, newSubCategory, "SubCategory created successfully!")
    );
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  if (!categories.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "Don't have any categories"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories Fetched successfully!"));
});
