const asyncHandler  = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User          = require("../models/User");
const Order         = require("../models/Order");

// ─────────────────────────────────────────────────────────
//  @desc    Get all users (admin)
//  @route   GET /api/users
//  @access  Private/Admin
// ─────────────────────────────────────────────────────────
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// ─────────────────────────────────────────────────────────
//  @desc    Get single user (admin)
//  @route   GET /api/users/:id
//  @access  Private/Admin
// ─────────────────────────────────────────────────────────
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("orders");
  if (!user) return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
  res.status(200).json({ success: true, data: user });
});

// ─────────────────────────────────────────────────────────
//  @desc    Create user (admin)
//  @route   POST /api/users
//  @access  Private/Admin
// ─────────────────────────────────────────────────────────
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

// ─────────────────────────────────────────────────────────
//  @desc    Update user (admin)
//  @route   PUT /api/users/:id
//  @access  Private/Admin
// ─────────────────────────────────────────────────────────
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Prevent direct password changes through this route
  delete req.body.password;

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
  res.status(200).json({ success: true, data: user });
});

// ─────────────────────────────────────────────────────────
//  @desc    Delete user (admin)
//  @route   DELETE /api/users/:id
//  @access  Private/Admin
// ─────────────────────────────────────────────────────────
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));

  // Prevent deleting self
  if (user._id.toString() === req.user.id) {
    return next(new ErrorResponse("You cannot delete your own account", 400));
  }

  await user.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

// ─────────────────────────────────────────────────────────
//  @desc    Get user stats for admin dashboard
//  @route   GET /api/users/stats
//  @access  Private/Admin
// ─────────────────────────────────────────────────────────
exports.getUserStats = asyncHandler(async (req, res, next) => {
  const [totals, byRole, byMonth] = await Promise.all([
    User.aggregate([
      {
        $group: {
          _id:        null,
          totalUsers: { $sum: 1 },
          admins:     { $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] } },
        },
      },
    ]),
    User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]),
    // New signups per month (last 6 months)
    User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) },
        },
      },
      {
        $group: {
          _id:   { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: { totals: totals[0] || {}, byRole, byMonth },
  });
});

// ─────────────────────────────────────────────────────────
//  @desc    Get current user's profile with wishlist populated
//  @route   GET /api/users/profile
//  @access  Private
// ─────────────────────────────────────────────────────────
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .populate("wishlist", "name price image images rating category");

  const recentOrders = await Order.find({ user: req.user.id })
    .sort("-createdAt")
    .limit(5);

  res.status(200).json({
    success: true,
    data: { user, recentOrders },
  });
});
