import { Document, model, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
}
export interface ISubCategory extends Document {
  categoryId: Schema.Types.ObjectId;
  sub_category: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const subCategorySchema = new Schema<ISubCategory>(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    sub_category: { type: String, default: undefined },
  },
  { timestamps: true }
);

export const Category = model<ICategory>("Category", categorySchema);
export const SubCategory = model<ISubCategory>(
  "SubCategory",
  subCategorySchema
);
