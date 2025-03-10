import { model, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const subCategorySchema = new Schema(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: String, required: true },
  },
  { timestamps: true }
);

export const Category = model("Category", categorySchema);
export const SubCategory = model("SubCategory", subCategorySchema);
