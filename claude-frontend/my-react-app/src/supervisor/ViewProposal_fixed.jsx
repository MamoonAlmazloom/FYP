import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../API/authAPI";
import { getSupervisorProposal } from "../API/SupervisorAPI";

const ViewProposal = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        if (!proposalId) {
          navigate("/supervisor/proposed-titles");
          return;
        }

        const response = await getSupervisorProposal(
          currentUser.id,
          proposalId
        );
        if (response.success) {
          setProposal(response.proposal);
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
      <div className="max-w-2xl w-full mx-auto p-5 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          View Proposal
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {proposal ? (
          <div className="bg-gray-50 p-4 rounded mt-3">
            <p className="mb-3">
              <strong>Title:</strong> {proposal.title}
            </p>
            <p className="mb-3">
              <strong>Submitted On:</strong>{" "}
              {new Date(proposal.createdAt).toLocaleDateString()}
            </p>
            <p className="mb-3">
              <strong>Proposal Description:</strong> {proposal.description}
            </p>
            {proposal.objectives && (
              <p className="mb-3">
                <strong>Objectives:</strong> {proposal.objectives}
              </p>
            )}
            {proposal.requirements && (
              <p className="mb-3">
                <strong>Requirements:</strong> {proposal.requirements}
              </p>
            )}
            {proposal.duration && (
              <p className="mb-3">
                <strong>Duration:</strong> {proposal.duration}
              </p>
            )}
            <p className="mb-3">
              <strong>Status:</strong>{" "}
              <span
                className={`font-bold ${
                  proposal.status === "approved"
                    ? "text-green-600"
                    : proposal.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {proposal.status
                  ? proposal.status.charAt(0).toUpperCase() +
                    proposal.status.slice(1)
                  : "Pending"}
              </span>
            </p>
            {proposal.feedback && (
              <p className="mb-0">
                <strong>Feedback:</strong> {proposal.feedback}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">Proposal not found</p>
            <p className="text-sm">
              The requested proposal could not be loaded.
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <Link
            to="/supervisor/proposed-titles"
            className="inline-block no-underline text-blue-600 font-bold hover:text-blue-800"
          >
            ← Back to Proposals
          </Link>
          {proposal && (
            <Link
              to={`/supervisor/modify-proposal/${proposalId}`}
              className="inline-block no-underline text-green-600 font-bold hover:text-green-800"
            >
              Edit Proposal
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProposal;
