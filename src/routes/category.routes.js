import { Router } from "express";
import { verfiyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { addCategory, addSubCategory, getAllCategories, getSubCategories } from "../controllers/category.controller.js";

const router = Router()

router.route("/category").post(verifyJWT, verfiyAdmin, addCategory);
router.route("/category/:categoryId").post(verifyJWT, verfiyAdmin, addSubCategory);
router.route("/category").get(getAllCategories)
router.route("/category/:categoryId").get(getSubCategories);

export default router;