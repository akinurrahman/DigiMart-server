import { ApiError } from "../utils/index.js";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If the error is an instance of ApiError, use its statusCode and message
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  // For other errors, use a generic 500 status
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
