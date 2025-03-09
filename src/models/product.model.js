import { model, Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please select a category"],
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please select a sub category"],
    },
    originalPrice: {
      type: Number,
      required: [true, "Original Price is required"],
    },
    discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
      default: 0,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    images: [{ type: String, required: true }],
    sizes: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      required: [true, "Size is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock Quantity is required"],
      min: [1, "Stock can't be negative"],
      default: 1,
    },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

productSchema.virtual("sellingPrice").get(function () {
  return this.originalPrice - (this.originalPrice * this.discount) / 100;
});


export const Product = model("Product", productSchema);
