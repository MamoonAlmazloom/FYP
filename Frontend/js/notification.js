// notification.js - Shared notification functionality for all user types

// Notification polling interval in milliseconds (15 seconds)
const NOTIFICATION_POLL_INTERVAL = 15000;

// Store for unread notification count
let unreadNotificationCount = 0;

// Keep track of notifications we've already seen to avoid duplicates
const processedNotificationIds = new Set();

// Get user ID from localStorage (set during login)
function getUserId() {
  return localStorage.getItem("userId");
}

// Get auth token from localStorage (set during login)
function getAuthToken() {
  return localStorage.getItem("authToken");
}

// Get user role from localStorage (set during login)
function getUserRole() {
  return localStorage.getItem("userRole");
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

// Fetch notifications from the API
async function fetchNotifications() {
  const userId = getUserId();
  const authToken = getAuthToken();

  if (!userId || !authToken) {
    console.error("User ID or auth token not found");
    return [];
  }

  try {
    const response = await fetch(
      `/api/notifications/${userId}?onlyUnread=true&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching notifications: ${response.statusText}`);
    }

    const data = await response.json();
    return data.notifications || [];
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
}

// Update the notification UI with new notifications
function updateNotificationUI(notifications) {
  const notificationContainer = document.getElementById(
    "notification-container"
  );
  const notificationBadge = document.getElementById("notification-badge");

  if (!notificationContainer) {
    console.warn("Notification container not found in the DOM");
    return;
  }

  // Filter out notifications we've already processed
  const newNotifications = notifications.filter(
    (n) => !processedNotificationIds.has(n.notification_id)
  );

  // Update unread count
  unreadNotificationCount = notifications.length;

  // Update notification badge
  if (notificationBadge) {
    notificationBadge.textContent =
      unreadNotificationCount > 0 ? unreadNotificationCount : "";
    notificationBadge.style.display =
      unreadNotificationCount > 0 ? "block" : "none";
  }

  // Add new notifications to the container
  newNotifications.forEach((notification) => {
    const notificationElement = createNotificationElement(notification);
    notificationContainer.appendChild(notificationElement);

    // Mark as processed so we don't add it again
    processedNotificationIds.add(notification.notification_id);
  });
}

// Create HTML for a notification
function createNotificationElement(notification) {
  const notificationDiv = document.createElement("div");
  notificationDiv.className = "notification-item";
  notificationDiv.dataset.id = notification.notification_id;

  const timestamp = formatDate(notification.timestamp);

  notificationDiv.innerHTML = `
    <p class="notification-message">${notification.message}</p>
    <p class="notification-time">${timestamp}</p>
    <button class="mark-read-btn" onclick="markAsRead(${notification.notification_id})">Mark as read</button>
  `;

  return notificationDiv;
}

// Mark a notification as read
async function markAsRead(notificationId) {
  const authToken = getAuthToken();

  try {
    const response = await fetch(`/api/notifications/${notificationId}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error marking notification as read: ${response.statusText}`
      );
    }

    // Remove notification from UI
    const notificationElement = document.querySelector(
      `.notification-item[data-id="${notificationId}"]`
    );
    if (notificationElement) {
      notificationElement.remove();

      // Update unread count
      unreadNotificationCount = Math.max(0, unreadNotificationCount - 1);

      // Update notification badge
      const notificationBadge = document.getElementById("notification-badge");
      if (notificationBadge) {
        notificationBadge.textContent =
          unreadNotificationCount > 0 ? unreadNotificationCount : "";
        notificationBadge.style.display =
          unreadNotificationCount > 0 ? "block" : "none";
      }
    }
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
}

// Mark all notifications as read
async function markAllAsRead() {
  const userId = getUserId();
  const authToken = getAuthToken();

  try {
    const response = await fetch(`/api/notifications/${userId}/read-all`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error marking all notifications as read: ${response.statusText}`
      );
    }

    // Clear notifications from UI
    const notificationContainer = document.getElementById(
      "notification-container"
    );
    if (notificationContainer) {
      notificationContainer.innerHTML =
        '<p class="no-notifications">No new notifications</p>';
    }

    // Reset unread count
    unreadNotificationCount = 0;

    // Update notification badge
    const notificationBadge = document.getElementById("notification-badge");
    if (notificationBadge) {
      notificationBadge.textContent = "";
      notificationBadge.style.display = "none";
    }
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
  }
}

// Toggle notification panel
function toggleNotifications() {
  const notificationPanel = document.getElementById("notification-panel");
  if (notificationPanel) {
    notificationPanel.classList.toggle("show");
  }
}

// Initialize notifications system
function initNotifications() {
  // Create notification elements if they don't exist
  createNotificationElements();

  // Fetch notifications immediately
  fetchAndUpdateNotifications();

  // Set up polling for new notifications
  setInterval(fetchAndUpdateNotifications, NOTIFICATION_POLL_INTERVAL);
}

// Fetch notifications and update UI
async function fetchAndUpdateNotifications() {
  const notifications = await fetchNotifications();
  updateNotificationUI(notifications);
}

// Create notification HTML elements if they don't exist
function createNotificationElements() {
  // Only create elements if they don't already exist
  if (!document.getElementById("notification-system")) {
    // Create notification button for the header
    const headerNav = document.querySelector(".nav-links");
    if (headerNav) {
      const notificationBtn = document.createElement("a");
      notificationBtn.href = "javascript:void(0)";
      notificationBtn.className = "notification-btn";
      notificationBtn.onclick = toggleNotifications;
      notificationBtn.innerHTML = `
        🔔 <span id="notification-badge" class="notification-badge"></span>
      `;
      headerNav.appendChild(notificationBtn);
    }

    // Create notification panel
    const notificationPanel = document.createElement("div");
    notificationPanel.id = "notification-panel";
    notificationPanel.className = "notification-panel";
    notificationPanel.innerHTML = `
      <div class="notification-header">
        <h3>Notifications</h3>
        <button onclick="markAllAsRead()" class="mark-all-read-btn">Mark all as read</button>
      </div>
      <div id="notification-container" class="notification-container">
        <p class="no-notifications">Loading notifications...</p>
      </div>
    `;

    // Add notification system to the body
    const notificationSystem = document.createElement("div");
    notificationSystem.id = "notification-system";
    notificationSystem.appendChild(notificationPanel);
    document.body.appendChild(notificationSystem);

    // Add notification styles
    const notificationStyles = document.createElement("style");
    notificationStyles.textContent = `
      .notification-btn {
        position: relative;
        cursor: pointer;
      }
      
      .notification-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: red;
        color: white;
        font-size: 10px;
        border-radius: 50%;
        min-width: 15px;
        height: 15px;
        display: none;
        text-align: center;
        line-height: 15px;
      }
      
      .notification-panel {
        position: absolute;
        top: 60px;
        right: 20px;
        width: 350px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        display: none;
        max-height: 80vh;
        overflow-y: auto;
      }
      
      .notification-panel.show {
        display: block;
      }
      
      .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        background-color: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
        border-radius: 8px 8px 0 0;
      }
      
      .notification-header h3 {
        margin: 0;
        color: #212529;
      }
      
      .mark-all-read-btn {
        background-color: transparent;
        border: none;
        color: #007bff;
        cursor: pointer;
        font-size: 14px;
        padding: 0;
      }
      
      .notification-container {
        padding: 0;
        max-height: 400px;
        overflow-y: auto;
      }
      
      .notification-item {
        padding: 15px;
        border-bottom: 1px solid #dee2e6;
      }
      
      .notification-message {
        margin: 0 0 10px 0;
        color: #212529;
      }
      
      .notification-time {
        margin: 0;
        font-size: 12px;
        color: #6c757d;
      }
      
      .mark-read-btn {
        background-color: #e9ecef;
        border: none;
        color: #495057;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        margin-top: 5px;
      }
      
      .mark-read-btn:hover {
        background-color: #dee2e6;
      }
      
      .no-notifications {
        padding: 20px;
        text-align: center;
        color: #6c757d;
      }
    `;
    document.head.appendChild(notificationStyles);
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", initNotifications);

// Export functions for external use
window.markAsRead = markAsRead;
window.markAllAsRead = markAllAsRead;
window.toggleNotifications = toggleNotifications;
