// services/notificationService.js

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Get user's notifications
 * @param {number} userId - The user ID
 * @param {number} limit - Maximum number of notifications to fetch
 * @param {boolean} onlyUnread - Whether to fetch only unread notifications
 * @returns {Promise<Object>} - Response with notifications
 */
export const getUserNotifications = async (
  userId,
  limit = 10,
  onlyUnread = false
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      onlyUnread: onlyUnread.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/notifications/${userId}?${queryParams}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {number} notificationId - The notification ID
 * @returns {Promise<Object>} - Response confirmation
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} - Response confirmation
 */
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_BASE_URL}/notifications/${userId}/read-all`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

/**
 * Create a custom notification (Manager only)
 * @param {number} userId - The target user ID
 * @param {string} eventName - The event name
 * @param {string} message - The notification message
 * @returns {Promise<Object>} - Response confirmation
 */
export const createCustomNotification = async (userId, eventName, message) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        eventName,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * Test notification service (for development)
 * @returns {Promise<Object>} - Test notification data
 */
export const testNotificationService = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/test`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error testing notification service:", error);
    throw error;
  }
};
