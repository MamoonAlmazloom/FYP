// routes/reportRoutes.js
import express from "express";
import reportController from "../controllers/reportController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// GET /api/reports/:reportId (View Specific Report)
router.get("/:reportId", reportController.getReport);

// PUT /api/reports/:reportId/review (Supervisor Review Report)
router.put("/:reportId/review", reportController.reviewReport);

export default router;
