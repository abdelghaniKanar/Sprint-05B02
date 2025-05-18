// controllers/userController.js - ES Module version
import { User, History } from "../models/User.js";
import { generateRandomToken } from "../utils/tokenService.js";
import { sendUpdateConfirmationEmail } from "../utils/emailService.js";
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
      filename: "logs/user-error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "logs/user.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Update user profile (non-sensitive information)
export const updateProfile = async (req, res) => {
  try {
    const { username, nickname } = req.body;
    const updates = {};

    // Only include fields that are provided
    if (username) updates.username = username;
    if (nickname) {
      // Check if nickname already exists
      const existingUser = await User.findOne({
        nickname,
        _id: { $ne: req.user.id },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Nickname already taken" });
      }
      updates.nickname = nickname;
    }

    // If there are no updates, return early
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid updates provided" });
    }

    // Find the user and update
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Track changes for history
    for (const [field, value] of Object.entries(updates)) {
      if (user[field] !== value) {
        await new History({
          userId: user._id,
          field,
          oldValue: user[field],
          newValue: value,
        }).save();

        // Update the user field
        user[field] = value;
      }
    }

    await user.save();

    // Log the profile update
    logger.info(`Profile updated for user: ${user.email}`, {
      userId: user._id,
      updates,
    });

    res.json({
      message: "Profile updated successfully",
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
    logger.error("Update profile error:", error);
    res.status(500).json({ message: "Server error during profile update" });
  }
};

// Request update for sensitive information (email or phone)
export const requestSensitiveUpdate = async (req, res) => {
  try {
    const { field, value } = req.body;

    // Only allow email or phone updates
    if (field !== "email" && field !== "phone") {
      return res
        .status(400)
        .json({ message: "Invalid field for sensitive update" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new value is already used by another user
    const existingUser = await User.findOne({
      [field]: value,
      _id: { $ne: req.user.id },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `This ${field} is already registered` });
    }

    // Generate verification token
    const updateToken = generateRandomToken();
    const tokenField = `${field}UpdateToken`;
    const expireField = `${field}UpdateTokenExpires`;
    const newValueField = `new${
      field.charAt(0).toUpperCase() + field.slice(1)
    }`;

    // Set update info
    user[tokenField] = updateToken;
    user[expireField] = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    user[newValueField] = value;
    await user.save();

    // Send confirmation email
    const emailSent = await sendUpdateConfirmationEmail(
      user.email,
      field,
      updateToken
    );

    if (!emailSent) {
      logger.error(
        `Failed to send ${field} update confirmation email to ${user.email}`
      );
      return res
        .status(500)
        .json({ message: "Could not send confirmation email" });
    }

    // Log the update request
    logger.info(`${field} update requested for user: ${user.email}`, {
      userId: user._id,
      field,
      newValue: value,
    });

    res.json({
      message: `Please check your email to confirm the ${field} update`,
    });
  } catch (error) {
    logger.error("Request sensitive update error:", error);
    res.status(500).json({ message: "Server error during update request" });
  }
};

// Confirm sensitive information update
export const confirmSensitiveUpdate = async (req, res) => {
  try {
    const { field, token } = req.params;

    // Only allow email or phone updates
    if (field !== "email" && field !== "phone") {
      return res
        .status(400)
        .json({ message: "Invalid field for sensitive update" });
    }

    const tokenField = `${field}UpdateToken`;
    const expireField = `${field}UpdateTokenExpires`;
    const newValueField = `new${
      field.charAt(0).toUpperCase() + field.slice(1)
    }`;

    // Find user with the update token
    const user = await User.findOne({
      [tokenField]: token,
      [expireField]: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Record the change in history
    await new History({
      userId: user._id,
      field,
      oldValue: user[field],
      newValue: user[newValueField],
    }).save();

    // Update the field
    const oldValue = user[field];
    user[field] = user[newValueField];

    // Clear update fields
    user[tokenField] = undefined;
    user[expireField] = undefined;
    user[newValueField] = undefined;

    await user.save();

    // Log the update confirmation
    logger.info(`${field} updated for user: ${user.email}`, {
      userId: user._id,
      field,
      oldValue,
      newValue: user[field],
    });

    res.json({ message: `Your ${field} has been updated successfully` });
  } catch (error) {
    logger.error("Confirm sensitive update error:", error);
    res
      .status(500)
      .json({ message: "Server error during update confirmation" });
  }
};

// Get user history (admin only)
export const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get history for the user
    const history = await History.find({ userId }).sort({ timestamp: -1 });

    res.json(history);
  } catch (error) {
    logger.error("Get user history error:", error);
    res.status(500).json({ message: "Server error retrieving user history" });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    logger.error("Get all users error:", error);
    res.status(500).json({ message: "Server error retrieving users" });
  }
};

// Get user count (admin only)
export const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    logger.error("Get user count error:", error);
    res.status(500).json({ message: "Server error retrieving user count" });
  }
};
