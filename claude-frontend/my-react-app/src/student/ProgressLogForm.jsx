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
          setErrors({ general: 'User not found. Please log in again.' });
          return;
        }

        const response = await getStudentProjects(user.id);
        
        if (response.success && response.projects.length > 0) {
          setProjects(response.projects);
          // Auto-select first project if only one exists
          if (response.projects.length === 1) {
            setFormData(prev => ({
              ...prev,
              project_id: response.projects[0].project_id
            }));
          }
        } else {
          setErrors({ general: 'No active projects found. Please select or propose a project first.' });
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setErrors({ general: 'Failed to load your projects.' });
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user?.id) {
        alert('User not found. Please log in again.');
        navigate('/login');
        return;
      }

      // Use the actual StudentAPI function
      const response = await submitProgressLog(user.id, {
        project_id: parseInt(formData.project_id),
        details: formData.details
      });

      if (response.success) {
        alert("Progress log submitted successfully!");
        navigate("/student/project-work");
      } else {
        alert("Failed to submit progress log: " + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting progress log:', error);
      
      if (error.response) {
        const errorMessage = error.response.data.error || 'Server error occurred';
        alert('Error: ' + errorMessage);
      } else if (error.request) {
        alert('Network error: Please check your connection');
      } else {
        alert('Unexpected error occurred');
      }
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

  if (errors.general) {
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
          Submit Progress Log
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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
