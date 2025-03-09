import { model, Schema, Types } from "mongoose";

const profileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fullName: { type: String, required: true },
    cart: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        size: { type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"] },
      },
    ],
  },
  { timestamps: true, minimize: false }
);

export const Profile = model("Profile", profileSchema);
