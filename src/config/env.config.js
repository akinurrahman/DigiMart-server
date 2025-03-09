import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

export const envConfig = {
  port: process.env.PORT || 8000,
  node_env: process.env.NODE_ENV || "production",
  cors_origin: process.env.CORS_ORIGIN,
  mongodb_uri: process.env.MONGODB_URI,

  accesstoken_secret: process.env.ACCESS_TOKEN_SECRET,
  accesstoken_expiry: process.env.ACCESS_TOKEN_EXPIRY,

  refreshtoken_secret: process.env.REFRESH_TOKEN_SECRET,
  refreshtoken_expiry: process.env.REFRESH_TOKEN_EXPIRY,

  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
};
