// routes/authRoutes.js
import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

// Login route
router.post("/login", authController.login);

export default router;