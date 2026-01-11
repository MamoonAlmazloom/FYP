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
          {" "}
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/student/choose-path"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-lg transition-all duration-300 no-underline shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
              Back to Select Path
            </span>
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
            {" "}
            <Link
              to="/student/propose-project"
              className="group block w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 no-underline font-semibold text-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Propose New Project
              </span>
            </Link>
            <Link
              to="/student/select-title"
              className="group block w-full py-3 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-300 no-underline font-semibold text-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Select Available Project
              </span>
            </Link>
            <Link
              to="/student/choose-path"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-lg transition-all duration-300 no-underline shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
                Back to Select Path
              </span>
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
                </div>{" "}
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
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        <svg
                          className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span className="transition-all duration-300 group-hover:tracking-wide">
                          Start Project Work
                        </span>
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
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        <svg
                          className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        <span className="transition-all duration-300 group-hover:tracking-wide">
                          Modify Proposal
                        </span>
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
                      {" "}
                      <Link
                        to="/student/propose-project"
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        <svg
                          className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span className="transition-all duration-300 group-hover:tracking-wide">
                          Submit New Proposal
                        </span>
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
                )}{" "}
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  {" "}
                  <Link
                    to={`/student/view-proposal?id=${proposal.proposal_id}`}
                    className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 no-underline text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                  >
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span className="transition-all duration-300 group-hover:tracking-wide">
                      View Full Details
                    </span>
                  </Link>
                  {(proposal.status_name?.toLowerCase() === "pending" ||
                    proposal.status_name?.toLowerCase() ===
                      "requires modification") && (
                    <Link
                      to={`/student/modify-proposal?id=${proposal.proposal_id}`}
                      className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg transition-all duration-300 no-underline text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                    >
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span className="transition-all duration-300 group-hover:tracking-wide">
                        Edit Proposal
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>{" "}
        {/* Navigation */}
        <div className="text-center mt-8">
          <Link
            to="/student/choose-path"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
              Back to Select a Path
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;
