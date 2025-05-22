// controllers/notificationController.js
import notificationModel from "../models/notificationModel.js";

/**
 * Get notifications for a user
 */
const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { limit, onlyUnread } = req.query;

    const limitNum = limit ? parseInt(limit, 10) : 10;
    const showOnlyUnread = onlyUnread === "true";

    const notifications = await notificationModel.getUserNotifications(
      userId,
      limitNum,
      showOnlyUnread
    );

    res.status(200).json({
      success: true,
      notifications,
      count: notifications.length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Mark a notification as read
 */
const markNotificationAsRead = async (req, res, next) => {
  try {
    const notificationId = req.params.notificationId;

    const success = await notificationModel.markNotificationAsRead(
      notificationId
    );

    if (success) {
      res.status(200).json({
        success: true,
        message: "Notification marked as read",
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Mark all notifications as read for a user
 */
const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const count = await notificationModel.markAllNotificationsAsRead(userId);

    res.status(200).json({
      success: true,
      message: `${count} notifications marked as read`,
      count,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a custom notification (only for admins/managers)
 */
const createCustomNotification = async (req, res, next) => {
  try {
    const { userId, eventName, message } = req.body;

    if (!userId || !eventName || !message) {
      return res.status(400).json({
        success: false,
        error: "User ID, event name, and message are required",
      });
    }

    const notificationId = await notificationModel.createNotification(
      userId,
      eventName,
      message
    );

    res.status(201).json({
      success: true,
      notification_id: notificationId,
      message: "Notification created successfully",
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createCustomNotification,
};
