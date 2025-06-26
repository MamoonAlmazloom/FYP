// controllers/userController.js
import bcrypt from "bcrypt";
import authModel from "../models/authModel.js";

/**
 * Handle user registration
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, student_id_number } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
        message: "Name, email, password, and role are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
        message: "Please provide a valid email address",
      });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Weak password",
        message: "Password does not meet complexity requirements",
      });
    }

    // Role validation - only allow student and supervisor self-registration
    if (!["student", "supervisor"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: "Invalid role",
        message: "Invalid role for registration",
      });
    }

    // Check if email already exists
    const existingUser = await authModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Email already exists",
        message: "Email already in use",
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const userData = {
      name,
      email,
      password_hash,
      role,
      student_id_number,
      is_active: true,
      is_fyp_eligible: role === "student" ? true : undefined,
    };

    const newUser = await authModel.createUser(userData);

    // Return user data without password
    const responseUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      student_id_number: newUser.student_id_number,
    };

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: responseUser,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  register,
};
