const mongoose = require("mongoose");
const slugify  = require("slugify");

const ReviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    name:    { type: String, required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: [true, "Review comment is required"], maxlength: 500 },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      default: function () { return this.price; },
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: ["electronics", "fashion", "home", "sports", "books", "beauty", "toys", "kitchen", "other"],
    },
    brand:    { type: String, default: "Generic" },
    images:   [{ type: String }],
    image:    { type: String, default: "no-photo.jpg" },
    features: [{ type: String }],
    stock: {
      type: Number,
      required: [true, "Please add stock quantity"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    sold:   { type: Number, default: 0 },
    badge:  { type: String, enum: ["NEW", "HOT", "SALE", ""], default: "" },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [ReviewSchema],
    isFeatured: { type: Boolean, default: false },
    isActive:   { type: Boolean, default: true },
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    tags: [{ type: String }],
    weight: { type: Number, default: 0 },         // in kg
    dimensions: {
      length: { type: Number, default: 0 },
      width:  { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────────────
ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ createdAt: -1 });

// ── Slugify name ──────────────────────────────────────
ProductSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

// ── Discount percentage (virtual) ────────────────────
ProductSchema.virtual("discountPercent").get(function () {
  if (this.originalPrice > this.price) {
    return Math.round((1 - this.price / this.originalPrice) * 100);
  }
  return 0;
});

// ── Update avg rating after review changes ────────────
ProductSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.rating    = 0;
    this.numReviews = 0;
  } else {
    this.rating    = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
};

module.exports = mongoose.model("Product", ProductSchema);
