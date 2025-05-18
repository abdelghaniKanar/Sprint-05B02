// server.js - ES Module version
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import winston from "winston";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as dotenv from "dotenv";

// Initialize environment variables
dotenv.config();

// Get current file and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();

// Logger setup
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(morgan("dev")); // HTTP request logger

// Database Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/auth-system")
  .then(() => {
    logger.info("MongoDB Connected");
  })
  .catch((err) => {
    logger.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Auth Microservice API is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({ error: "Server Error" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
