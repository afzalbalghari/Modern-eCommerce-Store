const asyncHandler  = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Order         = require("../models/Order");
const Product       = require("../models/Product");

// ─────────────────────────────────────────────────────────
//  @desc    Create new order
//  @route   POST /api/orders
//  @access  Private
// ─────────────────────────────────────────────────────────
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod, notes } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorResponse("No order items provided", 400));
  }

  // ── Validate stock & calculate prices ──────────────
  let itemsPrice = 0;
  const validatedItems = [];

  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) return next(new ErrorResponse(`Product ${item.product} not found`, 404));
    if (product.stock < item.qty) {
      return next(new ErrorResponse(`Insufficient stock for "${product.name}" (available: ${product.stock})`, 400));
    }

    validatedItems.push({
      product:    product._id,
      name:       product.name,
      image:      product.image || (product.images && product.images[0]) || "no-photo.jpg",
      price:      product.price,
      qty:        item.qty,
      totalPrice: product.price * item.qty,
    });
    itemsPrice += product.price * item.qty;
  }

  const shippingPrice = itemsPrice >= 50 ? 0 : 9.99;
  const taxPrice      = parseFloat((itemsPrice * 0.08).toFixed(2));
  const totalPrice    = parseFloat((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  // ── Create order ───────────────────────────────────
  const order = await Order.create({
    user:            req.user.id,
    orderItems:      validatedItems,
    shippingAddress,
    paymentMethod:   paymentMethod || "card",
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    notes,
  });

  // ── Decrement stock & increment sold ──────────────
  for (const item of validatedItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.qty, sold: item.qty },
    });
  }

  res.status(201).json({ success: true, data: order });
});

// ─────────────────────────────────────────────────────────
//  @desc    Get logged-in user's orders
//  @route   GET /api/orders/mine
//  @access  Private
// ─────────────────────────────────────────────────────────
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const page  = parseInt(req.query.page,  10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip  = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user.id })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .populate("orderItems.product", "name image images price"),
    Order.countDocuments({ user: req.user.id }),
  ]);

  res.status(200).json({
    success: true,
    count:   orders.length,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    data:    orders,
  });
});

// ─────────────────────────────────────────────────────────
//  @desc    Get single order by ID
//  @route   GET /api/orders/:id
//  @access  Private
// ─────────────────────────────────────────────────────────
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email phone")
    .populate("orderItems.product", "name image images price category");

  if (!order) return next(new ErrorResponse(`Order not found`, 404));

  // Users can only see their own orders; admins can see all
  if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorised to view this order", 403));
  }

  res.status(200).json({ success: true, data: order });
});

// ─────────────────────────────────────────────────────────
//  @desc    Get ALL orders (admin)
//  @route   GET /api/orders
//  @access  Private/Admin
// ─────────────────────────────────────────────────────────
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const page   = parseInt(req.query.page,   10) || 1;
  const limit  = parseInt(req.query.limit,  10) || 20;
  const skip   = (page - 1) * limit;

  // Optional status filter
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .populate("user", "name email"),
    Order.countDocuments(filter),
  ]);

  // Revenue stats
  const revenueStats = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    success: true,
    count:   orders.length,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    revenue: revenueStats[0] || { totalRevenue: 0, count: 0 },
    data:    orders,
  });
});

// ─────────────────────────────────────────────────────────
//  @desc    Update order status (admin)
//  @route   PUT /api/orders/:id/status
//  @access  Private/Admin
// ─────────────────────────────────────────────────────────
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, trackingNumber } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorResponse("Order not found", 404));

  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];
  if (!validStatuses.includes(status)) {
    return next(new ErrorResponse(`Invalid status: ${status}`, 400));
  }

  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  if (status === "delivered") {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  if (status === "processing" || status === "shipped" || status === "delivered") {
    order.isPaid  = true;
    order.paidAt  = order.paidAt || Date.now();
  }
  if (status === "cancelled") {
    order.cancelledAt = Date.now();
    order.cancelReason = req.body.cancelReason || "Cancelled by admin";

    // Restore stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.qty, sold: -item.qty },
      });
    }
  }

  await order.save();
  res.status(200).json({ success: true, data: order });
});

// ─────────────────────────────────────────────────────────
//  @desc    Mark order as paid
//  @route   PUT /api/orders/:id/pay
//  @access  Private
// ─────────────────────────────────────────────────────────
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorResponse("Order not found", 404));

  // Ensure the requesting user owns this order
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorised", 403));
  }

  order.isPaid  = true;
  order.paidAt  = Date.now();
  order.status  = "processing";
  order.paymentResult = {
    id:           req.body.id,
    status:       req.body.status,
    updateTime:   req.body.update_time,
    emailAddress: req.body.payer?.email_address,
  };

  const updatedOrder = await order.save();
  res.status(200).json({ success: true, data: updatedOrder });
});

// ─────────────────────────────────────────────────────────
//  @desc    Cancel order (user can cancel if still pending)
//  @route   PUT /api/orders/:id/cancel
//  @access  Private
// ─────────────────────────────────────────────────────────
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorResponse("Order not found", 404));

  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Not authorised", 403));
  }

  if (!["pending", "processing"].includes(order.status)) {
    return next(new ErrorResponse(`Cannot cancel order with status "${order.status}"`, 400));
  }

  order.status       = "cancelled";
  order.cancelledAt  = Date.now();
  order.cancelReason = req.body.reason || "Cancelled by user";

  // Restore stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.qty, sold: -item.qty },
    });
  }

  await order.save();
  res.status(200).json({ success: true, data: order });
});

// ─────────────────────────────────────────────────────────
//  @desc    Admin dashboard stats
//  @route   GET /api/orders/stats
//  @access  Private/Admin
// ─────────────────────────────────────────────────────────
exports.getOrderStats = asyncHandler(async (req, res, next) => {
  const [overall, byStatus, byMonth] = await Promise.all([
    // Overall totals
    Order.aggregate([
      {
        $group: {
          _id:          null,
          totalOrders:  { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
          paidRevenue:  { $sum: { $cond: ["$isPaid", "$totalPrice", 0] } },
          avgOrderValue:{ $avg: "$totalPrice" },
        },
      },
    ]),

    // Orders by status
    Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 }, revenue: { $sum: "$totalPrice" } } },
      { $sort: { count: -1 } },
    ]),

    // Orders by month (last 12 months)
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) },
        },
      },
      {
        $group: {
          _id:     { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count:   { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      overall:  overall[0] || {},
      byStatus,
      byMonth,
    },
  });
});
