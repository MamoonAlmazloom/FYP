import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ManagerAPI from "../API/ManagerAPI";

const ManageUserEligibility = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const managerId = userData.id;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await ManagerAPI.getAllUsers(managerId);
      if (response.success) {
        setUsers(response.users);
      } else {
        setError("Failed to load users");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Error loading users. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleStatusChange = async (targetUserId, newStatus) => {
    try {
      const response = await ManagerAPI.updateUserEligibility(
        managerId,
        targetUserId,
        newStatus === "Active"
      );

      if (response.success) {
        setUsers(
          users.map((user) =>
            user.user_id === targetUserId
              ? { ...user, is_active: newStatus === "Active" }
              : user
          )
        );
        setSuccess("User eligibility updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.error || "Failed to update user eligibility");
      }
    } catch (error) {
      console.error("Error updating user eligibility:", error);
      setError("Error updating user eligibility. Please try again.");
    }
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0m3 0V5.5a1.5 1.5 0 013 0v6zm-9-3.75h1.5m-1.5 0V9.5a1.5 1.5 0 011.5-1.5M14 10.5V7.25A2.25 2.25 0 0111.75 5H10.5m0 0v1.5m0-1.5V3.75A.75.75 0 0110.5 3h4a.75.75 0 01.75.75v3h1.5"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">User Eligibility</h1>
                <p className="text-indigo-100 text-sm">
                  Manage User Access Status
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
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Manage Users
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

      {/* Main Container */}
      <div className="max-w-7xl mx-auto mt-8 p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0m3 0V5.5a1.5 1.5 0 013 0v6zm-9-3.75h1.5m-1.5 0V9.5a1.5 1.5 0 011.5-1.5M14 10.5V7.25A2.25 2.25 0 0111.75 5H10.5m0 0v1.5m0-1.5V3.75A.75.75 0 0110.5 3h4a.75.75 0 01.75.75v3h1.5"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Manage User Eligibility
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Control user access to the system by activating or deactivating
              user accounts. Manage permissions and system eligibility.
            </p>
          </div>{" "}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3"
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
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-8">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{success}</span>
              </div>
            </div>
          )}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-50 rounded-lg">
                <svg
                  className="animate-spin w-5 h-5 text-indigo-600"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-indigo-600 font-medium">
                  Loading users...
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        User ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        User Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Roles
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-3 text-gray-500">
                            <svg
                              className="w-12 h-12"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 01-3 0m3 0V5.5a1.5 1.5 0 013 0v6zm-9-3.75h1.5m-1.5 0V9.5a1.5 1.5 0 011.5-1.5M14 10.5V7.25A2.25 2.25 0 0111.75 5H10.5m0 0v1.5m0-1.5V3.75A.75.75 0 0110.5 3h4a.75.75 0 01.75.75v3h1.5"
                              />
                            </svg>
                            <span className="text-lg font-medium">
                              No users found
                            </span>
                            <span className="text-sm">
                              Users will appear here once they are registered
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map((user, index) => (
                        <tr
                          key={user.user_id}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-indigo-50 transition-colors duration-200`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            #{user.user_id}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex flex-wrap gap-1">
                              {user.roles ? (
                                user.roles.map((role, roleIndex) => (
                                  <span
                                    key={roleIndex}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {role}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400 italic">
                                  No roles assigned
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {user.is_active ? (
                              <button
                                onClick={() =>
                                  handleStatusChange(user.user_id, "Inactive")
                                }
                                className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
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
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                                  />
                                </svg>
                                <span className="transition-all duration-300 group-hover:tracking-wide">
                                  Deactivate
                                </span>
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleStatusChange(user.user_id, "Active")
                                }
                                className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
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
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="transition-all duration-300 group-hover:tracking-wide">
                                  Activate
                                </span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="text-center mt-8">
            <Link
              to="/manager/manage-users"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl no-underline"
            >
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
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
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Back to Manage Users
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUserEligibility;
