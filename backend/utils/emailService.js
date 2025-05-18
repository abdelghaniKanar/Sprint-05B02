// utils/emailService.js - ES Module version
import nodemailer from "nodemailer";
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
      filename: "logs/email-error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "logs/email.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Configure the email transporter
const createTransporter = () => {
  // For development, you can use a service like Mailtrap for testing
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USER || "your_mailtrap_user",
      pass: process.env.EMAIL_PASS || "your_mailtrap_password",
    },
  });
};

// Send verification email
export const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "verification@backroom.com",
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>If you did not sign up on our platform, please ignore this email.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Verification email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error("Error sending verification email:", error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@backroom.com",
      to: email,
      subject: "Reset Your Password",
      html: `
        <h1>Password Reset Request</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Password reset email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error("Error sending password reset email:", error);
    return false;
  }
};

// Send confirmation email for sensitive data change
export const sendUpdateConfirmationEmail = async (email, field, token) => {
  try {
    const transporter = createTransporter();
    const confirmUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/confirm-update?field=${field}&token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@backroom.com",
      to: email,
      subject: `Confirm ${
        field.charAt(0).toUpperCase() + field.slice(1)
      } Update`,
      html: `
        <h1>Confirm Information Update</h1>
        <p>Please click the link below to confirm your ${field} update:</p>
        <a href="${confirmUrl}">Confirm Update</a>
        <p>If you did not request this change, please contact support immediately.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Update confirmation email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error("Error sending update confirmation email:", error);
    return false;
  }
};
