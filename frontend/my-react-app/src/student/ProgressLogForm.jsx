import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { submitProgressLog, getStudentProjects } from "../API/StudentAPI";

const ProgressLogForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    project_id: "",
    details: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user?.id) {
          setErrors({ general: "User not found. Please log in again." });
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
          });
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setErrors({ general: "Failed to load your projects." });
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

    if (!formData.details.trim()) {
      newErrors.details = "Log details are required";
    } else if (formData.details.length < 20) {
      newErrors.details = "Details should be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling that might trigger extensions

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({}); // Clear any previous errors

    try {
      if (!user?.id) {
        setErrors({ general: "User not found. Please log in again." });
        navigate("/login");
        return;
      }

      console.log("Submitting progress log with data:", {
        project_id: parseInt(formData.project_id),
        details: formData.details,
      });

      const response = await submitProgressLog(user.id, {
        project_id: parseInt(formData.project_id),
        details: formData.details,
      });
      console.log("Progress log response:", response);
      if (response && response.success) {
        // Use a more subtle success notification to avoid extension conflicts        setErrors({ success: "Progress log submitted successfully! Your supervisor has been notified." });

        // Clear form data after successful submission
        setFormData({
          project_id: "",
          details: "",
        });

        // Navigate after a short delay
        setTimeout(() => {
          navigate("/student/project-work");
        }, 2000);
      } else {
        setErrors({
          general: response?.error || "Failed to submit progress log",
        });
      }
    } catch (error) {
      console.error("Error submitting progress log:", error);

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
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Submit Progress Log
        </h2>

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
          {errors.general && (
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
                    : "border-gray-300 focus:border-green-500 focus:ring-green-200"
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

          {/* Log Details */}
          <div>
            <label
              htmlFor="details"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Progress Details:
            </label>
            <textarea
              id="details"
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              rows="8"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.details
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-green-500 focus:ring-green-200"
              }`}
              placeholder="Describe your progress, what you accomplished, challenges faced, and next steps..."
              required
            />
            <div className="flex justify-between mt-1">
              {errors.details && (
                <p className="text-sm text-red-600">{errors.details}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {formData.details.length}/20 characters minimum
              </p>
            </div>
          </div>

          {/* Progress Guidelines */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              📝 Progress Log Guidelines:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Describe what work you completed since your last log</li>
              <li>• Mention any challenges or problems encountered</li>
              <li>• Outline your plans for the next period</li>
              <li>• Include any questions for your supervisor</li>
              <li>• Be specific and detailed in your descriptions</li>
            </ul>
          </div>

          {/* Submit Button */}
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
                Submitting Log...
              </div>
            ) : (
              "Submit Progress Log"
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

export default ProgressLogForm;
