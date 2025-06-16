import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ManagerAPI from "../API/ManagerAPI";

const RegisterUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roles: [],
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const managerId = userData.id;

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const response = await ManagerAPI.getRoles(managerId);
      if (response.success) {
        setRoles(response.roles);
      }
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      roles: checked
        ? [...prev.roles, value]
        : prev.roles.filter((role) => role !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (formData.roles.length === 0) {
        setError("Please select at least one role");
        return;
      }

      const response = await ManagerAPI.registerUser(managerId, formData);

      if (response.success) {
        setSuccess("User registered successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          roles: [],
        });
        setTimeout(() => {
          navigate("/manager/manage-users");
        }, 2000);
      } else {
        setError(response.error || "Failed to register user");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setError(
        error.response?.data?.error ||
          "Error registering user. Please try again."
      );
    } finally {
      setLoading(false);
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
      <div className="max-w-2xl mx-auto mt-5 p-5 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Register New User
        </h2>
        <p className="mb-6 text-center">
          Fill in the details to register a new user.
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
            <label htmlFor="password" className="block font-bold mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="6"
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">Select Roles:</label>
            {roles.length > 0 ? (
              roles.map((role) => (
                <div key={role.role_id} className="mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      value={role.role_name}
                      checked={formData.roles.includes(role.role_name)}
                      onChange={handleRoleChange}
                      className="mr-2"
                    />
                    {role.role_name}
                  </label>
                </div>
              ))
            ) : (
              <div className="mb-2">
                {[
                  "Student",
                  "Supervisor",
                  "Moderator",
                  "Manager",
                  "Examiner",
                ].map((role) => (
                  <div key={role} className="mb-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        value={role}
                        checked={formData.roles.includes(role)}
                        onChange={handleRoleChange}
                        className="mr-2"
                      />
                      {role}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-4 text-base text-white border-none rounded cursor-pointer mt-3 ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Registering..." : "Register User"}
          </button>
        </form>

        <div className="text-center mt-5">
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

export default RegisterUser;
