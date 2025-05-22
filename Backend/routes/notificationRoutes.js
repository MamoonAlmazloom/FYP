// routes/notificationRoutes.js
import express from "express";
import notificationController from "../controllers/notificationController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get notifications for a user
router.get(
  "/:userId",
  auth.verifyToken,
  auth.hasAnyRole([
    "Student",
    "Supervisor",
    "Moderator",
    "Manager",
    "Examiner",
  ]),
  notificationController.getUserNotifications
);

// Mark a notification as read
router.patch(
  "/:notificationId/read",
  auth.verifyToken,
  auth.hasAnyRole([
    "Student",
    "Supervisor",
    "Moderator",
    "Manager",
    "Examiner",
  ]),
  notificationController.markNotificationAsRead
);

// Mark all notifications as read for a user
router.patch(
  "/:userId/read-all",
  auth.verifyToken,
  auth.hasAnyRole([
    "Student",
    "Supervisor",
    "Moderator",
    "Manager",
    "Examiner",
  ]),
  notificationController.markAllNotificationsAsRead
);

// Create a custom notification (admin/manager only)
router.post(
  "/",
  auth.verifyToken,
  auth.hasAnyRole(["Manager"]),
  notificationController.createCustomNotification
);

export default router;
