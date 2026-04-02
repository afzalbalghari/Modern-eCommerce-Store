const path        = require("path");
const express     = require("express");
const dotenv      = require("dotenv");
const morgan      = require("morgan");
const colors      = require("colors");
const cors        = require("cors");
const helmet      = require("helmet");
const hpp         = require("hpp");
const rateLimit   = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser  = require("cookie-parser");

// Load env vars
dotenv.config({ path: "./.env" });

const connectDB      = require("./config/db");
const errorHandler   = require("./middleware/error");

// Route files
const authRoutes    = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes   = require("./routes/orderRoutes");
const userRoutes    = require("./routes/userRoutes");

// Connect to DB
connectDB();

const app = express();

// ── Body parser ───────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Cookie parser ─────────────────────────────────────────
app.use(cookieParser());

// ── Dev logging ───────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Security: HTTP headers ────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// ── Security: sanitize MongoDB query injection ─────────────
app.use(mongoSanitize());

// ── Security: prevent HTTP param pollution ────────────────
app.use(hpp());

// ── Rate limiting ─────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  message: { success: false, error: "Too many requests, please try again in 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: "Too many login attempts, please try again later" },
});
app.use("/api/auth/login",    authLimiter);
app.use("/api/auth/register", authLimiter);

// ── CORS ──────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods:     ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Static files (uploaded images) ───────────────────────


module.exports = server;
