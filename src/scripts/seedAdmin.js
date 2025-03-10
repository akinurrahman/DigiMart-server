import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import dotenv from "dotenv";
import { envConfig } from "../config/env.config.js";
import { DB_NAME } from "../constants.js";

dotenv.config();

async function seedAdmin() {
  await mongoose.connect(`${envConfig.mongodb_uri}/${DB_NAME}`);

  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log("✅ Admin already exists");
    return;
  }

  await User.create({
    email: "",
    password: "",
    role: "admin",
  });

  console.log("✅ Admin created successfully");
}

seedAdmin().then(() => mongoose.disconnect());
