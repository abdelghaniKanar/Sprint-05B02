// utils/tokenService.js - ES Module version
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Generate a JWT for authentication
export const generateAuthToken = (userId, role) => {
  const token = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || "your_jwt_secret",
    { expiresIn: "24h" }
  );
  return token;
};

// Verify a JWT token
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret"
    );
    return decoded;
  } catch (error) {
    return null;
  }
};

// Generate a random token for email verification or password reset
export const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
