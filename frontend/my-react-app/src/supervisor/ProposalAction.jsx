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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState({
    decision: "",
    message: "",
  });

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
        // Set success data and show modal
        const decisionMessages = {
          approve: {
            title: "Proposal Approved Successfully! 🎉",
            message:
              "The student will be notified and can now proceed with their project work.",
            icon: "✅",
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
          },
          reject: {
            title: "Proposal Rejected",
            message:
              "The student has been notified of your decision and feedback.",
            icon: "❌",
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
          },
          modify: {
            title: "Modification Requested",
            message:
              "The student will receive your feedback and can modify their proposal accordingly.",
            icon: "🔄",
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
          },
        };

        setSuccessData({
          decision,
          ...decisionMessages[decision],
        });
        setShowSuccessModal(true);
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

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/supervisor/proposed-titles");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
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
            to="/supervisor/proposed-titles"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Review Proposals
          </Link>
          <Link
            to="/supervisor/propose-project"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Propose a Title
          </Link>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 border-0 rounded text-sm cursor-pointer hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>{" "}
      <div className="max-w-4xl mx-auto my-10 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Review Student Proposal
          </h2>
          <p className="text-gray-600">
            Carefully review the proposal details and provide your decision
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <span className="text-lg text-gray-600">
                Loading proposal details...
              </span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center">
            <svg
              className="w-6 h-6 mr-3 flex-shrink-0"
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
            <div>
              <p className="font-semibold">Error Loading Proposal</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : proposal ? (
          <>
            {/* Enhanced Proposal Details Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-600 font-semibold mb-1">
                        Student Name
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {proposal.submitter_name || "Unknown Student"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-semibold mb-1">
                        Status
                      </p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          proposal.status_name === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : proposal.status_name === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {proposal.status_name === "Pending" && "⏳ "}
                        {proposal.status_name === "Approved" && "✅ "}
                        {proposal.status_name}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-blue-600 font-semibold mb-2">
                      Project Title
                    </p>
                    <p className="text-xl font-bold text-gray-800 mb-4">
                      {proposal.title || "Unknown Title"}
                    </p>
                  </div>

                  {proposal.proposal_description && (
                    <div className="mt-4">
                      <p className="text-sm text-blue-600 font-semibold mb-2">
                        Description
                      </p>
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        <p className="text-gray-700 leading-relaxed">
                          {proposal.proposal_description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Additional proposal fields if available */}
                  {(proposal.type ||
                    proposal.specialization ||
                    proposal.outcome) && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {proposal.type && (
                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                          <p className="text-xs text-blue-600 font-semibold mb-1">
                            Type
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {proposal.type}
                          </p>
                        </div>
                      )}
                      {proposal.specialization && (
                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                          <p className="text-xs text-blue-600 font-semibold mb-1">
                            Specialization
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {proposal.specialization}
                          </p>
                        </div>
                      )}
                      {proposal.outcome && (
                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                          <p className="text-xs text-blue-600 font-semibold mb-1">
                            Expected Outcome
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {proposal.outcome}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Comments Section */}
            <div className="mb-8">
              <label
                htmlFor="comments"
                className="block text-lg font-semibold text-gray-700 mb-3"
              >
                Your Feedback & Comments
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Optional)
                </span>
              </label>
              <div className="relative">
                <textarea
                  id="comments"
                  rows="4"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Provide constructive feedback, suggestions, or comments about this proposal..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  disabled={submitting}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {comments.length}/500
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                💡 Your feedback will be shared with the student to help them
                improve their proposal.
              </div>
            </div>

            {/* Decision Buttons */}
            {proposal.status_name === "Pending" ? (
              <div className="flex justify-between mt-5 gap-3">
                <button
                  onClick={() => handleDecision("approve")}
                  disabled={submitting}
                  className="group flex-1 p-4 text-base text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2 transition-transform group-hover:scale-110"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Approve
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleDecision("modify")}
                  disabled={submitting}
                  className="group flex-1 p-4 text-base text-black bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 border-0 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2 transition-transform group-hover:rotate-180"
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
                      Request Modification
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleDecision("reject")}
                  disabled={submitting}
                  className="group flex-1 p-4 text-base text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2 transition-transform group-hover:scale-110"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Reject
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-xl flex items-center">
                <svg
                  className="w-6 h-6 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold">Proposal Already Reviewed</p>
                  <p className="text-sm">
                    This proposal has been reviewed with status:{" "}
                    <strong>{proposal.status_name}</strong>
                  </p>
                </div>
              </div>
            )}
          </>
        ) : null}

        <div className="text-center mt-8">
          <Link
            to="/supervisor/proposed-titles"
            className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 no-underline"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Proposed Titles
          </Link>
        </div>
      </div>
      {/* Enhanced Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            {/* Header */}
            <div
              className={`${successData.bgColor} ${successData.borderColor} border-b rounded-t-2xl p-6`}
            >
              <div className="flex items-center justify-center">
                <div className="text-6xl mb-2">{successData.icon}</div>
              </div>
              <h3
                className={`text-xl font-bold text-center ${successData.color}`}
              >
                {successData.title}
              </h3>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                {successData.message}
              </p>

              {/* Additional info based on decision */}
              {successData.decision === "approve" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-green-500 mt-0.5"
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
                    <div>
                      <h4 className="text-sm font-semibold text-green-800 mb-1">
                        Next Steps
                      </h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Student will receive an approval notification</li>
                        <li>• Proposal will proceed to moderator review</li>
                        <li>• You'll be notified of the final decision</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {successData.decision === "modify" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-yellow-500 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                        What Happens Next
                      </h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Student will receive your feedback</li>
                        <li>• They can modify and resubmit the proposal</li>
                        <li>
                          • Updated proposal will require your review again
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {successData.decision === "reject" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-red-500 mt-0.5"
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
                    <div>
                      <h4 className="text-sm font-semibold text-red-800 mb-1">
                        Decision Recorded
                      </h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• Student has been notified of rejection</li>
                        <li>• Your feedback has been shared with them</li>
                        <li>• They may submit a new proposal if desired</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={closeSuccessModal}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalAction;
