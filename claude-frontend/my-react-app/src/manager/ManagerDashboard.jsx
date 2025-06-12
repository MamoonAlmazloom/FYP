import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Handle sign out logic here
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
      </div>

      {/* Manager Info Header */}
      <div className="bg-gray-600 text-white px-4 py-4 text-base flex justify-around flex-wrap text-center">
        <span>
          <strong>Manager Name:</strong> Dr. Emily Carter
        </span>
        <span>
          <strong>Department:</strong> FYP Committee
        </span>
        <span>
          <strong>Supervised Projects:</strong> 120
        </span>
      </div>

      <div className="max-w-4xl mx-auto mt-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Manager Dashboard</h2>
        <p className="mb-6">
          Oversee and manage the Final Year Project process.
        </p>

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
        </div>

        {/* Notification Center */}
        <div className="bg-yellow-300 p-4 rounded mt-5 text-sm text-black border border-yellow-600 text-left">
          <h3 className="mt-0 mb-3 text-black text-left">
            🔔 Notification Center
          </h3>
          <p className="mb-2">
            <strong>Reminder:</strong> Approve final year project examiners.
          </p>
          <p className="mb-0">
            <strong>Update:</strong> New student registrations need approval.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
