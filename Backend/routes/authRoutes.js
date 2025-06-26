// routes/authRoutes.js
import express from "express";
import authController from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Authentication routes
router.post("/login", authController.login);
router.post("/logout", auth.verifyToken, authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;
