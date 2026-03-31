const express = require("express");
const router  = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  updateOrderToPaid,
  cancelOrder,
  getOrderStats,
} = require("../controllers/orderController");

const { protect, authorize } = require("../middleware/auth");

// ── User routes ───────────────────────────────────────────
router.post("/",               protect, createOrder);
router.get("/mine",            protect, getMyOrders);
router.get("/:id",             protect, getOrder);
router.put("/:id/pay",         protect, updateOrderToPaid);
router.put("/:id/cancel",      protect, cancelOrder);

// ── Admin routes ──────────────────────────────────────────
router.get("/",                protect, authorize("admin"), getAllOrders);
router.get("/stats/summary",   protect, authorize("admin"), getOrderStats);
router.put("/:id/status",      protect, authorize("admin"), updateOrderStatus);

module.exports = router;
