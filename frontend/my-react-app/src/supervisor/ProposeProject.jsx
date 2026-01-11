import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../API/authAPI";
import { proposeProject } from "../API/SupervisorAPI";

const ProposeProject = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    specialization: "",
    outcome: "",
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError("");
      const response = await proposeProject(user.id, formData);

      if (response.success) {
        setSuccess(true);
        setFormData({
          title: "",
          description: "",
          type: "",
          specialization: "",
          outcome: "",
        });
        // Redirect after a short delay to show success message
        setTimeout(() => {
          navigate("/supervisor/proposed-titles");
        }, 2000);
      } else {
        setError(response.error || "Failed to submit proposal");
      }
    } catch (err) {
      console.error("Error submitting proposal:", err);
      setError("Failed to submit proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-12">
      <div className="max-w-2xl w-full mx-auto p-5 border border-gray-300 rounded-lg shadow-lg bg-white">
        {" "}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Propose a New Project
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Fill in the details of your proposed project below:
        </p>
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            Project proposal submitted successfully! Redirecting to your
            proposals...
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block font-bold text-gray-700 mb-2"
            >
              Project Title: *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block font-bold text-gray-700 mb-2"
            >
              Project Description: *
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Describe the project in detail..."
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>{" "}
          <div className="mb-4">
            <label
              htmlFor="type"
              className="block font-bold text-gray-700 mb-2"
            >
              Project Type: *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select project type</option>
              <option value="Research">Research</option>
              <option value="Application">Application</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="specialization"
              className="block font-bold text-gray-700 mb-2"
            >
              Specialization Area: *
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="e.g., Machine Learning, Web Development, Mobile Apps..."
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="outcome"
              className="block font-bold text-gray-700 mb-2"
            >
              Expected Outcome: *
            </label>
            <textarea
              id="outcome"
              name="outcome"
              rows="3"
              value={formData.outcome}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Describe the expected deliverables and outcomes..."
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-4 text-lg text-white border-0 rounded cursor-pointer transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Proposal"}
          </button>
        </form>
        <Link
          to="/supervisor/dashboard"
          className="inline-block mt-5 no-underline text-blue-600 font-bold hover:text-blue-800"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ProposeProject;
