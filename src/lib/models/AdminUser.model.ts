import mongoose, { Schema, models, model } from "mongoose";

const AdminUserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    role: {
      type: String,
      enum: ["admin", "editor"],
      default: "admin",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.AdminUser || model("AdminUser", AdminUserSchema);
