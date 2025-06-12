import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ManageUserEligibility = () => {
  const navigate = useNavigate();

  // Sample user data - in real app this would come from API
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      role: "Student",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "janesmith@example.com",
      role: "Supervisor",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mikejohnson@example.com",
      role: "Moderator",
      status: "Active",
    },
  ]);

  const handleSignOut = () => {
    navigate("/login");
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    // Add API call logic here
  };

  const handleRemoveUser = (userId) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      setUsers(users.filter((user) => user.id !== userId));
      // Add API call logic here
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
      </div>

      <div className="max-w-4xl mx-auto mt-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Manage User Eligibility</h2>
        <p className="mb-6">Modify the status of users in the system.</p>

        {/* User Eligibility Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-5">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  User Name
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Email
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Role
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
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border border-gray-300 p-3 text-left">
                    {user.name}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    {user.email}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    {user.role}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    <span
                      className={
                        user.status === "Active"
                          ? "text-green-600 font-bold"
                          : "text-red-600 font-bold"
                      }
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    <div className="space-x-2">
                      {user.status === "Active" ? (
                        <button
                          onClick={() =>
                            handleStatusChange(user.id, "Inactive")
                          }
                          className="px-3 py-2 bg-yellow-500 text-black border-none rounded cursor-pointer text-sm hover:bg-yellow-600"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(user.id, "Active")}
                          className="px-3 py-2 bg-green-600 text-white border-none rounded cursor-pointer text-sm hover:bg-green-700"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="px-3 py-2 bg-red-600 text-white border-none rounded cursor-pointer text-sm hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Link
          to="/manager/manage-users"
          className="inline-block mt-5 text-blue-600 font-bold no-underline hover:text-blue-800"
        >
          ← Back to Manage Users
        </Link>
      </div>
    </div>
  );
};

export default ManageUserEligibility;
