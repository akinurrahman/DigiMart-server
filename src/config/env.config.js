import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

export const envConfig = {
  port: process.env.PORT || 8000,
  node_env : process.env.NODE_ENV || 'production',
  cors_origin : process.env.CORS_ORIGIN,
  mongodb_uri: process.env.MONGODB_URI,
  accesstoken: process.env.ACCESS_TOKEN,
  accesstoken_secret: process.env.ACCESS_TOKEN_SECRET,
  accesstoken_expiry: process.env.ACCESS_TOKEN_EXPIRY,
  refreshtoken: process.env.REFRESH_TOEKN,
  refreshtoken_secret: process.env.REFRESH_TOKEN_SECRET,
  refreshtoken_expiry: process.env.REFRESH_TOKEN_EXPIRY,
};
