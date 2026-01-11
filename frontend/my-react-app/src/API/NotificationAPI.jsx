import { client, getAuthHeaders } from "./clientAPI";

/**
 * Get notifications for a user
 * @param {number} userId - The ID of the user
 * @returns {Promise<any>}
 */
export const getUserNotifications = async (userId) => {
  try {
    const response = await client.get(`/notifications/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {number} notificationId - The ID of the notification
 * @returns {Promise<any>}
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await client.patch(
      `/notifications/${notificationId}/read`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {number} userId - The ID of the user
 * @returns {Promise<any>}
 */
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const response = await client.patch(
      `/notifications/user/${userId}/read-all`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};
