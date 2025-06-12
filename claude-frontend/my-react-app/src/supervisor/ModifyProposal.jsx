import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ModifyProposal = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    // Simulate retrieving existing proposal data
    setFormData({
      title: "AI-Based Medical Diagnosis System",
      description:
        "The project aims to develop an AI model that assists doctors in diagnosing diseases based on patient symptoms and test results. Current challenges include data sourcing and model accuracy tuning.",
      file: null,
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Modified proposal submitted:", formData);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-12">
      <div className="max-w-2xl w-full mx-auto p-5 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Modify Proposal
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Edit your submitted proposal before resubmitting.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block font-bold text-gray-700 mb-2"
            >
              Proposal Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block font-bold text-gray-700 mb-2"
            >
              Proposal Description:
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="file"
              className="block font-bold text-gray-700 mb-2"
            >
              Upload Updated Proposal (PDF):
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept=".pdf"
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full p-4 text-base text-white bg-yellow-500 border-0 rounded cursor-pointer hover:bg-yellow-600 transition-colors"
          >
            Submit Modified Proposal
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

export default ModifyProposal;
