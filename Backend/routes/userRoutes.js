// routes/userRoutes.js
import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

// User registration route
router.post("/register", userController.register);

export default router;
