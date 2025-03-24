import { z } from "zod";

export const productSchema = z.object({
  product_name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters long")
    .max(100, "Product name must not exceed 100 characters"),

  product_description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters long")
    .max(1000, "Description must not exceed 1000 characters"),

  category: z.string().trim().min(1, "Category is required"),

  sub_category: z.string().trim().optional(),

  originalPrice: z
    .number()
    .positive({ message: "Original price must be greater than 0" }),

  discountPercentage: z.number().min(0).max(100).default(0),

  stock: z.number().positive({ message: "Stock must be greater than 0" }),

  productImages: z
    .array(
      z.object({
        url: z.string().url("Invalid URL format for image"),
        thumbnail: z.string().url("Invalid URL format for thumbnail"),
      })
    )
    .min(1, "At least one product image is required")
    .max(8, "You can't upload more than 8 images"),

  sizes: z
    .array(z.enum(["XS", "S", "M", "L", "XL", "XXL"]))
    .min(1, "At least one size must be selected"),

  tags: z
    .array(z.string().min(1, "Tags cannot be empty"))
    .min(1, "At least 1 tag is required")
    .max(5, "You can't add more than five tags"),

  isBestSeller: z.boolean(),

  status: z.enum(["draft", "active"]),

  notes: z.string().optional(),
});

export type ProductType = z.infer<typeof productSchema>;
