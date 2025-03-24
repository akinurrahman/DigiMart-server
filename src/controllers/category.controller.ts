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
      .json(new ApiResponse(200, [], "No categories found!"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories Fetched successfully!"));
});

export const getSubCategories = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;

  if (!categoryId) {
    throw new ApiError(400, "Please provdie an category id")
  }

  const subCategories = await SubCategory.find({ categoryId });

  if (!subCategories.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No Subcategories found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, subCategories, "Subcategories fetched successfully!")
    );
});

export const deleteSubCategory = asyncHandler(async (req, res) => {
  const subCategoryId = req.params.subCategoryId;

  if (!subCategoryId) {
    throw new ApiError(
      400,
      "Please provide subcategory id",
      ERROR_CODES.BAD_REQUEST
    );
  }

  const subcategory = await SubCategory.findByIdAndDelete(subCategoryId);

  if (!subcategory) {
    throw new ApiError(404, "No subcategory found", ERROR_CODES.NOT_FOUND);
  }

  res
    .status(200)
    .json(new ApiResponse(200, subcategory, "Item deleted successfully"));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;

  if (!categoryId) {
    throw new ApiError(400, "Please provide an categor id");
  }

  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    throw new ApiError(400, "Incorrect category id");
  }

  await SubCategory.deleteMany({ categoryId });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        category,
        "Category and its subcategories deleted successfully"
      )
    );
});
