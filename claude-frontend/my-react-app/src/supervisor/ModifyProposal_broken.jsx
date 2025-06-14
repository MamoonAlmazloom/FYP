import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../API/authAPI";
import { getSupervisorProposal, updateSupervisorProposal } from "../API/SupervisorAPI";

const ModifyProposal = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    objectives: "",
    requirements: "",
    duration: "",
  });

  useEffect(() => {
    const loadProposal = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          navigate('/login');
          return;
        }
        setUser(currentUser);

        if (!proposalId) {
          navigate('/supervisor/proposed-titles');
          return;
        }

        const response = await getSupervisorProposal(currentUser.id, proposalId);
        if (response.success) {
          const proposal = response.proposal;
          setFormData({
            title: proposal.title || "",
            description: proposal.description || "",
            objectives: proposal.objectives || "",
            requirements: proposal.requirements || "",
            duration: proposal.duration || "",
          });
        } else {
          setError(response.error || "Failed to load proposal details");
        }
      } catch (err) {
        console.error("Error loading proposal:", err);
        setError("Failed to load proposal. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProposal();
  }, [navigate, proposalId]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError("");
      
      const response = await updateSupervisorProposal(user.id, proposalId, formData);
      if (response.success) {
        setSuccess(true);
        // Redirect after a short delay to show success message
        setTimeout(() => {
          navigate('/supervisor/proposed-titles');
        }, 2000);
      } else {
        setError(response.error || "Failed to update proposal");
      }
    } catch (err) {
      console.error("Error updating proposal:", err);
      setError("Failed to update proposal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading proposal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-12">
      <div className="max-w-2xl w-full mx-auto p-5 bg-white rounded-lg shadow-lg">        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Modify Proposal
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Edit your submitted proposal before resubmitting.
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
            Proposal updated successfully! Redirecting to your proposals...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block font-bold text-gray-700 mb-2">
              Proposal Title: *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={submitting}
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block font-bold text-gray-700 mb-2">
              Project Description: *
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              required
              disabled={submitting}
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="objectives" className="block font-bold text-gray-700 mb-2">
              Project Objectives:
            </label>
            <textarea
              id="objectives"
              name="objectives"
              rows="3"
              value={formData.objectives}
              onChange={handleInputChange}
              disabled={submitting}
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="requirements" className="block font-bold text-gray-700 mb-2">
              Prerequisites/Requirements:
            </label>
            <textarea
              id="requirements"
              name="requirements"
              rows="3"
              value={formData.requirements}
              onChange={handleInputChange}
              disabled={submitting}
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="duration" className="block font-bold text-gray-700 mb-2">
              Expected Duration:
            </label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              disabled={submitting}
              className="w-full p-3 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select duration</option>
              <option value="1 semester">1 Semester</option>
              <option value="2 semesters">2 Semesters</option>
              <option value="1 year">1 Year</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full p-4 text-lg text-white border-0 rounded cursor-pointer transition-colors ${
              submitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? 'Updating...' : 'Update Proposal'}
          </button>
        </form>
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
