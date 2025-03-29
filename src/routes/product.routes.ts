import { Router } from "express";
import { verfiyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { addProduct, fetchProducts } from "../controllers/product.controller.js";

const productRoutes = Router()

productRoutes
  .route("/")
  .post(verifyJWT, verfiyAdmin, addProduct)
  .get(fetchProducts);


export default productRoutes;