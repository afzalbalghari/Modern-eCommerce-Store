const express = require("express");
const router  = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productPhotoUpload,
  addReview,
  updateReview,
  deleteReview,
  getTopProducts,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  getProductStats,
} = require("../controllers/productController");

const { protect, authorize } = require("../middleware/auth");
const advancedResults         = require("../middleware/advancedResults");
const upload                  = require("../middleware/upload");
const Product                 = require("../models/Product");

// ── Special routes (must be before /:id) ─────────────────
router.get("/top",                getTopProducts);
router.get("/featured",           getFeaturedProducts);
router.get("/search",             searchProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/stats",              protect, authorize("admin"), getProductStats);

// ── Main CRUD ─────────────────────────────────────────────
router
  .route("/")
  .get(
    advancedResults(Product),
    getProducts
  )
  .post(protect, authorize("admin"), createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(protect,    authorize("admin"), updateProduct)
  .delete(protect, authorize("admin"), deleteProduct);

// ── Photo upload ──────────────────────────────────────────
router.put(
  "/:id/photo",
  protect,
  authorize("admin"),
  upload.single("photo"),
  productPhotoUpload
);

// ── Reviews ───────────────────────────────────────────────
router.post("/:id/reviews",                   protect, addReview);
router.put("/:id/reviews/:reviewId",          protect, updateReview);
router.delete("/:id/reviews/:reviewId",       protect, deleteReview);

module.exports = router;
