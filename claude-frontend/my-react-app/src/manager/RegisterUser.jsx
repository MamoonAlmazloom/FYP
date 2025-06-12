import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const handleSignOut = () => {
    // Handle sign out logic here
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Registering user:", formData);
    // Add API call logic here
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
        <h2 className="text-2xl font-bold mb-4">Register New User</h2>
        <p className="mb-6">Fill in the details to register a new user.</p>

        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-4">
            <label htmlFor="name" className="block font-bold mb-2">
              Full Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-2">
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="block font-bold mb-2">
              Select Role:
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded"
            >
              <option value="">Select Role</option>
              <option value="Student">Student</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Moderator">Moderator</option>
              <option value="Manager">Manager</option>
              <option value="Examiner">Examiner</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full p-4 text-base text-white bg-blue-600 border-none rounded cursor-pointer mt-3 hover:bg-blue-700"
          >
            Register User
          </button>
        </form>

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

export default RegisterUser;
