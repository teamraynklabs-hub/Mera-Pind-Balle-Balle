import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    imageId: {
      type: String,
      required: true,
    },
    images: [
      {
        url: { type: String },
        imageId: { type: String },
      },
    ],
    category: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      default: "",
      trim: true,
    },
    material: {
      type: String,
      default: "",
      trim: true,
    },
    color: {
      type: String,
      default: "",
      trim: true,
    },
    weight: {
      type: String,
      default: "",
      trim: true,
    },
    story: {
      type: String,
      default: "",
    },
    careInstructions: {
      type: String,
      default: "",
    },
    socialImpact: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

export default models.Product || model("Product", ProductSchema);
