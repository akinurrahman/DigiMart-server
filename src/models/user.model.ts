import { model, Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.js";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "user" | "admin";
  refreshToken: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified("refreshToken") && this.refreshToken) {
    this.refreshToken = await bcrypt.hash(this.refreshToken, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id }, envConfig.accesstoken_secret, {
    expiresIn: "15m",
  });
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    envConfig.refreshtoken_secret,
    {
      expiresIn: "3d",
    }
  );
};

export const User = model<IUser>("User", userSchema);
