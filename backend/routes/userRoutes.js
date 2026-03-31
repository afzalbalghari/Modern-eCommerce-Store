const express = require("express");
const router  = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
  getProfile,
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/auth");
const advancedResults         = require("../middleware/advancedResults");
const User                    = require("../models/User");

// ── Profile (any logged-in user) ──────────────────────────
router.get("/profile", protect, getProfile);

// ── Admin-only routes ─────────────────────────────────────
router.use(protect, authorize("admin"));

router.get("/stats", getUserStats);

router
  .route("/")
  .get(advancedResults(User), getUsers)
  .post(createUser);

router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
