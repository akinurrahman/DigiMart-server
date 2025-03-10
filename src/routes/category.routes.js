import { Router } from "express";
import { verfiyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { addCategory, addSubCategory, getAllCategories } from "../controllers/category.controller.js";

const router = Router()

router.route("/category").post(verifyJWT, verfiyAdmin, addCategory);
router.route("/category/:categoryId").post(verifyJWT, verfiyAdmin, addSubCategory);
router.route("/category").get(getAllCategories)

export default router;