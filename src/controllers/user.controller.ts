import { envConfig } from "../config/env.config.js";
import {
  accessTokenExpiryInMS,
  ERROR_CODES,
  refreshTokenExpiryInMS,
} from "../constants.js";
import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { CookieOptions } from "express";
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "../constants/http.js";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: envConfig.node_env === "production",
  sameSite: envConfig.node_env === "production" ? "none" : "lax",
};

export const registerApi = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!(fullName && email && password)) {
    throw new ApiError(
      BAD_REQUEST,
      "Please provide all the information",
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(BAD_REQUEST, "User Already Exists");
  }

  const newUser = await User.create({ email, password });
  await Profile.create({ userId: newUser._id, fullName });

  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();

  newUser.refreshToken = refreshToken;
  await newUser.save();

  res
    .status(CREATED)
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: refreshTokenExpiryInMS,
    })
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: accessTokenExpiryInMS,
    })
    .json(
      new ApiResponse(
        CREATED,
        {
          user: {
            fullName,
            email,
            role: "user",
          },
          accessToken,
        },
        "User created successfully"
      )
    );
});

export const loginApi = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password))
    throw new ApiError(UNAUTHORIZED, "Invalid Credentials", ERROR_CODES.UNAUTHORIZED);

  const user = await User.findOne({ email }).select("+password");
  if (!user)
    throw new ApiError(UNAUTHORIZED, "Invalid Credentials", ERROR_CODES.UNAUTHORIZED);

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(
      UNAUTHORIZED,
      "Invalid Credentials",
      ERROR_CODES.UNAUTHORIZED
    );
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();
  res
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: refreshTokenExpiryInMS,
    })
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: accessTokenExpiryInMS,
    })
    .status(OK)
    .json(
      new ApiResponse(
        OK,
        {
          user: {
            email,
            role: user.role,
          },
          accessToken,
        },
        "Login Successfull!"
      )
    );
});

export const logOutApi = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: undefined }).select("+refreshToken");

  res
    .status(OK)
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json(new ApiResponse(OK, {}, "User logged out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incommingRefreshToken) {
    throw new ApiError(UNAUTHORIZED, "Unauthorized request", ERROR_CODES.UNAUTHORIZED);
  }

  try {
    const decodedToken = jwt.verify(
      incommingRefreshToken,
      envConfig.refreshtoken_secret
    ) as JwtPayload & { _id: string };

    const user = await User.findById(decodedToken._id).select("+refreshToken");

    if (!user) {
      throw new ApiError(
        UNAUTHORIZED,
        "Invalid refresh token",
        ERROR_CODES.INVALID_TOKEN
      );
    }

    const match = await bcrypt.compare(
      incommingRefreshToken,
      user.refreshToken
    );
    if (!match) {
      throw new ApiError(
        UNAUTHORIZED,
        "Refresh token expired or used",
        ERROR_CODES.TOKEN_EXPIRED
      );
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res
      .status(OK)
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: accessTokenExpiryInMS,
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: refreshTokenExpiryInMS,
      })
      .json(new ApiResponse(OK, accessToken, "access token refreshed"));
  } catch (error: any) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      throw new ApiError(
        UNAUTHORIZED,
        "Refresh token expired. Please log in again.",
        ERROR_CODES.TOKEN_EXPIRED
      );
    }
    throw new ApiError(UNAUTHORIZED, error?.message || "Invalid refresh token");
  }
});
