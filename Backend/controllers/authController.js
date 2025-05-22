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

    // Find user by email
    const user = await authModel.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
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

export default {
  login,
};
