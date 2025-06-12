import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ProposeProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    supervisor: "",
    objectives: "",
    methodology: "",
    expectedOutcome: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supervisors = [
    "Dr. Sarah Johnson",
    "Prof. Michael Chen",
    "Dr. Emily Rodriguez",
    "Prof. Ahmed Hassan",
    "Dr. Lisa Wang",
    "Prof. David Thompson",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Project description is required";
    } else if (formData.description.length < 100) {
      newErrors.description = "Description should be at least 100 characters";
    }

    if (!formData.supervisor) {
      newErrors.supervisor = "Please select a preferred supervisor";
    }

    if (!formData.objectives.trim()) {
      newErrors.objectives = "Project objectives are required";
    }

    if (!formData.methodology.trim()) {
      newErrors.methodology = "Methodology is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Project proposal submitted:", formData);

      // Show success message and redirect
      alert(
        "Project proposal submitted successfully! You will be notified once it's reviewed."
      );
      navigate("/student/project-status");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Failed to submit proposal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Propose a New Project
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Fill in the details of your proposed project below:
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.title
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="Enter your project title"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Project Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Project Description * (min. 100 characters)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.description
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="Provide a detailed description of your project..."
            />
            <div className="flex justify-between mt-1">
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {formData.description.length}/100 characters
              </p>
            </div>
          </div>

          {/* Preferred Supervisor */}
          <div>
            <label
              htmlFor="supervisor"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Preferred Supervisor *
            </label>
            <select
              id="supervisor"
              name="supervisor"
              value={formData.supervisor}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.supervisor
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            >
              <option value="">Select Supervisor</option>
              {supervisors.map((supervisor, index) => (
                <option key={index} value={supervisor}>
                  {supervisor}
                </option>
              ))}
            </select>
            {errors.supervisor && (
              <p className="mt-2 text-sm text-red-600">{errors.supervisor}</p>
            )}
          </div>

          {/* Project Objectives */}
          <div>
            <label
              htmlFor="objectives"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Project Objectives *
            </label>
            <textarea
              id="objectives"
              name="objectives"
              value={formData.objectives}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.objectives
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="List the main objectives of your project..."
            />
            {errors.objectives && (
              <p className="mt-2 text-sm text-red-600">{errors.objectives}</p>
            )}
          </div>

          {/* Methodology */}
          <div>
            <label
              htmlFor="methodology"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Methodology *
            </label>
            <textarea
              id="methodology"
              name="methodology"
              value={formData.methodology}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.methodology
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="Describe the methodology you plan to use..."
            />
            {errors.methodology && (
              <p className="mt-2 text-sm text-red-600">{errors.methodology}</p>
            )}
          </div>

          {/* Expected Outcome */}
          <div>
            <label
              htmlFor="expectedOutcome"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Expected Outcome
            </label>
            <textarea
              id="expectedOutcome"
              name="expectedOutcome"
              value={formData.expectedOutcome}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 transition-colors"
              placeholder="What do you expect to achieve from this project? (Optional)"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 text-lg font-semibold text-white rounded-lg transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-200"
              } focus:outline-none`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Submitting Proposal...
                </div>
              ) : (
                "Submit Proposal"
              )}
            </button>
          </div>
        </form>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            to="/student/choose-path"
            className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
          >
            ← Back to Select a Path
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProposeProject;
