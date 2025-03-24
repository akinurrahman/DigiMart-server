import mongoose from "mongoose";
import { envConfig } from "./env.config.js";
import { DB_NAME } from "../constants.js";

export const connectDb = async () => {
  try {
    const connectionInstence = await mongoose.connect(
      `${envConfig.mongodb_uri}/${DB_NAME}`
    );
    console.log(
      `MongoDB connntected!! \nDB Host : ${connectionInstence.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection Failed", error);
  }
};
