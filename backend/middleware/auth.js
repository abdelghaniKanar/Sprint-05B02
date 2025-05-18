// middleware/auth.js - ES Module version
import { verifyToken } from "../utils/tokenService.js";

// Middleware to protect routes by requiring a valid JWT
export const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    // Add user id and role to request
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Middleware to restrict routes to admin only
export const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admin role required" });
  }
};
