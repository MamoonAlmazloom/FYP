import React from "react";
import { Link, useNavigate } from "react-router-dom";

const ManageUsers = () => {
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

      <div className="max-w-2xl mx-auto mt-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
        <p className="mb-6">Choose an action:</p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/manager/register-user"
            className="block w-full p-4 bg-blue-600 text-white text-base rounded text-center no-underline hover:bg-blue-700"
          >
            Register New User
          </Link>
          <Link
            to="/manager/manage-user-eligibility"
            className="block w-full p-4 bg-green-600 text-white text-base rounded text-center no-underline hover:bg-green-700"
          >
            Manage User Eligibility
          </Link>
        </div>

        <Link
          to="/manager/dashboard"
          className="inline-block mt-5 text-blue-600 font-bold no-underline hover:text-blue-800"
        >
          ← Back to Manager Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ManageUsers;
