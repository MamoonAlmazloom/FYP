// controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import authModel from "../models/authModel.js";

/**
 * Handle user login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    } // Find user by email
    const user = await authModel.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check if user is active
    if (user.is_active === false || user.is_active === 0) {
      return res.status(400).json({
        success: false,
        error: "Account is inactive",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Get user roles
    const roles = await authModel.getUserRoles(user.user_id);
    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.user_id,
        name: user.name,
        email: user.email,
        roles: roles,
      },
      process.env.JWT_SECRET || "your-secret-key", // Use environment variable in production
      { expiresIn: "24h" } // Extended from 1h to 24h for testing convenience
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        roles: roles,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handle user logout
 */
const logout = async (req, res, next) => {
  try {
    // For JWT-based authentication, logout is typically handled client-side
    // However, we can provide a success response
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handle forgot password request
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // Check if user exists
    const user = await authModel.findUserByEmail(email);

    // Always return success to prevent email enumeration
    return res.status(200).json({
      success: true,
      message:
        "If your email is registered, you will receive a password reset email",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Handle password reset
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, new_password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Token is required",
      });
    }

    if (!new_password) {
      return res.status(400).json({
        success: false,
        error: "New password is required",
      });
    }

    // Basic password strength check
    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password does not meet complexity requirements",
      });
    }

    // Validate reset token and get user
    const user = await authModel.validateResetToken(token);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    // Update user password
    await authModel.updateUserPassword(user.user_id, new_password);

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (err) {
    next(err);
  }
};

export default {
  login,
  logout,
  forgotPassword,
  resetPassword,
};
