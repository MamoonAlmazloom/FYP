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
      <div className="max-w-4xl mx-auto mt-5 p-5 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Manage User Eligibility
        </h2>
        <p className="mb-6 text-center">
          Modify the status of users in the system.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mt-5">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    User ID
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    User Name
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Email
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Roles
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Status
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="border border-gray-300 p-3 text-center"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.user_id}>
                      <td className="border border-gray-300 p-3 text-left">
                        {user.user_id}
                      </td>
                      <td className="border border-gray-300 p-3 text-left">
                        {user.name}
                      </td>
                      <td className="border border-gray-300 p-3 text-left">
                        {user.email}
                      </td>
                      <td className="border border-gray-300 p-3 text-left">
                        {user.roles ? user.roles.join(", ") : "No roles"}
                      </td>
                      <td className="border border-gray-300 p-3 text-left">
                        <span
                          className={
                            user.is_active
                              ? "text-green-600 font-bold"
                              : "text-red-600 font-bold"
                          }
                        >
                          {" "}
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-3 text-left">
                        <div className="space-x-2">
                          {user.is_active ? (
                            <button
                              onClick={() =>
                                handleStatusChange(user.user_id, "Inactive")
                              }
                              className="px-3 py-2 bg-yellow-500 text-black border-none rounded cursor-pointer text-sm hover:bg-yellow-600"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleStatusChange(user.user_id, "Active")
                              }
                              className="px-3 py-2 bg-green-600 text-white border-none rounded cursor-pointer text-sm hover:bg-green-700"
                            >
                              Activate
                            </button>
                          )}
                        </div>
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
            to="/manager/manage-users"
            className="inline-block text-blue-600 font-bold no-underline hover:text-blue-800"
          >
            ← Back to Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManageUserEligibility;
