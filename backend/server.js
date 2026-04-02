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


module.exports = server;
