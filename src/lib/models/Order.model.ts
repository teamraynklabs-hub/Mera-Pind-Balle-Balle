import { Schema, model, models } from "mongoose";

function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MPBB-${date}-${rand}`;
}

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    orderNumber: {
      type: String,
      unique: true,
      index: true,
      default: generateOrderNumber,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        line1: { type: String, required: true },
        line2: { type: String, default: "" },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
      },
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: {
      type: String,
      enum: [
        "PLACED",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PLACED",
    },
    estimatedDelivery: { type: Date },
    deliveredAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

OrderSchema.pre("validate", function () {
  if (!this.estimatedDelivery) {
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 8);
    this.estimatedDelivery = delivery;
  }
});

export default models.Order || model("Order", OrderSchema);
