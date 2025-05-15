// app.js
import dotenv from "dotenv"; // Load environment variables
import express from "express";
import morgan from "morgan"; // HTTP request logger
import cors from "cors"; // Enable CORS
import path from "path";
import { fileURLToPath } from "url";

// Initialize dotenv
dotenv.config();

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import database configuration
import db from "./db.js";

// Import auth model to initialize admin
import authModel from "./models/authModel.js";

// Initialize admin user
authModel.initializeAdmin()
  .then(() => console.log("Admin initialization attempted"))
  .catch(err => console.error("Error during admin initialization:", err));

// Test database connection
db.getConnection();

// Import routes
import studentRoutes from "./routes/studentRoutes.js";
import supervisorRoutes from "./routes/supervisorRoutes.js";
import moderatorRoutes from "./routes/moderatorRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";
import examinerRoutes from "./routes/examinerRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Initialize app
const app = express();

// Middleware
app.use(morgan("dev")); // Log HTTP requests
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// Static files (if needed)
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/supervisors", supervisorRoutes);
app.use("/api/moderators", moderatorRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/examiners", examinerRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "FYP Management API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
});

export default app;