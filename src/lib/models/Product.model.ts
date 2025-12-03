import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    price: Number,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
