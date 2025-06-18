import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getProposalStatus, updateProposal } from "../API/StudentAPI";

const ModifyProposal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get("id");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "Research",
    specialization: "",
    outcome: "",
  });
  const [originalProposal, setOriginalProposal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        if (!user?.id) {
          setErrors({ general: "User not found. Please log in again." });
          return;
        }

        if (!proposalId) {
          setErrors({ general: "Proposal ID not provided." });
          return;
        }

        setLoading(true);
        const response = await getProposalStatus(user.id, proposalId);
        if (response.success) {
          const proposal = response.proposal;
          setOriginalProposal(proposal);

          // Check if proposal is approved
          const approvedStatuses = ["Approved", "Supervisor_Approved"];
          const proposalIsApproved = approvedStatuses.includes(
            proposal.status_name
          );
          setIsApproved(proposalIsApproved);

          // Populate form with existing data
          setFormData({
            title: proposal.title || "",
            description: proposal.proposal_description || "",
            type: proposal.type || "Research",
            specialization: proposal.specialization || "",
            outcome: proposal.outcome || "",
          });
        } else {
          setErrors({ general: response.error || "Failed to load proposal" });
        }
      } catch (err) {
        console.error("Error fetching proposal:", err);
        setErrors({ general: "Failed to load proposal" });
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [user, proposalId]);

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
      newErrors.title = "Proposal title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Proposal description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description should be at least 50 characters";
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

    // If proposal is approved, show warning first
    if (isApproved && !showWarning) {
      setShowWarning(true);
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
      const response = await updateProposal(user.id, proposalId, formData);

      if (response.success) {
        if (response.isNewProposal) {
          // New proposal created for approved proposal
          alert(
            "A new proposal has been submitted! Your previous approved proposal remains unchanged. You will need to wait for supervisor and moderator approval again."
          );
          navigate("/student/choose-path");
        } else {
          // Regular update for non-approved proposal
          alert(
            "Modified proposal submitted successfully! You will be notified once it's reviewed."
          );
          navigate("/student/project-status");
        }
      } else {
        alert(
          "Failed to submit modified proposal: " +
            (response.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error submitting modified proposal:", error);

      if (error.response) {
        const errorMessage =
          error.response.data.error || "Server error occurred";
        alert("Error: " + errorMessage);
      } else if (error.request) {
        alert("Network error: Please check your connection");
      } else {
        alert("Unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading proposal data...</p>
        </div>
      </div>
    );
  }

  if (errors.general) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{errors.general}</p>{" "}
          <div className="space-y-3">
            <Link
              to="/student/project-status"
              className="group block w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 no-underline font-semibold text-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <span className="transition-all duration-300 group-hover:tracking-wide">
                View All Proposals
              </span>
            </Link>
            <Link
              to="/student/project-work"
              className="group block w-full py-3 px-6 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-300 no-underline font-semibold text-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Back to Project Work
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Modify Proposal
        </h2>
        <p className="text-gray-600 text-center mb-2">
          Edit your submitted proposal before resubmitting.
        </p>{" "}
        {/* Original Proposal Info */}
        {originalProposal && (
          <div className="bg-blue-50 p-4 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Original Proposal
            </h3>{" "}
            <div className="text-sm text-blue-700">
              <p>
                <strong>Status:</strong> {originalProposal.status_name}
              </p>
              <p>
                <strong>To:</strong> {originalProposal.reviewer_name || "N/A"}
              </p>
            </div>
          </div>
        )}
        {/* Warning Dialog for Approved Proposals */}
        {showWarning && isApproved && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="text-center">
                <div className="mb-4">
                  <span className="text-6xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Important Notice
                </h3>
                <p className="text-gray-600 mb-6">
                  Your proposal is currently <strong>approved</strong>.
                  Modifying it will create a<strong> new proposal</strong> that
                  will need to go through the approval process again (supervisor
                  and moderator approval). Your current approved proposal will
                  remain unchanged.
                </p>
                <p className="text-gray-600 mb-6 font-semibold">
                  Do you want to proceed with creating a new proposal?
                </p>{" "}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowWarning(false)}
                    className="group flex-1 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                  >
                    <span className="transition-all duration-300 group-hover:tracking-wide">
                      Cancel
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowWarning(false);
                      handleSubmit({ preventDefault: () => {} });
                    }}
                    className="group flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                  >
                    <span className="transition-all duration-300 group-hover:tracking-wide">
                      Proceed
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Warning Banner for Approved Proposals */}
        {isApproved && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Notice:</strong> This proposal is currently approved.
                  Modifying it will create a new proposal that requires
                  re-approval from your supervisor and moderator.
                </p>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Proposal Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Proposal Title *
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
                  : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-200"
              }`}
              placeholder="Enter your proposal title"
              required
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
          </div>
          {/* Proposal Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Proposal Description * (min. 50 characters)
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
                  : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-200"
              }`}
              placeholder="Provide a detailed description of your project..."
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
          {/* Project Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Project Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-yellow-500 focus:ring-yellow-200 transition-colors"
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
              className="block text-sm font-bold text-gray-700 mb-2"
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
                  : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-200"
              }`}
              placeholder="e.g., AI/ML, Web Development, Mobile Apps"
              required
            />
            {errors.specialization && (
              <p className="mt-2 text-sm text-red-600">
                {errors.specialization}
              </p>
            )}
          </div>
          {/* Expected Outcome */}
          <div>
            <label
              htmlFor="outcome"
              className="block text-sm font-bold text-gray-700 mb-2"
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
                  : "border-gray-300 focus:border-yellow-500 focus:ring-yellow-200"
              }`}
              placeholder="What do you expect to achieve from this project?"
              required
            />
            {errors.outcome && (
              <p className="mt-2 text-sm text-red-600">{errors.outcome}</p>
            )}
          </div>
          {/* Modification Guidelines */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-yellow-800 mb-3">
              ✏️ Modification Guidelines
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Address any feedback provided by your supervisor</li>
              <li>
                • Be specific about changes made since the original submission
              </li>
              <li>• Ensure all technical details are accurate and feasible</li>
              <li>• Consider the scope and timeline of your project</li>
              <li>
                • Make sure your modifications align with your specialization
              </li>
            </ul>
          </div>
          {/* Submit Button */}{" "}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`group w-full py-4 px-6 text-lg font-semibold text-white rounded-lg transition-all duration-300 focus:outline-none shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-200"
            }`}
          >
            {" "}
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                {isApproved
                  ? "Creating New Proposal..."
                  : "Submitting Modified Proposal..."}
              </div>
            ) : isApproved ? (
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Create New Proposal
              </span>
            ) : (
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Submit Modified Proposal
              </span>
            )}
          </button>
        </form>
        {/* Back Link */}{" "}
        <div className="text-center mt-6">
          <Link
            to="/student/project-work"
            className="group inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold no-underline transition-all duration-300"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="transition-all duration-300 group-hover:tracking-wide">
              Back to Project Work
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModifyProposal;
