import { Product } from "../models/product.model.js";
import { formatZodErrors } from "../utils/format-zod-errors.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { productSchema } from "../validations/product.validations.js";

export const addProduct = asyncHandler(async (req, res) => {
  const validationResult = productSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res
      .status(400)
      .json(new ApiError(400, formatZodErrors(validationResult.error)));
  }

  const data = validationResult.data;

  // Check if a product with the same name exists
  const existingProduct = await Product.findOne({
    product_name: data.product_name,
  });
  if (existingProduct) {
    throw new ApiError(400, "You can't add a product with the same name");
  }

  // Create new product
  const newProduct = await Product.create(data);

  res
    .status(201)
    .json(new ApiResponse(201, newProduct, "Product created successfully"));
});


export const fetchProducts = asyncHandler(async (req, res) => {
  const data = await Product.find()
    .populate("category", "name")
    .populate("sub_category", "subCategory")
    .sort({ createdAt: -1 }); 

  if (data.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No products available")); 
  }

  res
    .status(200)
    .json(new ApiResponse(200, data, "Products fetched successfully!"));
});
