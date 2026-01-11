import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { submitProgressReport, getStudentProjects } from "../API/StudentAPI";

const ProgressReportForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    project_id: "",
    title: "",
    details: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user?.id) {
          setErrors({
            general: "User not found. Please log in again.",
            loading: true,
          });
          return;
        }

        const response = await getStudentProjects(user.id);

        if (response.success && response.projects.length > 0) {
          setProjects(response.projects);
          // Auto-select first project if only one exists
          if (response.projects.length === 1) {
            setFormData((prev) => ({
              ...prev,
              project_id: response.projects[0].project_id,
            }));
          }
        } else {
          setErrors({
            general:
              "No active projects found. Please select or propose a project first.",
            loading: true,
          });
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setErrors({ general: "Failed to load your projects.", loading: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

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

    if (!formData.project_id) {
      newErrors.project_id = "Please select a project";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Report title is required";
    }

    if (!formData.details.trim()) {
      newErrors.details = "Report details are required";
    } else if (formData.details.length < 50) {
      newErrors.details = "Details should be at least 50 characters";
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
      if (!user?.id) {
        alert("User not found. Please log in again.");
        navigate("/login");
        return;
      }

      // Use the actual StudentAPI function
      const response = await submitProgressReport(user.id, {
        project_id: parseInt(formData.project_id),
        title: formData.title,
        details: formData.details,
      });
      console.log("Progress report response:", response);

      if (response && response.success) {
        setErrors({ success: "Progress report submitted successfully!" });

        // Navigate after a short delay
        setTimeout(() => {
          navigate("/student/project-work");
        }, 2000);
      } else {
        setErrors({
          general: response?.error || "Failed to submit progress report",
        });
      }
    } catch (error) {
      console.error("Error submitting progress report:", error);

      let errorMessage = "An unexpected error occurred";

      if (error.response) {
        errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          "Server error occurred";
      } else if (error.request) {
        errorMessage =
          "Network error: Please check your connection and try again";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (errors.general && errors.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{errors.general}</p>
          <div className="space-y-3">
            <Link
              to="/student/choose-path"
              className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
            >
              Choose Project Path
            </Link>
            <Link
              to="/student/project-work"
              className="block w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Submit Progress Report
        </h2>{" "}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {errors.success && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-1 bg-green-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-600"
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
                </div>
                <span className="text-green-800 font-medium">
                  {errors.success}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.general && !errors.success && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-1 bg-red-100 rounded-lg">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-red-800 font-medium">
                  {errors.general}
                </span>
              </div>
            </div>
          )}

          {/* Project Selection */}
          {projects.length > 1 && (
            <div>
              <label
                htmlFor="project_id"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Select Project:
              </label>
              <select
                id="project_id"
                name="project_id"
                value={formData.project_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.project_id
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-cyan-500 focus:ring-cyan-200"
                }`}
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.project_id} value={project.project_id}>
                    {project.title}
                  </option>
                ))}
              </select>
              {errors.project_id && (
                <p className="mt-2 text-sm text-red-600">{errors.project_id}</p>
              )}
            </div>
          )}

          {/* Current Project Display (if only one project) */}
          {projects.length === 1 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Current Project:
              </h3>
              <p className="text-gray-600">{projects[0].title}</p>
            </div>
          )}

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
              placeholder="e.g., Monthly Progress Report - March 2025"
              required
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Report Details */}
          <div>
            <label
              htmlFor="details"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Report Details:
            </label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              rows="10"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.details
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-cyan-500 focus:ring-cyan-200"
              }`}
              placeholder="Provide a comprehensive summary of your progress, achievements, challenges, and future plans..."
              required
            />
            <div className="flex justify-between mt-1">
              {errors.details && (
                <p className="text-sm text-red-600">{errors.details}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {formData.details.length}/50 characters minimum
              </p>
            </div>
          </div>

          {/* Report Guidelines */}
          <div className="bg-cyan-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-cyan-800 mb-4">
              📊 Progress Report Guidelines
            </h3>
            <div className="space-y-3 text-sm text-cyan-700">
              <div>
                <h4 className="font-semibold">Include in your report:</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Summary of work completed during the reporting period</li>
                  <li>Key achievements and milestones reached</li>
                  <li>Challenges encountered and how they were addressed</li>
                  <li>Analysis of current progress against project timeline</li>
                  <li>Detailed plans for the next reporting period</li>
                  <li>Any changes to project scope or methodology</li>
                  <li>Resource requirements and budget considerations</li>
                </ul>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold">Report Types:</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>
                    <strong>Weekly:</strong> Brief summary of weekly activities
                  </li>
                  <li>
                    <strong>Monthly:</strong> Comprehensive monthly progress
                    review
                  </li>
                  <li>
                    <strong>Milestone:</strong> Detailed report on specific
                    milestone completion
                  </li>
                  <li>
                    <strong>Final:</strong> Complete project summary and
                    outcomes
                  </li>
                </ul>
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
                : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
            } focus:outline-none`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                Submitting Report...
              </div>
            ) : (
              "Submit Progress Report"
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
