import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config({
  path: "./.env",
});

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is required but not set.`);
  }
  return value;
};

// Set up the environment configuration
export const envConfig = {
  port: Number(process.env.PORT) || 8000, 
  node_env: process.env.NODE_ENV || "production",
  cors_origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  mongodb_uri: getEnvVar("MONGODB_URI"),

  accesstoken_secret: getEnvVar("ACCESS_TOKEN_SECRET"),

  refreshtoken_secret: getEnvVar("REFRESH_TOKEN_SECRET"),

  cloudinary_api_key: getEnvVar("CLOUDINARY_API_KEY"),
  cloudinary_api_secret: getEnvVar("CLOUDINARY_API_SECRET"),
  cloudinary_cloud_name: getEnvVar("CLOUDINARY_CLOUD_NAME"),
};
