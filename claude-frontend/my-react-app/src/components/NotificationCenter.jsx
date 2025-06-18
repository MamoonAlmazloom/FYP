// components/NotificationCenter.jsx
import React, { useState, useEffect } from "react";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  testNotificationService,
} from "../services/notificationService";

const NotificationCenter = ({ userId, className = "" }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    if (!userId) {
      // If no userId (not authenticated), show test notifications
      try {
        const testData = await testNotificationService();
        setNotifications(testData.data || []);
        setLoading(false);
      } catch (error) {
        setError("Failed to load test notifications");
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getUserNotifications(
        userId,
        showAll ? 50 : 10,
        false
      );
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications. Please try again.");
      // Fallback to test notifications
      try {
        const testData = await testNotificationService();
        setNotifications(testData.data || []);
      } catch (testError) {
        setNotifications([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    if (!userId) return; // Can't mark test notifications as read

    try {
      await markNotificationAsRead(notificationId);
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notification_id === notificationId
            ? { ...notif, is_read: true }
            : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return; // Can't mark test notifications as read

    try {
      await markAllNotificationsAsRead(userId);
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return "Just now";
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  const getNotificationIcon = (eventName) => {
    switch (eventName) {
      case "proposal_submitted":
      case "proposal_modified":
        return "📝";
      case "proposal_approved":
        return "✅";
      case "proposal_rejected":
        return "❌";
      case "proposal_needs_modification":
        return "🔄";
      case "deadline_reminder":
        return "⏰";
      case "examiner_assigned":
        return "🎯";
      case "project_evaluated":
        return "📊";
      case "feedback_received":
        return "💬";
      case "log_submitted":
      case "report_submitted":
        return "📝";
      case "test":
        return "🔔";
      default:
        return "📢";
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          🔔 Notification Center
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
              {unreadCount}
            </span>
          )}
        </h3>
        <div className="flex gap-2">
          {userId && unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={() => {
              setShowAll(!showAll);
              fetchNotifications();
            }}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            {showAll ? "Show recent" : "Show all"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading notifications...</span>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchNotifications}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.notification_id || notification.id}
              className={`p-4 rounded-lg border-l-4 ${
                notification.is_read
                  ? "bg-gray-50 border-gray-300"
                  : "bg-blue-50 border-blue-500"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <span className="text-xl">
                    {getNotificationIcon(notification.event_name)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(notification.timestamp)}
                      {notification.event_name && (
                        <span className="ml-2 px-2 py-1 bg-gray-200 rounded text-xs">
                          {notification.event_name.replace(/_/g, " ")}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {userId && !notification.is_read && (
                  <button
                    onClick={() =>
                      handleMarkAsRead(notification.notification_id)
                    }
                    className="text-xs text-blue-600 hover:text-blue-800 ml-2"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!userId && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            ⚠️ Demo Mode: Showing test notifications. Real notifications require
            authentication.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
