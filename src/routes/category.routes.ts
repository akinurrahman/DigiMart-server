import { Router } from "express";
import {  verfiyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addCategory,
  addSubCategory,
  deleteCategory,
  deleteSubCategory,
  getAllCategories,
  getSubCategories,
} from "../controllers/category.controller.js";

const router = Router();

// Category routes
router
  .route("/category")
  .post(verifyJWT, verfiyAdmin, addCategory) // Add Category
  .get(getAllCategories); // Get All Categories

router
  .route("/category/:categoryId")
  .post(verifyJWT, verfiyAdmin, addSubCategory) // Add Subcategory
  .get(getSubCategories) // Get Subcategories
  .delete(verifyJWT, verfiyAdmin, deleteCategory); // Delete Category

// Subcategory routes
router
  .route("/subcategory/:subCategoryId")
  .delete(verifyJWT, verfiyAdmin, deleteSubCategory);

export default router;
