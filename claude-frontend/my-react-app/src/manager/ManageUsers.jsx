import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ManagerAPI from "../API/ManagerAPI";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const managerId = userData.id;

  useEffect(() => {
    if (!managerId) {
      navigate("/login");
      return;
    }
    loadUsers();
  }, [managerId, navigate]);
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      if (!managerId) {
        setError("User not authenticated. Please log in again.");
        return;
      }
      const response = await ManagerAPI.getAllUsers(managerId);
      if (response.success) {
        setUsers(response.users);
      } else {
        setError("Failed to load users");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
        navigate("/login");
      } else {
        setError("Error loading users. Please try again.");
      }
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Manage Users</h1>
                <p className="text-indigo-100 text-sm">
                  User Management & Registration
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
                to="/manager/manage-users"
                className="text-white font-medium no-underline"
              >
                Users
              </Link>
              <Link
                to="/manager/assign-examiners"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Examiners
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
      {/* Main Container */}
      <div className="max-w-6xl mx-auto mt-5 p-5">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              User Management
            </h2>
            <p className="text-gray-600">
              Register new users and manage existing user accounts
            </p>
          </div>

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
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {" "}
            <Link
              to="/manager/register-user"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Register New User
              </span>
            </Link>
            <button
              onClick={loadUsers}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180"
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
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Refresh Users
              </span>
            </button>
          </div>

          {/* Users List */}
          {loading ? (
            <div className="text-center py-8">
              <p>Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      ID
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Email
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Roles
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Status
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="border border-gray-300 px-4 py-2 text-center"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.user_id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {user.user_id}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {user.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {user.email}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {user.roles ? user.roles.join(", ") : "No roles"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              user.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>{" "}
                        <td className="border border-gray-300 px-4 py-2">
                          <Link
                            to={`/manager/manage-user-eligibility/${user.user_id}`}
                            className="text-blue-600 hover:text-blue-800 no-underline"
                          >
                            Edit Eligibility
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-center mt-6">
            <Link
              to="/manager/dashboard"
              className="group inline-flex items-center gap-2 text-blue-600 font-bold no-underline hover:text-blue-800 transition-all duration-300"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Back to Manager Dashboard
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
