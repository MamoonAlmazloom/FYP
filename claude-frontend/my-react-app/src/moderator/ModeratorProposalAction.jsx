import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  reviewProposal,
  reviewSupervisorProposal,
  getProposalDetails,
} from "../API/ModeratorAPI";

const ModeratorProposalAction = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [decision, setDecision] = useState("");
  const [comments, setComments] = useState("");

  const proposalId = searchParams.get("id");

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        if (!proposalId) {
          setError("Proposal ID not provided.");
          return;
        }

        setLoading(true);
        // Get proposal details using the moderator API endpoint
        const response = await getProposalDetails(proposalId);

        if (response.success) {
          setProposal(response.proposal);
        } else {
          setError(response.error || "Failed to load proposal details");
        }
      } catch (err) {
        console.error("Error fetching proposal details:", err);
        setError("Failed to load proposal details");
      } finally {
        setLoading(false);
      }
    };

    fetchProposalDetails();
  }, [proposalId]);

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const handleSubmitDecision = async () => {
    if (!decision) {
      alert("Please select a decision.");
      return;
    }

    if (!user?.id) {
      alert("User session expired. Please log in again.");
      return;
    }

    try {
      setSubmitting(true);

      const reviewData = {
        decision,
        comments: comments.trim() || undefined,
      }; // Determine if this is a supervisor proposal or student proposal
      // For now, we'll assume it's a student proposal (supervisor-approved)
      const response = await reviewProposal(proposalId, reviewData);

      if (response.success) {
        alert(
          `Proposal ${
            decision === "modify"
              ? "sent back for modification"
              : decision + "d"
          } successfully!`
        );
        navigate("/moderator/proposed-titles");
      } else {
        alert(response.error || "Failed to submit decision");
      }
    } catch (err) {
      console.error("Error submitting decision:", err);
      alert("Failed to submit decision. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <svg
                  className="w-8 h-8"
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
              </div>
              <div>
                <h1 className="text-xl font-bold">Review Proposal</h1>
                <p className="text-indigo-100 text-sm">
                  Moderate Project Submission
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/moderator/dashboard"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Dashboard
              </Link>
              <Link
                to="/moderator/proposed-titles"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Proposed Titles
              </Link>
            </div>

            <button
              onClick={handleSignOut}
              className="group flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto mt-8 p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full">
                <svg
                  className="w-8 h-8 text-indigo-600"
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
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Review Proposal
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Carefully review the project proposal details and provide your
              moderation decision.
            </p>
          </div>{" "}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-50 rounded-lg">
                <svg
                  className="animate-spin w-5 h-5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-indigo-600 font-medium">
                  Loading proposal details...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          ) : proposal ? (
            <>
              {/* Enhanced Proposal Details */}
              <div className="bg-gradient-to-r from-gray-50 to-indigo-50 border border-gray-200 rounded-xl p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-indigo-600"
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
                  <h3 className="text-2xl font-bold text-indigo-700">
                    {proposal.title}
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Student</div>
                        <div className="font-semibold text-gray-900">
                          {proposal.submitter?.name || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      <div className="p-2 bg-green-100 rounded-lg">
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
                      <div>
                        <div className="text-sm text-gray-500">Supervisor</div>
                        <div className="font-semibold text-gray-900">
                          {proposal.supervisor?.name || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <svg
                          className="w-5 h-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Type</div>
                        <div className="font-semibold text-gray-900">
                          {proposal.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <svg
                          className="w-5 h-5 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">
                          Specialization
                        </div>
                        <div className="font-semibold text-gray-900">
                          {proposal.specialization}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
                      <svg
                        className="w-5 h-5 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h7"
                        />
                      </svg>
                      Description
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {proposal.description}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
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
                      Expected Outcome
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {proposal.outcome}
                    </p>
                  </div>

                  {proposal.feedback && proposal.feedback.length > 0 && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-4">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        Previous Feedback
                      </h4>
                      <div className="space-y-3">
                        {proposal.feedback.map((fb, index) => (
                          <div
                            key={index}
                            className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-blue-900">
                                {fb.reviewerName}
                              </span>
                              <span className="text-xs text-blue-600">
                                {new Date(fb.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{fb.comments}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>{" "}
              {/* Enhanced Decision Form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Moderation Decision
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Select Your Decision *
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 hover:border-green-300 transition-colors duration-200">
                        <input
                          type="radio"
                          name="decision"
                          value="approve"
                          checked={decision === "approve"}
                          onChange={(e) => setDecision(e.target.value)}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <div className="ml-3 flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
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
                          <div>
                            <div className="text-green-700 font-semibold">
                              Approve Proposal
                            </div>
                            <div className="text-green-600 text-sm">
                              Create project and notify student
                            </div>
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-colors duration-200">
                        <input
                          type="radio"
                          name="decision"
                          value="modify"
                          checked={decision === "modify"}
                          onChange={(e) => setDecision(e.target.value)}
                          className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                        />
                        <div className="ml-3 flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <svg
                              className="w-5 h-5 text-orange-600"
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
                          </div>
                          <div>
                            <div className="text-orange-700 font-semibold">
                              Request Modifications
                            </div>
                            <div className="text-orange-600 text-sm">
                              Send back to student for revisions
                            </div>
                          </div>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-red-50 hover:border-red-300 transition-colors duration-200">
                        <input
                          type="radio"
                          name="decision"
                          value="reject"
                          checked={decision === "reject"}
                          onChange={(e) => setDecision(e.target.value)}
                          className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <div className="ml-3 flex items-center gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="text-red-700 font-semibold">
                              Reject Proposal
                            </div>
                            <div className="text-red-600 text-sm">
                              Decline the proposal entirely
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="comments"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      Comments & Feedback (Optional)
                    </label>
                    <textarea
                      id="comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white shadow-sm"
                      placeholder="Provide detailed feedback, suggestions, or reasoning for your decision..."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
                    <Link
                      to="/moderator/proposed-titles"
                      className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl no-underline"
                    >
                      <svg
                        className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
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
                      <span className="transition-all duration-300 group-hover:tracking-wide">
                        Back to Proposals
                      </span>
                    </Link>

                    <button
                      onClick={handleSubmitDecision}
                      disabled={!decision || submitting}
                      className={`group inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl ${
                        !decision || submitting
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      <span className="transition-all duration-300 group-hover:tracking-wide">
                        {submitting
                          ? "Submitting Decision..."
                          : "Submit Decision"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4 text-gray-500">
                <div className="p-4 bg-gray-100 rounded-full">
                  <svg
                    className="w-12 h-12"
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
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Proposal Not Found
                  </h3>
                  <p className="text-gray-600">
                    The requested proposal could not be located.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorProposalAction;
