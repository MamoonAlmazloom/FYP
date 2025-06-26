// notificationService.js - Notification service
import pool from "../db.js";

export const notifyUser = async (userId, message, type = "info") => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO notifications (user_id, message, type, status) VALUES (?, ?, ?, "unread")',
      [userId, message, type]
    );

    console.log(`📧 Notification sent to user ${userId}: ${message}`);
    return {
      success: true,
      notificationId: result.insertId,
      message: "Notification sent successfully",
    };
  } catch (error) {
    console.error("Error sending notification:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const notifyRole = async (role, message, type = "info") => {
  try {
    // Get all users with the specified role
    const [users] = await pool.execute("SELECT id FROM users WHERE role = ?", [
      role,
    ]);

    // Send notification to each user
    const notifications = [];
    for (const user of users) {
      const result = await notifyUser(user.id, message, type);
      notifications.push(result);
    }

    console.log(`📢 Notification sent to all ${role}s: ${message}`);
    return {
      success: true,
      notificationsSent: notifications.length,
      message: `Notification sent to all ${role}s`,
    };
  } catch (error) {
    console.error("Error sending role notification:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const getUserNotifications = async (userId, limit = 50) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
      [userId, limit]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const [result] = await pool.execute(
      'UPDATE notifications SET status = "read", updated_at = NOW() WHERE id = ?',
      [notificationId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

export const sendEmail = async (to, subject, content) => {
  // Mock email service - replace with actual email implementation
  console.log(`📧 Email sent to ${to}: ${subject}`);
  return {
    success: true,
    message: "Email sent successfully (mock)",
  };
};

export default {
  notifyUser,
  notifyRole,
  getUserNotifications,
  markNotificationAsRead,
  sendEmail,
};
