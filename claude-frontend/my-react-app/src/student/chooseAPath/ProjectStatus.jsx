import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getStudentProposals } from "../../API/StudentAPI";

const ProjectStatus = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        if (!user?.id) {
          setError("User not found. Please log in again.");
          return;
        }

        setLoading(true);
        const response = await getStudentProposals(user.id);

        if (response.success) {
          console.log("Proposals fetched successfully:", response.proposals);
          setProposals(response.proposals || []);
        } else {
          setError(response.error || "Failed to load proposals");
        }
      } catch (err) {
        console.error("Error fetching proposals:", err);
        setError("Failed to load proposals");
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [user]);

  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          className: "bg-yellow-100 text-yellow-800 border-yellow-300",
          text: "Pending Review",
          icon: "⏳",
        };
      case "approved":
        return {
          className: "bg-green-100 text-green-800 border-green-300",
          text: "Approved",
          icon: "✅",
        };
      case "rejected":
        return {
          className: "bg-red-100 text-red-800 border-red-300",
          text: "Rejected",
          icon: "❌",
        };
      case "requires modification":
      case "modify":
        return {
          className: "bg-blue-100 text-blue-800 border-blue-300",
          text: "Requires Modification",
          icon: "🔄",
        };
      default:
        return {
          className: "bg-gray-100 text-gray-800 border-gray-300",
          text: status || "Unknown Status",
          icon: "❓",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your proposals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/student/choose-path"
            className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 no-underline"
          >
            Back to Select Path
          </Link>
        </div>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            No Proposals Found
          </h2>
          <p className="text-gray-600 mb-8">
            You haven't submitted any proposals yet. Would you like to submit
            one now?
          </p>
          <div className="space-y-4">
            <Link
              to="/student/propose-project"
              className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
            >
              Propose New Project
            </Link>
            <Link
              to="/student/select-title"
              className="block w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
            >
              Select Available Project
            </Link>
            <Link
              to="/student/choose-path"
              className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 no-underline"
            >
              Back to Select Path
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          My Project Proposals
        </h2>

        <div className="space-y-6">
          {proposals.map((proposal) => {
            const statusDisplay = getStatusDisplay(proposal.status_name);

            return (
              <div
                key={proposal.proposal_id}
                className="bg-white p-8 rounded-lg shadow-lg"
              >
                {/* Project Information */}
                <div className="mb-6 bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    {proposal.title}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Type:</span>
                      <span className="text-gray-800">{proposal.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Specialization:
                      </span>
                      <span className="text-gray-800">
                        {proposal.specialization}
                      </span>{" "}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Assigned Examiner:
                      </span>
                      <span className="text-gray-800">
                        {proposal.examiner_name || "Unassigned"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Submitted To:
                      </span>
                      <span className="text-gray-800">
                        {proposal.reviewer_name || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-600 mb-2">
                      Description:
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {proposal.proposal_description}
                    </p>
                  </div>

                  {/* Expected Outcome */}
                  {proposal.outcome && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-600 mb-2">
                        Expected Outcome:
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {proposal.outcome}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Display */}
                <div className="mb-6">
                  <p className="text-gray-600 text-center mb-4">
                    Proposal Status:
                  </p>
                  <div
                    className={`p-6 rounded-lg border-2 text-center text-xl font-semibold ${statusDisplay.className}`}
                  >
                    <span className="text-2xl mr-2">{statusDisplay.icon}</span>
                    {statusDisplay.text}
                  </div>
                </div>

                {/* Additional Actions based on status */}
                {proposal.status_name?.toLowerCase() === "approved" && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-center mb-4">
                      🎉 Congratulations! Your project has been approved. You
                      can now proceed to project work.
                    </p>
                    <div className="text-center">
                      <Link
                        to="/student/project-work"
                        className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
                      >
                        Start Project Work
                      </Link>
                    </div>
                  </div>
                )}

                {(proposal.status_name?.toLowerCase() ===
                  "requires modification" ||
                  proposal.status_name?.toLowerCase() === "modify") && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-center mb-4">
                      Your project requires modifications. Please review the
                      feedback and resubmit.
                    </p>
                    <div className="text-center">
                      <Link
                        to={`/student/modify-proposal?id=${proposal.proposal_id}`}
                        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
                      >
                        Modify Proposal
                      </Link>
                    </div>
                  </div>
                )}

                {proposal.status_name?.toLowerCase() === "rejected" && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-center mb-4">
                      Your project proposal has been rejected. You can submit a
                      new proposal.
                    </p>
                    <div className="text-center">
                      <Link
                        to="/student/propose-project"
                        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
                      >
                        Submit New Proposal
                      </Link>
                    </div>
                  </div>
                )}

                {/* Feedback Section */}
                {proposal.feedback && proposal.feedback.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                      Supervisor Feedback:
                    </h3>
                    <div className="space-y-3">
                      {proposal.feedback.map((feedback, index) => (
                        <div
                          key={feedback.feedback_id}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              {feedback.reviewer_name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(
                                feedback.created_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{feedback.comments}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link
                    to={`/student/view-proposal?id=${proposal.proposal_id}`}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 no-underline text-sm font-semibold"
                  >
                    View Full Details
                  </Link>
                  {(proposal.status_name?.toLowerCase() === "pending" ||
                    proposal.status_name?.toLowerCase() ===
                      "requires modification") && (
                    <Link
                      to={`/student/modify-proposal?id=${proposal.proposal_id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 no-underline text-sm font-semibold"
                    >
                      Edit Proposal
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
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

export default ProjectStatus;
