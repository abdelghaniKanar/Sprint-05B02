// routes/users.js - ES Module version
import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import {
  validateProfileUpdate,
  checkValidation,
} from "../middleware/validation.js";
import * as userController from "../controllers/userController.js";

const router = Router();

// @route   PUT /api/users/profile
// @desc    Update user profile (non-sensitive info)
// @access  Private
router.put(
  "/profile",
  authMiddleware,
  validateProfileUpdate,
  checkValidation,
  userController.updateProfile
);

// @route   POST /api/users/request-update
// @desc    Request update for sensitive information (email or phone)
// @access  Private
router.post(
  "/request-update",
  authMiddleware,
  userController.requestSensitiveUpdate
);

// @route   GET /api/users/confirm-update/:field/:token
// @desc    Confirm sensitive information update
// @access  Public
router.get(
  "/confirm-update/:field/:token",
  userController.confirmSensitiveUpdate
);

// @route   GET /api/users/history/:userId
// @desc    Get user history
// @access  Admin only
router.get(
  "/history/:userId",
  authMiddleware,
  adminMiddleware,
  userController.getUserHistory
);

// @route   GET /api/users
// @desc    Get all users
// @access  Admin only
router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);

// @route   GET /api/users/count
// @desc    Get user count
// @access  Admin only
router.get(
  "/count",
  authMiddleware,
  adminMiddleware,
  userController.getUserCount
);

export default router;
