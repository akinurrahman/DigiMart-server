import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadFiles } from "../controllers/util.controllers.js";

const router = Router();

router.route("/files").post(verifyJWT, upload.array("files", 5), uploadFiles);
export default router;
