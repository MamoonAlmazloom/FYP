import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const ManagerNotifications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Get manager data from localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const managerId = userData.id;

  useEffect(() => {
    // Check if user is logged in and has manager role
    if (!managerId) {
      console.log("No managerId found, redirecting to login");
      navigate("/login");
      return;
    }

    if (!userData.roles || !userData.roles.includes("Manager")) {
      console.log("User doesn't have Manager role:", userData.roles);
      navigate("/login");
      return;
    }

    fetchNotifications();
  }, [managerId, navigate]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:5000/api/notifications", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications || []);
      } else {
        setErrorMessage(data.error || "Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setErrorMessage("Failed to fetch notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSuccessMessage("Notification deleted successfully!");
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      setErrorMessage("Failed to delete notification. Please try again.");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventTypeColor = (eventName) => {
    const colorMap = {
      proposal_submitted: "bg-blue-100 text-blue-800",
      proposal_approved: "bg-green-100 text-green-800",
      proposal_rejected: "bg-red-100 text-red-800",
      deadline_reminder: "bg-yellow-100 text-yellow-800",
      examiner_assigned: "bg-purple-100 text-purple-800",
      meeting_scheduled: "bg-indigo-100 text-indigo-800",
      report_submitted: "bg-cyan-100 text-cyan-800",
      project_completed: "bg-emerald-100 text-emerald-800",
      general_announcement: "bg-gray-100 text-gray-800",
      urgent_notice: "bg-orange-100 text-orange-800",
    };
    return colorMap[eventName] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m4 0V3a1 1 0 00-1-1H6a1 1 0 00-1 1v3M11 19v-6a1 1 0 011-1h4a1 1 0 011 1v6M9 9h6m-6 4h6"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">View Notifications</h1>
                <p className="text-indigo-100 text-sm">
                  Manage system notifications
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/manager/dashboard"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Dashboard
              </Link>
              <Link
                to="/manager/notifications"
                className="text-white font-medium transition-colors no-underline border-b-2 border-white/50"
              >
                View Notifications
              </Link>
              <Link
                to="/manager/create-notification"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Create Notification
              </Link>
            </div>

            <button
              onClick={handleSignOut}
              className="group flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Manager Info Banner */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center flex-wrap gap-4">
            <span className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <strong>Manager:</strong> {userData.name || "Unknown Manager"}
            </span>
            <span className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <strong>Department:</strong> FYP Committee
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto mt-8 p-6">
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <Link
            to="/manager/dashboard"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors no-underline"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Header with Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m4 0V3a1 1 0 00-1-1H6a1 1 0 00-1 1v3M11 19v-6a1 1 0 011-1h4a1 1 0 011 1v6M9 9h6m-6 4h6"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                System Notifications
              </h2>
              <p className="text-gray-600">
                View and manage all notifications in the system
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchNotifications}
              className="group flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
            <Link
              to="/manager/create-notification"
              className="group flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 no-underline"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New
            </Link>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-green-700 font-medium">
                {successMessage}
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-700 font-medium">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-8 w-8 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="ml-3 text-lg text-gray-600">
                Loading notifications...
              </span>
            </div>
          </div>
        ) : (
          /* Notifications List */
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m4 0V3a1 1 0 00-1-1H6a1 1 0 00-1 1v3M11 19v-6a1 1 0 011-1h4a1 1 0 011 1v6M9 9h6m-6 4h6"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No notifications found
                </h3>
                <p className="text-gray-500 mb-4">
                  There are no notifications to display at the moment.
                </p>
                <Link
                  to="/manager/create-notification"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-300 font-medium no-underline"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create First Notification
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(
                              notification.eventName
                            )}`}
                          >
                            {notification.eventName?.replace(/_/g, " ")}
                          </span>
                          <span className="text-sm text-gray-500">
                            To: {notification.userName || `User #${notification.userId}`}
                          </span>
                        </div>
                        <p className="text-gray-800 mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatDate(notification.timestamp)}
                          </span>
                          <span className={`flex items-center gap-1 ${notification.isRead ? 'text-green-600' : 'text-orange-600'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={notification.isRead ? "M5 13l4 4L19 7" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
                            </svg>
                            {notification.isRead ? 'Read' : 'Unread'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="group ml-4 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                        title="Delete notification"
                      >
                        <svg
                          className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/manager/dashboard"
            className="group flex items-center justify-center gap-3 w-full py-4 px-6 text-center text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="transition-all duration-300 group-hover:tracking-wide">
              Back to Dashboard
            </span>
          </Link>
          <Link
            to="/manager/create-notification"
            className="group flex items-center justify-center gap-3 w-full py-4 px-6 text-center text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <span className="transition-all duration-300 group-hover:tracking-wide">
              Create Notification
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManagerNotifications;
