import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ManagerAPI from "../API/ManagerAPI";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [managerData, setManagerData] = useState({
    name: "Loading...",
    department: "Loading...",
    projectCount: 0,
  });
  const [notifications, setNotifications] = useState([]);
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-gray-800 text-white flex justify-between items-center px-5 py-4">
        <div className="text-xl font-bold">📊 Manager Dashboard</div>
        <div className="flex-grow text-center">
          <Link
            to="/manager/dashboard"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Home
          </Link>
          <Link
            to="#"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Students
          </Link>
          <Link
            to="#"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Moderation
          </Link>
          <Link
            to="#"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Reports
          </Link>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>{" "}
      {/* Manager Info Header */}
      <div className="bg-gray-600 text-white px-4 py-4 text-base flex justify-around flex-wrap text-center">
        <span>
          <strong>Manager Name:</strong>{" "}
          {loading ? "Loading..." : managerData.name}
        </span>
        <span>
          <strong>Department:</strong>{" "}
          {loading ? "Loading..." : managerData.department}
        </span>
        <span>
          <strong>Supervised Projects:</strong>{" "}
          {loading ? "Loading..." : managerData.projectCount}
        </span>
      </div>{" "}
      <div className="max-w-4xl mx-auto mt-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Manager Dashboard</h2>
        <p className="mb-6">
          Oversee and manage the Final Year Project process.
        </p>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/manager/manage-users"
            className="block w-full p-4 bg-blue-600 text-white text-base rounded text-center no-underline hover:bg-blue-700"
          >
            Manage Users
          </Link>
          <Link
            to="/manager/assign-examiners"
            className="block w-full p-4 bg-blue-600 text-white text-base rounded text-center no-underline hover:bg-blue-700"
          >
            Assign Examiners
          </Link>
          <Link
            to="/manager/approved-projects-logs"
            className="block w-full p-4 bg-blue-600 text-white text-base rounded text-center no-underline hover:bg-blue-700"
          >
            View Approved Projects
          </Link>
          <Link
            to="/manager/previous-projects"
            className="block w-full p-4 bg-blue-600 text-white text-base rounded text-center no-underline hover:bg-blue-700"
          >
            Previous Project Archive
          </Link>
        </div>{" "}
        {/* Notification Center */}
        <div className="bg-yellow-300 p-4 rounded mt-5 text-sm text-black border border-yellow-600 text-left">
          <h3 className="mt-0 mb-3 text-black text-left">
            🔔 Notification Center
          </h3>
          {loading ? (
            <p>Loading notifications...</p>
          ) : (
            notifications.map((notification) => (
              <p key={notification.id} className="mb-2">
                <strong>
                  {notification.type === "reminder" ? "Reminder:" : "Update:"}
                </strong>{" "}
                {notification.message}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
