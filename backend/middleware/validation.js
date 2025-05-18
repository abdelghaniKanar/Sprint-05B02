// middleware/validation.js - ES Module version
import { body, validationResult } from "express-validator";

// Validation middleware for registration
export const validateRegistration = [
  body("nickname")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Nickname must be between 3 and 30 characters"),

  body("username")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters"),

  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("phone")
    .trim()
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be exactly 10 digits"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain at least one letter"),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

// Validation middleware for login
export const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("password").not().isEmpty().withMessage("Password is required"),
];

// Validation middleware for profile update
export const validateProfileUpdate = [
  body("nickname")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Nickname must be between 3 and 30 characters"),

  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),

  body("phone")
    .optional()
    .trim()
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be exactly 10 digits"),
];

// Validation middleware for password reset
export const validatePasswordReset = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain at least one letter"),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

// Middleware to check for validation errors
export const checkValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
      })),
    });
  }

  next();
};
