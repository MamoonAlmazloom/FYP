import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../API/authAPI";
import { getSupervisorOwnProposals } from "../API/SupervisorAPI";

const ViewProposal = () => {
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

        const response = await getSupervisorOwnProposals(currentUser.id);
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
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      case "supervisor_approved":
        return "text-blue-600 bg-blue-100";
      case "modifications_required":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading proposals...</p>
        </div>
      </div>
    );
  }

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
          onClick={() => {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            navigate("/login");
          }}
          className="bg-red-600 text-white px-4 py-2 border-0 rounded text-sm cursor-pointer hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      <div className="max-w-6xl mx-auto my-10 p-5 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          My Proposals
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {proposals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No proposals found</p>
            <p className="text-sm mt-2">
              You haven't created any proposals yet.
            </p>
            <Link
              to="/supervisor/propose-project"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors no-underline font-semibold"
            >
              Create Your First Proposal
            </Link>
          </div>
        ) : (
          /* Proposals Table */
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mt-5">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Title
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Type
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Status
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal) => (
                  <tr key={proposal.proposal_id}>
                    <td className="border border-gray-300 p-3 text-left">
                      <div>
                        <div className="font-semibold text-gray-800">
                          {proposal.title}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {proposal.proposal_description?.substring(0, 100)}
                          {proposal.proposal_description?.length > 100 && "..."}
                        </div>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-3 text-left">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">
                        {proposal.type || "N/A"}
                      </span>
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
                      <div className="flex gap-2">
                        <Link
                          to={`/supervisor/modify-proposal/${proposal.proposal_id}`}
                          className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm no-underline font-semibold transition-colors"
                        >
                          ✏️ Modify Proposal
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/supervisor/dashboard"
            className="inline-block no-underline text-blue-600 font-bold hover:text-blue-800"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewProposal;
