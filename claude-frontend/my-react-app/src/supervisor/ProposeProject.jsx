import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProposeProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Proposal submitted:", formData);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-12">
      <div className="max-w-2xl w-full mx-auto p-5 border border-gray-300 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Propose a New Project
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Fill in the details of your proposed project below:
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block font-bold text-gray-700 mb-2"
            >
              Project Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block font-bold text-gray-700 mb-2"
            >
              Project Description:
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full p-4 text-lg text-white bg-green-600 border-0 rounded cursor-pointer hover:bg-green-700 transition-colors"
          >
            Submit Proposal
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
