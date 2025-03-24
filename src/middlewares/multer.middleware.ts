import multer from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: function (req: Request, file: any, cb: any) {
    cb(null, "./public/temp");
  },
  filename: function (req: Request, file: any, cb: any) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
