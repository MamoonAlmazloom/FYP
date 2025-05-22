// routes/deadlineRoutes.js
import express from "express";
import deadlineController from "../controllers/deadlineController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Route to manually trigger deadline notifications
// Only managers can trigger this
router.post(
  "/process",
  auth.verifyToken,
  auth.hasAnyRole(["Manager"]),
  deadlineController.processDeadlineNotifications
);

// Route to get upcoming deadlines
// Only managers can view all upcoming deadlines
router.get(
  "/upcoming",
  auth.verifyToken,
  auth.hasAnyRole(["Manager"]),
  deadlineController.getUpcomingDeadlines
);

export default router;
