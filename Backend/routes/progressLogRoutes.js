// routes/progressLogRoutes.js
import express from "express";
import progressLogController from "../controllers/progressLogController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// PUT /api/progress-logs/:logId/review (Supervisor Review Log)
router.put("/:logId/review", progressLogController.reviewProgressLog);

export default router;
