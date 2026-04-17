import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load ENV first
dotenv.config();

// Initialize app
const app = express();

// Global error handlers (important for Railway)
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION:', err);
  process.exit(1);
});

// Database & Cloudinary Connections (with error handling)
const startConnections = async () => {
  try {
    await connectDB();
    await connectCloudinary();
    console.log('✅ Database and Cloudinary connected');
  } catch (err) {
    console.error('❌ Failed to connect to DB/Cloudinary:', err);
    process.exit(1);
  }
};
startConnections();

// --- CORS CONFIGURATION ---
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
const devLocalOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

let allowedOrigins = [];

if (allowedOriginsEnv) {
  const envOrigins = allowedOriginsEnv.split(',').map(origin => origin.trim());
  allowedOrigins = [...envOrigins, ...devLocalOrigins];
} else {
  const frontendUrl = process.env.FRONTEND_URL;
  allowedOrigins = [frontendUrl, ...devLocalOrigins].filter(Boolean);
}

allowedOrigins = [...new Set(allowedOrigins)];
const vercelRegex = /\.vercel\.app$/;

console.log('✅ Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.includes(origin) || vercelRegex.test(origin);
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked request from origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '50mb', verify: (req, res, buf) => { req.rawBody = buf; } }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);
app.use("/api", newsletterRoutes);
app.use("/api", contactRoutes);
app.use("/api", userRoutes);

// Health check endpoint (important for Railway)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "🚀 ShopHub API Running Successfully" });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API Route Not Found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || "Internal Server Error" });
});

// Start Server - Bind to all interfaces (0.0.0.0) for Railway
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});