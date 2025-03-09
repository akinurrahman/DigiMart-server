import { Router } from "express";
import {
  loginApi,
  logOutApi,
  registerApi,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerApi);
router.route("/login").post(loginApi);
router.route("/logout").post(verifyJWT, logOutApi);

export default router;
