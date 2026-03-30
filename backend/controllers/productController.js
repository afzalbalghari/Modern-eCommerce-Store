const path         = require("path");
const asyncHandler  = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Product       = require("../models/Product");

// ─────────────────────────────────────────────────────────
//  @desc    Get all products (with advancedResults)
//  @route   GET /api/products
//  @access  Public
// ─────────────────────────────────────────────────────────
exports.getProducts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// ─────────────────────────────────────────────────────────
//  @desc    Get single product
//  @route   GET /api/products/:id
//  @access  Public
// ─────────────────────────────────────────────────────────
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("user", "name email");
  if (!product) return next(new ErrorResponse(`Product not found with id ${req.params.id}`, 404));
  res.status(200).json({ success: true, data: product });
});

// ─────────────────────────────────────────────────────────
//  @desc    Create product
//  @route   POST /api/products
//  @access  Private/Admin
// ─────────────────────────────────────────────────────────
exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

// ─────────────────────────────────────────────────────────
//  @desc    Update product
//  @route   PUT /api/products/:id
//  @access  Private/Admin
// ─────────────────────────────────────────────────────────
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorResponse(`Product not found with id ${req.params.id}`, 404));

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: product });
});

// ─────────────────────────────────────────────────────────
//  @desc    Delete product
//  @route   DELETE /api/products/:id
//  @access  Private/Admin
// ─────────────────────────────────────────────────────────
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorResponse(`Product not found with id ${req.params.id}`, 404));
  await product.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

// ─────────────────────────────────────────────────────────
//  @desc    Upload product image
//  @route   PUT /api/products/:id/photo
//  @access  Private/Admin
// ─────────────────────────────────────────────────────────
exports.productPhotoUpload = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorResponse(`Product not found with id ${req.params.id}`, 404));

  if (!req.file) return next(new ErrorResponse("Please upload a file", 400));

  const fileName = req.file.filename;
  await Product.findByIdAndUpdate(req.params.id, { image: fileName });

  res.status(200).json({ success: true, data: fileName });
});

// ─────────────────────────────────────────────────────────
//  @desc    Add review to product
//  @route   POST /api/products/:id/reviews
//  @access  Private
// ─────────────────────────────────────────────────────────
exports.addReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorResponse(`Product not found`, 404));

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user.id.toString()
  );
  if (alreadyReviewed) {
    return next(new ErrorResponse("You have already reviewed this product", 400));
  }

  const review = {
    user:    req.user.id,
    name:    req.user.name,
    rating:  Number(req.body.rating),
    comment: req.body.comment,
  };

  product.reviews.push(review);
  product.updateRating();
  await product.save();

  res.status(201).json({ success: true, data: product.reviews });
});

// ─────────────────────────────────────────────────────────
//  @desc    Update a review
//  @route   PUT /api/products/:id/reviews/:reviewId
//  @access  Private
// ─────────────────────────────────────────────────────────
exports.updateReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorResponse("Product not found", 404));

  const review = product.reviews.id(req.params.reviewId);
  if (!review) return next(new ErrorResponse("Review not found", 404));

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorised to update this review", 403));
  }

  if (req.body.rating)  review.rating  = Number(req.body.rating);
  if (req.body.comment) review.comment = req.body.comment;

  product.updateRating();
  await product.save();

  res.status(200).json({ success: true, data: product.reviews });
});

// ─────────────────────────────────────────────────────────
//  @desc    Delete a review
//  @route   DELETE /api/products/:id/reviews/:reviewId
//  @access  Private
// ─────────────────────────────────────────────────────────
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorResponse("Product not found", 404));

  const review = product.reviews.id(req.params.reviewId);
  if (!review) return next(new ErrorResponse("Review not found", 404));

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorised to delete this review", 403));
  }

  review.deleteOne();
  product.updateRating();
  await product.save();

  res.status(200).json({ success: true, data: {} });
});

// ─────────────────────────────────────────────────────────
//  @desc    Get top-rated products
//  @route   GET /api/products/top
//  @access  Public
// ─────────────────────────────────────────────────────────
exports.getTopProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ isActive: true })
    .sort({ rating: -1 })
    .limit(parseInt(req.query.limit) || 8);
  res.status(200).json({ success: true, count: products.length, data: products });
});

// ─────────────────────────────────────────────────────────
//  @desc    Get featured products
//  @route   GET /api/products/featured
//  @access  Public
// ─────────────────────────────────────────────────────────
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ isFeatured: true, isActive: true }).limit(8);
  res.status(200).json({ success: true, count: products.length, data: products });
});

// ─────────────────────────────────────────────────────────
//  @desc    Get products by category
//  @route   GET /api/products/category/:category
//  @access  Public
// ─────────────────────────────────────────────────────────
exports.getProductsByCategory = asyncHandler(async (req, res, next) => {
  const products = await Product.find({
    category: req.params.category,
    isActive: true,
  }).sort("-createdAt");
  res.status(200).json({ success: true, count: products.length, data: products });
});

// ─────────────────────────────────────────────────────────
//  @desc    Search products (text search)
//  @route   GET /api/products/search?q=keyword
//  @access  Public
// ─────────────────────────────────────────────────────────
exports.searchProducts = asyncHandler(async (req, res, next) => {
  const { q } = req.query;
  if (!q) return next(new ErrorResponse("Please provide a search term", 400));

  const products = await Product.find({
    $text: { $search: q },
    isActive: true,
  }).sort({ score: { $meta: "textScore" } });

  res.status(200).json({ success: true, count: products.length, data: products });
});

// ─────────────────────────────────────────────────────────
//  @desc    Get product stats (admin dashboard)
//  @route   GET /api/products/stats
//  @access  Private/Admin
// ─────────────────────────────────────────────────────────
exports.getProductStats = asyncHandler(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $group: {
        _id:          "$category",
        count:        { $sum: 1 },
        avgPrice:     { $avg: "$price" },
        totalStock:   { $sum: "$stock" },
        totalSold:    { $sum: "$sold" },
        avgRating:    { $avg: "$rating" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const totals = await Product.aggregate([
    {
      $group: {
        _id:        null,
        totalProducts: { $sum: 1 },
        totalStock:    { $sum: "$stock" },
        totalSold:     { $sum: "$sold" },
        avgPrice:      { $avg: "$price" },
        avgRating:     { $avg: "$rating" },
        outOfStock:    { $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] } },
      },
    },
  ]);

  res.status(200).json({ success: true, data: { byCategory: stats, totals: totals[0] } });
});
