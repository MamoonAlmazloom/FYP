import React, { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { getCurrentUser } from "../API/authAPI";
import {
  getProposalDetails,
  reviewStudentProposal,
} from "../API/SupervisorAPI";

const ProposalAction = () => {
  const { proposalId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState("");

  useEffect(() => {
    const loadProposal = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }
        setUser(currentUser);

        if (proposalId) {
          const response = await getProposalDetails(currentUser.id, proposalId);
          if (response.success) {
            setProposal(response.proposal);
          } else {
            setError(response.error || "Failed to load proposal details");
          }
        } else {
          // Fallback to URL params for backward compatibility
          const studentName = searchParams.get("student") || "Unknown Student";
          const projectTitle = searchParams.get("title") || "Unknown Title";
          setProposal({
            student_name: studentName,
            title: projectTitle,
            proposal_description: "Loading proposal details...",
            status_name: "Pending",
          });
        }
      } catch (err) {
        console.error("Error loading proposal:", err);
        setError("Failed to load proposal details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProposal();
  }, [proposalId, searchParams, navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDecision = async (decision) => {
    if (!proposalId || !user) return;

    try {
      setSubmitting(true);
      const response = await reviewStudentProposal(
        user.id,
        proposalId,
        decision,
        comments
      );

      if (response.success) {
        alert(`Proposal ${decision}ed successfully!`);
        navigate("/supervisor/proposed-titles");
      } else {
        alert(response.error || `Failed to ${decision} proposal`);
      }
    } catch (err) {
      console.error(`Error ${decision}ing proposal:`, err);
      alert(`Failed to ${decision} proposal. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-blue-700 text-white flex justify-between items-center px-5 py-4">
        <div className="text-xl font-bold">📘 Supervisor Dashboard</div>
        <div className="flex-grow text-center">
          <Link
            to="/supervisor/dashboard"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Home
          </Link>
          <Link
            to="/supervisor/my-students"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Students
          </Link>
          <Link
            to="/supervisor/approved-projects-logs"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Logs
          </Link>
          <Link
            to="/supervisor/progress-reports"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Reports
          </Link>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 border-0 rounded text-sm cursor-pointer hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>{" "}
      <div className="max-w-2xl mx-auto my-10 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Submit Proposal Decision
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading proposal details...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : proposal ? (
          <>
            <div className="bg-gray-50 p-4 rounded mb-4 text-left">
              <p className="mb-2">
                <strong>Student Name:</strong>{" "}
                {proposal.student_name ||
                  proposal.submitted_by_name ||
                  "Unknown Student"}
              </p>
              <p className="mb-2">
                <strong>Project Title:</strong>{" "}
                {proposal.title || "Unknown Title"}
              </p>
              <p className="mb-2">
                <strong>Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                    proposal.status_name === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : proposal.status_name === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {proposal.status_name}
                </span>
              </p>
              {proposal.proposal_description && (
                <div className="mt-3">
                  <strong>Description:</strong>
                  <p className="mt-1 text-gray-700">
                    {proposal.proposal_description}
                  </p>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="text-left mb-4">
              <label
                htmlFor="comments"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Comments (Optional)
              </label>
              <textarea
                id="comments"
                rows="3"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your feedback here..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={submitting}
              />
            </div>

            {/* Decision Buttons */}
            {proposal.status_name === "Pending" ? (
              <div className="flex justify-between mt-5 gap-3">
                <button
                  onClick={() => handleDecision("approve")}
                  disabled={submitting}
                  className="flex-1 p-3 text-base text-white bg-green-600 border-0 rounded cursor-pointer hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleDecision("modify")}
                  disabled={submitting}
                  className="flex-1 p-3 text-base text-black bg-yellow-400 border-0 rounded cursor-pointer hover:bg-yellow-500 disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Request Modification"}
                </button>
                <button
                  onClick={() => handleDecision("reject")}
                  disabled={submitting}
                  className="flex-1 p-3 text-base text-white bg-red-600 border-0 rounded cursor-pointer hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? "Processing..." : "Reject"}
                </button>
              </div>
            ) : (
              <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded">
                This proposal has already been reviewed:{" "}
                <strong>{proposal.status_name}</strong>
              </div>
            )}
          </>
        ) : null}

        <Link
          to="/supervisor/proposed-titles"
          className="inline-block mt-5 no-underline text-blue-600 font-bold hover:text-blue-800"
        >
          ← Back to Proposed Titles
        </Link>
      </div>
    </div>
  );
};

export default ProposalAction;
