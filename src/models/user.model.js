import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env.config.js";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect =async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id }, envConfig.accesstoken_secret, {
    expiresIn: envConfig.accesstoken_expiry,
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
      expiresIn: envConfig.refreshtoken_expiry,
    }
  );
};

export const User = model("User", userSchema);
