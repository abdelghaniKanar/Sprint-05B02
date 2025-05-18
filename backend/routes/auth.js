// routes/auth.js - ES Module version
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  validateRegistration,
  validateLogin,
  validatePasswordReset,
  checkValidation,
} from "../middleware/validation.js";
import * as authController from "../controllers/authController.js";

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  validateRegistration,
  checkValidation,
  authController.register
);

// @route   GET /api/auth/verify/:token
// @desc    Verify email with token
// @access  Public
router.get("/verify/:token", authController.verifyEmail);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post("/login", validateLogin, checkValidation, authController.login);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post("/forgot-password", authController.forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post(
  "/reset-password/:token",
  validatePasswordReset,
  checkValidation,
  authController.resetPassword
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", authMiddleware, authController.getCurrentUser);

export default router;
