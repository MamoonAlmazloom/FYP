import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ManagerAPI from "../API/ManagerAPI";
import NotificationCenter from "../components/NotificationCenter";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [managerData, setManagerData] = useState({
    name: "Loading...",
    department: "Loading...",
    projectCount: 0,
  });
  const [notifications, setNotifications] = useState([]); // Keep for backward compatibility but won't be used
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Get manager ID from the stored user data
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const managerId = userData.id;
  useEffect(() => {
    console.log("ManagerDashboard useEffect - userData:", userData);
    console.log("ManagerDashboard useEffect - managerId:", managerId);

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

    console.log("Authentication checks passed, loading dashboard data");
    loadDashboardData();
  }, [managerId, navigate]);
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      if (!managerId) {
        setError("User not authenticated. Please log in again.");
        return;
      }
      // Load manager profile data
      setManagerData({
        name: userData.name || "Unknown Manager",
        department: "FYP Committee",
        projectCount: 120, // This could come from an API call
      });

      // You can add more API calls here for notifications, stats, etc.
      setNotifications([
        {
          id: 1,
          type: "reminder",
          message: "Approve final year project examiners.",
        },
        {
          id: 2,
          type: "update",
          message: "New student registrations need approval.",
        },
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
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
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Manager Dashboard</h1>
                <p className="text-indigo-100 text-sm">
                  Final Year Project Management
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/manager/dashboard"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Home
              </Link>
              <Link
                to="/manager/manage-users"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Users
              </Link>
              <Link
                to="/manager/assign-examiners"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Examiners
              </Link>
              <Link
                to="/manager/previous-projects"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Archive
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
      </div>{" "}
      {/* Manager Info Banner */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center flex-wrap gap-4">
            <span className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <strong>Manager:</strong>{" "}
              {loading ? "Loading..." : managerData.name}
            </span>
            <span className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <strong>Department:</strong>{" "}
              {loading ? "Loading..." : managerData.department}
            </span>
            <span className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <strong>Supervised Projects:</strong>{" "}
              {loading ? "Loading..." : managerData.projectCount}
            </span>
          </div>
        </div>
      </div>{" "}
      {/* Main Container */}
      <div className="max-w-4xl mx-auto mt-5 p-5">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full">
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
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Manager Dashboard
          </h2>
          <p className="text-gray-600 mb-6">
            Oversee and manage the Final Year Project process with comprehensive
            tools and insights.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Enhanced Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/manager/manage-users"
              className="group flex items-center justify-center gap-3 w-full py-4 px-6 text-center text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
            <Link
              to="/manager/assign-examiners"
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
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Assign Examiners
              </span>
            </Link>
            <Link
              to="/manager/approved-projects-logs"
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
                View Approved Projects
              </span>
            </Link>
            <Link
              to="/manager/previous-projects"
              className="group flex items-center justify-center gap-3 w-full py-4 px-6 text-center text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
                  d="M5 8h14M5 8a2 2 0 110-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H15a2 2 0 012 2v0M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m0 0V6a2 2 0 00-2-2H9.5a2 2 0 00-1.414.586L6.5 6.172A2 2 0 005.086 6.758L5 8z"
                />
              </svg>
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Previous Project Archive
              </span>
            </Link>
          </div>
        </div>

        {/* Notification Center */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <NotificationCenter userId={managerId} className="mt-0" />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
