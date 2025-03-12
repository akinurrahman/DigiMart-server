import { envConfig } from "../config/env.config.js";
import {
  accessTokenExpiryInMS,
  ERROR_CODES,
  refreshTokenExpiryInMS,
} from "../constants.js";
import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const cookieOptions = {
  httpOnly: true,
  secure: envConfig.node_env === "production",
  sameSite: envConfig.node_env === "production" ? "None" : "Lax",
};

export const registerApi = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!(fullName && email && password)) {
    throw new ApiError(
      400,
      "Please provide all the information",
      ERROR_CODES.BAD_REQUEST
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User Already Exists", ERROR_CODES.BAD_REQUEST);
  }

  const newUser = await User.create({ email, password });
  await Profile.create({ userId: newUser._id, fullName });

  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();

  newUser.refreshToken = refreshToken;
  await newUser.save();

  res
    .status(201)
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
        201,
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
    throw new ApiError(401, "Invalid Credentials", ERROR_CODES.UNAUTHORIZED);

  const user = await User.findOne({ email });
  if (!user)
    throw new ApiError(401, "Invalid Credentials", ERROR_CODES.UNAUTHORIZED);

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid Credentials", ERROR_CODES.UNAUTHORIZED);
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
    .status(200)
    .json(
      new ApiResponse(
        200,
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
  await User.findByIdAndUpdate(req.user._id, { refreshToken: undefined });

  res
    .status(200)
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incommingRefreshToken) {
    throw new ApiError(401, "Unauthorized request", ERROR_CODES.UNAUTHORIZED);
  }

  try {
    const decodedToken = jwt.verify(
      incommingRefreshToken,
      envConfig.refreshtoken_secret
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(
        401,
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
        401,
        "Refresh token expired or used",
        ERROR_CODES.TOKEN_EXPIRED
      );
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: accessTokenExpiryInMS,
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: refreshTokenExpiryInMS,
      })
      .json(new ApiResponse(200,accessToken, "access token refreshed"))
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(
        401,
        "Refresh token expired. Please log in again.",
        ERROR_CODES.TOKEN_EXPIRED
      );
    }
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});
