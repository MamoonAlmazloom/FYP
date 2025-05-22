// routes/testRoutes.js
import express from "express";
import pool from "../db.js";
import notificationModel from "../models/notificationModel.js";

const router = express.Router();

// Only enable in development mode
const isDevelopment = process.env.NODE_ENV === "development";

if (isDevelopment) {
  /**
   * Test route to create a deadline notification
   * POST /api/test/deadline-notification
   *
   * Body: {
   *   userId: number,
   *   daysLeft: number,
   *   deadlineType: string,
   *   itemTitle: string
   * }
   */
  router.post("/deadline-notification", async (req, res, next) => {
    try {
      const { userId, daysLeft, deadlineType, itemTitle } = req.body;

      if (!userId || !daysLeft || !deadlineType || !itemTitle) {
        return res.status(400).json({
          success: false,
          error: "All fields are required",
        });
      }

      await notificationModel.notifyForUpcomingDeadline(
        userId,
        deadlineType,
        daysLeft,
        itemTitle
      );

      res.status(200).json({
        success: true,
        message: "Test deadline notification created",
      });
    } catch (err) {
      next(err);
    }
  });
}

export default router;
