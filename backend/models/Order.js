const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  product:    { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  name:       { type: String, required: true },
  image:      { type: String, required: true },
  price:      { type: Number, required: true },
  qty:        { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
});

const ShippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address:  { type: String, required: true },
  city:     { type: String, required: true },
  zip:      { type: String, default: "" },
  country:  { type: String, required: true },
  phone:    { type: String, default: "" },
  email:    { type: String, default: "" },
});

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    orderItems:       [OrderItemSchema],
    shippingAddress:  ShippingAddressSchema,
    paymentMethod: {
      type: String,
      required: true,
      enum: ["card", "cod", "paypal", "stripe"],
      default: "card",
    },
    paymentResult: {
      id:          String,
      status:      String,
      updateTime:  String,
      emailAddress: String,
    },
    itemsPrice:    { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    taxPrice:      { type: Number, required: true, default: 0.0 },
    totalPrice:    { type: Number, required: true, default: 0.0 },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    isPaid:       { type: Boolean, default: false },
    paidAt:       Date,
    isDelivered:  { type: Boolean, default: false },
    deliveredAt:  Date,
    trackingNumber: String,
    notes:          String,
    cancelledAt:    Date,
    cancelReason:   String,
  },
  { timestamps: true }
);

// ── Auto-generate order number ────────────────────────
OrderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${String(count + 1000 + 1).padStart(6, "0")}`;
  }
  next();
});

// ── Virtual: short status label ───────────────────────
OrderSchema.virtual("statusLabel").get(function () {
  const map = {
    pending:    "Order Placed",
    processing: "Processing",
    shipped:    "Shipped",
    delivered:  "Delivered",
    cancelled:  "Cancelled",
    refunded:   "Refunded",
  };
  return map[this.status] || this.status;
});

OrderSchema.set("toJSON", { virtuals: true });
OrderSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Order", OrderSchema);
