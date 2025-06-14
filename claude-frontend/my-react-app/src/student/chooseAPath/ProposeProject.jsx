import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { submitProposal } from "../../API/StudentAPI";

const ProposeProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Research",
    specialization: "",
    outcome: "",
    submitted_to: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [supervisors, setSupervisors] = useState([]);
  
  // Mock supervisors - in a real app, you'd fetch this from API
  useEffect(() => {
    // You could add a getSupervisors API call here
    setSupervisors([
      { id: 1, name: 'Dr. John Smith', specialization: 'AI/ML' },
      { id: 2, name: 'Dr. Jane Doe', specialization: 'Web Development' },
      { id: 3, name: 'Dr. Mike Johnson', specialization: 'Data Science' },
      { id: 4, name: 'Dr. Sarah Wilson', specialization: 'Mobile Development' },
      { id: 5, name: 'Dr. Ahmad Hassan', specialization: 'Cybersecurity' }
    ]);
  }, []);

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
    } else if (formData.description.length < 50) {
      newErrors.description = "Description should be at least 50 characters";
    }

    if (!formData.submitted_to) {
      newErrors.submitted_to = "Please select a supervisor";
    }

    if (!formData.specialization.trim()) {
      newErrors.specialization = "Specialization is required";
    }

    if (!formData.outcome.trim()) {
      newErrors.outcome = "Expected outcome is required";
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
      const response = await submitProposal(user.id, formData);

      if (response.success) {
        alert(
          "Project proposal submitted successfully! You will be notified once it's reviewed."
        );
        navigate("/student/project-status");
      } else {
        alert("Failed to submit proposal: " + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
      
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
              Project Description * (min. 50 characters)
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
                {formData.description.length}/50 characters
              </p>
            </div>
          </div>

          {/* Project Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Project Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 transition-colors"
            >
              <option value="Research">Research</option>
              <option value="Application">Application</option>
              <option value="Both">Both</option>
            </select>
          </div>

          {/* Specialization */}
          <div>
            <label
              htmlFor="specialization"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Specialization *
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.specialization
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="e.g., AI/ML, Web Development, Mobile Apps"
            />
            {errors.specialization && (
              <p className="mt-2 text-sm text-red-600">{errors.specialization}</p>
            )}
          </div>

          {/* Submit to Supervisor */}
          <div>
            <label
              htmlFor="submitted_to"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Submit to Supervisor *
            </label>
            <select
              id="submitted_to"
              name="submitted_to"
              value={formData.submitted_to}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.submitted_to
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            >
              <option value="">Select Supervisor</option>
              {supervisors.map((supervisor) => (
                <option key={supervisor.id} value={supervisor.id}>
                  {supervisor.name} - {supervisor.specialization}
                </option>
              ))}
            </select>
            {errors.submitted_to && (
              <p className="mt-2 text-sm text-red-600">{errors.submitted_to}</p>
            )}
          </div>

          {/* Expected Outcome */}
          <div>
            <label
              htmlFor="outcome"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Expected Outcome *
            </label>
            <textarea
              id="outcome"
              name="outcome"
              value={formData.outcome}
              onChange={handleInputChange}
              rows="4"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.outcome
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              placeholder="What do you expect to achieve from this project?"
            />
            {errors.outcome && (
              <p className="mt-2 text-sm text-red-600">{errors.outcome}</p>
            )}
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
