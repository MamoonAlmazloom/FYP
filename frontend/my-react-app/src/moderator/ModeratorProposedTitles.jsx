import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPendingProposals } from "../API/ModeratorAPI";

const ModeratorProposedTitles = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [proposedTitles, setProposedTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPendingProposals = async () => {
      try {
        setLoading(true);
        const response = await getPendingProposals();

        if (response.success) {
          setProposedTitles(response.proposals || []);
        } else {
          setError(response.error || "Failed to load pending proposals");
        }
      } catch (err) {
        console.error("Error fetching pending proposals:", err);
        setError("Failed to load pending proposals");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingProposals();
  }, []);

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };
  const handleProposalAction = (
    proposalId,
    title,
    submitterName,
    proposalType
  ) => {
    navigate(
      `/moderator/proposal-action?id=${proposalId}&title=${encodeURIComponent(
        title
      )}&submitter=${encodeURIComponent(submitterName)}&type=${proposalType}`
    );
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
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Review Proposed Titles</h1>
                <p className="text-indigo-100 text-sm">
                  Moderate Project Proposals
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
                to="/moderator/previous-projects"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Previous Projects
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
      <div className="max-w-7xl mx-auto mt-8 p-6">
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
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Review Proposed Titles
            </h2>{" "}
            <p className="text-gray-600 max-w-2xl mx-auto">
              Review and moderate project proposals from both students and
              supervisors. Ensure all submissions meet academic standards and
              requirements.
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
                  Loading pending proposals...
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
          ) : proposedTitles.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4 text-gray-500">
                <div className="p-4 bg-green-100 rounded-full">
                  <svg
                    className="w-12 h-12 text-green-600"
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
                  <h3 className="text-lg font-semibold text-green-700 mb-2">
                    All Caught Up!
                  </h3>
                  <p className="text-green-600">
                    No pending proposals for review.
                  </p>
                  <p className="text-sm text-green-500 mt-1">
                    Great work! Check back later for new submissions.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-8">
                <div className="flex items-center justify-center gap-2 text-blue-700">
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">
                    Found {proposedTitles.length} proposal
                    {proposedTitles.length !== 1 ? "s" : ""} awaiting review
                  </span>
                </div>
              </div>

              {/* Enhanced Proposals Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    {" "}
                    <thead>
                      <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Submitter
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Proposed Title
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Supervisor
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {proposedTitles.map((proposal, index) => (
                        <tr
                          key={proposal.proposal_id}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-indigo-50 transition-colors duration-200`}
                        >
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                proposal.proposal_type === "supervisor"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {proposal.proposal_type === "supervisor"
                                ? "Supervisor"
                                : "Student"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {proposal.submitter_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="font-medium">{proposal.title}</div>
                            {proposal.proposal_type === "supervisor" && (
                              <div className="text-xs text-gray-500 mt-1">
                                Type: {proposal.type} •{" "}
                                {proposal.specialization}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {proposal.proposal_type === "supervisor" ? (
                              <span className="text-green-600 font-medium">
                                Self-proposed
                              </span>
                            ) : (
                              proposal.supervisor_name || (
                                <span className="text-gray-400 italic">
                                  Not assigned
                                </span>
                              )
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {" "}
                            <button
                              onClick={() =>
                                handleProposalAction(
                                  proposal.proposal_id,
                                  proposal.title,
                                  proposal.submitter_name,
                                  proposal.proposal_type
                                )
                              }
                              className="group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                            >
                              <svg
                                className="w-4 h-4"
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
                                Review
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          <div className="text-center mt-8">
            <Link
              to="/moderator/dashboard"
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
                Back to Dashboard
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorProposedTitles;
