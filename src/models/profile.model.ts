import { model, Schema, Types, Document } from "mongoose";

interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL"; 
}

export interface IProfile extends Document {
  userId: Types.ObjectId;
  fullName: string;
  cart: CartItem[]; 
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, 
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
        size: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
          required: true,
        }, 
      },
    ],
  },
  { timestamps: true, minimize: false }
);

export const Profile = model<IProfile>("Profile", profileSchema);
