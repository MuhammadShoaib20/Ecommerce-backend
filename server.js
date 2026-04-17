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
import userRoutes from "./routes/userRoutes.js"; // <-- new

// Load ENV first
dotenv.config();

// Initialize app
const app = express();

// Database & Cloudinary Connections
connectDB();
connectCloudinary();

// --- CORS CONFIGURATION (STABLE & DYNAMIC) ---
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

// Vercel subdomains ko handle karne ke liye Regex
const vercelRegex = /\.vercel\.app$/;

console.log('✅ Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (Postman, etc.)
    if (!origin) return callback(null, true);

    // 2. Check if origin is in the allowed list OR matches Vercel pattern
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
// --- END CORS ---

// Body parser with raw body for webhook verification
app.use(express.json({
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);
app.use("/api", newsletterRoutes);
app.use("/api", contactRoutes);
app.use("/api", userRoutes); // <-- new

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 ShopHub API Running Successfully",
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});