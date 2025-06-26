import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ManagerAPI from "../API/ManagerAPI";

const CreateNotification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");  // Form state
  const [formData, setFormData] = useState({
    userId: "",
    eventType: "",
    customEventName: "",
    message: "",
  });
  // Users state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Common event types
  const eventTypes = [
    { value: "proposal_submitted", label: "Proposal Submitted" },
    { value: "proposal_approved", label: "Proposal Approved" },
    { value: "proposal_rejected", label: "Proposal Rejected" },
    { value: "deadline_reminder", label: "Deadline Reminder" },
    { value: "examiner_assigned", label: "Examiner Assigned" },
    { value: "meeting_scheduled", label: "Meeting Scheduled" },
    { value: "report_submitted", label: "Report Submitted" },
    { value: "project_completed", label: "Project Completed" },
    { value: "general_announcement", label: "General Announcement" },
    { value: "urgent_notice", label: "Urgent Notice" },
    { value: "custom", label: "Custom Event" },
  ];

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

    // Fetch users from API
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await ManagerAPI.getAllUsers(managerId);
        if (response.success) {
          setUsers(response.users);
        } else {
          setErrorMessage("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setErrorMessage("Failed to fetch users. Please try again.");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [managerId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Validate form
    if (formData.eventType === "custom" && !formData.customEventName.trim()) {
      setErrorMessage("Custom event name is required when selecting 'Custom Event'");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:5000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },        body: JSON.stringify({
          userId: parseInt(formData.userId),
          eventName: formData.eventType === "custom" ? formData.customEventName : formData.eventType,
          message: formData.message,
        }),
      });

      const data = await response.json();      if (response.ok) {
        setSuccessMessage("Notification created successfully!");
        setFormData({ userId: "", eventType: "", customEventName: "", message: "" });
      } else {
        setErrorMessage(data.error || "Failed to create notification");
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      setErrorMessage("Failed to create notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Create Notification</h1>
                <p className="text-indigo-100 text-sm">
                  Send notifications to users
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
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                View Notifications
              </Link>
              <Link
                to="/manager/create-notification"
                className="text-white font-medium transition-colors no-underline border-b-2 border-white/50"
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
      <div className="max-w-4xl mx-auto mt-8 p-6">
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

        {/* Create Notification Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Create New Notification
              </h2>
              <p className="text-gray-600">
                Send a notification to a specific user
              </p>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select User */}
            <div>
              <label
                htmlFor="userId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select User <span className="text-red-500">*</span>
              </label>              <select
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                required
                disabled={loadingUsers}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingUsers ? "Loading users..." : "Choose a user..."}
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role || "Unknown Role"})
                  </option>
                ))}
              </select>
            </div>            {/* Event Type */}
            <div>
              <label
                htmlFor="eventType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select an event type...</option>
                {eventTypes.map((event) => (
                  <option key={event.value} value={event.value}>
                    {event.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Choose a predefined event type or select "Custom Event" to create your own
              </p>
            </div>

            {/* Custom Event Name (shown only when "custom" is selected) */}
            {formData.eventType === "custom" && (
              <div>
                <label
                  htmlFor="customEventName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Custom Event Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="customEventName"
                  name="customEventName"
                  value={formData.customEventName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter a custom event name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter a descriptive name for your custom event
                </p>
              </div>
            )}

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Enter your notification message here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-vertical"
              />
              <p className="mt-1 text-sm text-gray-500">
                Write a clear and concise message for the recipient
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 group flex items-center justify-center gap-2 py-3 px-6 text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
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
                    Creating...
                  </>
                ) : (
                  <>
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
                    Send Notification
                  </>
                )}
              </button>

              <Link
                to="/manager/notifications"
                className="group flex items-center justify-center gap-2 py-3 px-6 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-300 font-semibold border border-indigo-200 hover:border-indigo-300 no-underline"
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
                    d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m4 0V3a1 1 0 00-1-1H6a1 1 0 00-1 1v3M11 19v-6a1 1 0 011-1h4a1 1 0 011 1v6M9 9h6m-6 4h6"
                  />
                </svg>
                View Notifications
              </Link>
            </div>
          </form>
        </div>

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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="transition-all duration-300 group-hover:tracking-wide">
              Back to Dashboard
            </span>
          </Link>
          <Link
            to="/manager/manage-users"
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <span className="transition-all duration-300 group-hover:tracking-wide">
              Manage Users
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateNotification;
