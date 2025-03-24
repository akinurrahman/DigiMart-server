import { Router } from "express";
import { verfiyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { addProduct } from "../controllers/product.controller.js";

const productRoutes = Router()

productRoutes
.route("/").post(verifyJWT, verfiyAdmin, addProduct)


export default productRoutes;