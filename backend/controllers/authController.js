// controllers/authController.js - ES Module version
import { User } from "../models/User.js";
import {
  generateAuthToken,
  generateRandomToken,
} from "../utils/tokenService.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/emailService.js";
import winston from "winston";

// Create a logger instance
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/auth-error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "logs/auth.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Register a new user
export const register = async (req, res) => {
  try {
    const { nickname, username, email, phone, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    user = await User.findOne({ nickname });
    if (user) {
      return res.status(400).json({ message: "Nickname already taken" });
    }

    user = await User.findOne({ phone });
    if (user) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    // Create new user
    user = new User({
      nickname,
      username,
      email,
      phone,
      password,
      verificationToken: generateRandomToken(),
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      user.verificationToken
    );

    if (!emailSent) {
      logger.error(`Failed to send verification email to ${email}`);
    }

    // Log the registration
    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      message:
        "Registration successful, please check your email to verify your account",
      userId: user._id,
    });
  } catch (error) {
    logger.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Verify email with token
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with the verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Log the verification
    logger.info(`Email verified for user: ${user.email}`);

    res.json({ message: "Email verified successfully, you can now log in" });
  } catch (error) {
    logger.error("Email verification error:", error);
    res.status(500).json({ message: "Server error during email verification" });
  }
};

// User login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = generateAuthToken(user._id, user.role);

    // Log the login
    logger.info(`User logged in: ${user.email}`);

    res.json({
      token,
      user: {
        id: user._id,
        nickname: user.nickname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Request password reset
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      return res.json({
        message: "If your email is registered, you will receive a reset link",
      });
    }

    // Generate reset token
    const resetToken = generateRandomToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      logger.error(`Failed to send password reset email to ${email}`);
      return res.status(500).json({ message: "Could not send reset email" });
    }

    // Log the password reset request
    logger.info(`Password reset requested for: ${email}`);

    res.json({
      message: "If your email is registered, you will receive a reset link",
    });
  } catch (error) {
    logger.error("Forgot password error:", error);
    res
      .status(500)
      .json({ message: "Server error during password reset request" });
  }
};

// Reset password with token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user with the reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Log the password reset
    logger.info(`Password reset completed for user: ${user.email}`);

    res.json({
      message:
        "Password reset successful, you can now log in with your new password",
    });
  } catch (error) {
    logger.error("Reset password error:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
};

// Get current user information
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    logger.error("Get current user error:", error);
    res.status(500).json({ message: "Server error retrieving user data" });
  }
};
