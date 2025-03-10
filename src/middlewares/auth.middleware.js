import { envConfig } from "../config/env.config.js";
import { ERROR_CODES } from "../constants.js";
import { User } from "../models/user.model.js";
import { ApiError, asyncHandler } from "../utils/index.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "unauthorized", ERROR_CODES.UNAUTHORIZED);
    }

    const decodedToken = jwt.verify(token, envConfig.accesstoken_secret);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(
        401,
        "Invalid Access Token",
        ERROR_CODES.INVALID_TOKEN
      );
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const verfiyAdmin = asyncHandler(async(req,_,next)=>{
  if(!req.user){
    throw new ApiError(401, "unauthorized! no user found", ERROR_CODES.UNAUTHORIZED)
  }

  if(req.user.role !== 'admin'){
    throw new ApiError(403, "Forbidden! Admin Access Required", ERROR_CODES.FORBIDDEN)
  }

  next()
})
