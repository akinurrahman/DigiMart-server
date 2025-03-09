import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { envConfig } from "./config/env.config.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import userRouter from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: envConfig.cors_origin,
    credientials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


app.use("/api/v1/auth", userRouter);

app.use(errorHandler);
export default app;
