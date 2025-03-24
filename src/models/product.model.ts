import { Document, model, Schema } from "mongoose";

interface ProductImages {
  thumbnail: string;
  url: string;
}

export interface IProduct extends Document {
  product_name: string;
  product_description: string;
  category: String;
  sub_category?: String;
  originalPrice: number;
  discountPercentage: number;
  isBestSeller: boolean;
  productImages: ProductImages[];
  sizes: ("XS" | "S" | "M" | "L" | "XL" | "XXL")[];
  stock: number;
  tags: string[];
  status: "active" | "draft";
  notes?: string;
}

const productSchema = new Schema<IProduct>(
  {
    product_name: {
      type: String,
      required: [true, "Name is required"],
    },
    product_description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please select a category"],
    },
    sub_category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    originalPrice: {
      type: Number,
      required: [true, "Original Price is required"],
    },
    discountPercentage: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
      default: 0,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    productImages: [
      {
        url: { type: String, required: true },
        thumbnail: { type: String, required: true },
      },
    ],
    sizes: {
      type: [String],
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      required: [true, "Size is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock Quantity is required"],
      min: [1, "Stock can't be negative"],
      default: 1,
    },
    tags: [String],
    status: {
      type: String,
      enum: ["active", "draft"],
      default: "active",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

productSchema.virtual("sellingPrice").get(function () {
  return (
    this.originalPrice - (this.originalPrice * this.discountPercentage) / 100
  );
});

export const Product = model<IProduct>("Product", productSchema);
