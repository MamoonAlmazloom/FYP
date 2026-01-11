import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../API/authAPI";
import { getProposalsBySupervisor } from "../API/SupervisorAPI";

const ProposedTitles = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProposals = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }
        setUser(currentUser);

        const response = await getProposalsBySupervisor(currentUser.id);
        if (response.success) {
          setProposals(response.proposals);
        } else {
          setError(response.error || "Failed to load proposals");
        }
      } catch (err) {
        console.error("Error loading proposals:", err);
        setError("Failed to load proposals. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProposals();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Approved":
        return "text-green-600 bg-green-100";
      case "Supervisor_Approved":
        return "text-blue-600 bg-blue-100";
      case "Rejected":
        return "text-red-600 bg-red-100";
      case "Needs_Modification":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
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
          </Link>{" "}
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
      <div className="max-w-4xl mx-auto my-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Review Proposed Titles
        </h2>
        <p className="text-gray-600 mb-6">
          Select a proposal to review and take action.
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading proposals...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : proposals.length === 0 ? (
          <div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-8 rounded">
            <p className="text-lg">No proposals found for review.</p>
            <p className="text-sm mt-2">
              Proposals submitted to you for review will appear here.
            </p>
          </div>
        ) : (
          /* Proposed Titles Table */
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mt-5">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Student Name
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Proposed Title
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Status
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal) => (
                  <tr key={proposal.proposal_id}>
                    {" "}
                    <td className="border border-gray-300 p-3 text-left">
                      {proposal.submitter_name || "Unknown Student"}
                    </td>
                    <td className="border border-gray-300 p-3 text-left">
                      {proposal.title}
                    </td>
                    <td className="border border-gray-300 p-3 text-left">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          proposal.status_name
                        )}`}
                      >
                        {proposal.status_name}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-3 text-left">
                      <Link
                        to={`/supervisor/proposal-action/${
                          proposal.proposal_id
                        }?student=${encodeURIComponent(
                          proposal.submitter_name || "Unknown Student"
                        )}&title=${encodeURIComponent(proposal.title)}`}
                        className="px-3 py-2 bg-cyan-600 text-white border-0 rounded text-sm cursor-pointer no-underline hover:bg-cyan-700"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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

export default ProposedTitles;
