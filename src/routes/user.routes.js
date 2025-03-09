import { Router } from "express";
import { loginApi, registerApi } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(registerApi)
router.route("/login").post(loginApi)

export default router;