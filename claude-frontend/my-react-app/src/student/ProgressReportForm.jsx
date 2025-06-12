// ProgressReportForm.jsx - Copy content from artifact 'progress_report_form'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ProgressReportForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

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
      newErrors.title = "Report title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Report description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description should be at least 50 characters";
    }

    if (!formData.file) {
      newErrors.file = "Please upload a report file (PDF)";
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

      console.log("Progress report submitted:", formData);

      // Show success message and redirect
      alert("Progress report submitted successfully!");
      navigate("/student/project-work");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Failed to submit progress report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Submit Progress Report
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Report Title:
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
                  : "border-gray-300 focus:border-cyan-500 focus:ring-cyan-200"
              }`}
              placeholder="Enter report title..."
              required
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Report Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Report Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="6"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.description
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-cyan-500 focus:ring-cyan-200"
              }`}
              placeholder="Provide a detailed summary of your progress, achievements, challenges, and next steps..."
              required
            />
            <div className="flex justify-between mt-1">
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {formData.description.length}/50 characters minimum
              </p>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Upload Report (PDF): <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-cyan-600 hover:text-cyan-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file"
                      name="file"
                      type="file"
                      accept=".pdf"
                      onChange={handleInputChange}
                      className="sr-only"
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF up to 10MB</p>
                {formData.file && (
                  <p className="text-sm text-cyan-600 mt-2">
                    ✅ Selected: {formData.file.name}
                  </p>
                )}
              </div>
            </div>
            {errors.file && (
              <p className="mt-2 text-sm text-red-600">{errors.file}</p>
            )}
          </div>

          {/* Report Details Section */}
          <div className="bg-cyan-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-cyan-800 mb-4">
              Report Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cyan-700 mb-2">
                  Reporting Period:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <p className="text-xs text-cyan-600 mt-1">
                  From date → To date
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-cyan-700 mb-2">
                  Report Type:
                </label>
                <select className="w-full px-3 py-2 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="">Select report type</option>
                  <option value="weekly">Weekly Report</option>
                  <option value="monthly">Monthly Report</option>
                  <option value="milestone">Milestone Report</option>
                  <option value="final">Final Report</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 text-lg font-semibold text-white rounded-lg transition-all duration-200 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200"
            } focus:outline-none`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Submitting Report...
              </div>
            ) : (
              "Submit Report"
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            to="/student/project-work"
            className="inline-block text-blue-600 hover:text-blue-800 font-bold no-underline transition-colors"
          >
            ← Back to Project Work
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProgressReportForm;