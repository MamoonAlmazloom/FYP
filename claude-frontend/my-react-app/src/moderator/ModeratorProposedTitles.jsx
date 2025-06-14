import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPendingProposals } from "../API/ModeratorAPI";
import { useAuth } from "../contexts/AuthContext";

const ModeratorProposedTitles = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      const fetchProposals = async () => {
        setLoading(true);
        try {
          const pendingProposals = await getPendingProposals(user.id);
          setProposals(pendingProposals);
          setError(null);
        } catch (err) {
          setError("Failed to fetch pending proposals. Please try again later.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProposals();
    } else {
      // setError("User not authenticated. Please login.");
      setLoading(false); // Stop loading if no user ID
    }
  }, [user]);

  const handleSignOut = () => {
    navigate("/login");
  };

  const handleProposalAction = (title, studentName) => {
    navigate(
      `/moderator/proposal-action?title=${encodeURIComponent(
        title
      )}&student=${encodeURIComponent(studentName)}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-gray-800 text-white flex justify-between items-center px-5 py-4">
        <div className="text-xl font-bold">🔍 Moderator Dashboard</div>
        <div className="flex-grow text-center">
          <Link
            to="/moderator/dashboard"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Home
          </Link>
          <Link
            to="#"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Students
          </Link>
          <Link
            to="#"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Logs
          </Link>
          <Link
            to="#"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Reports
          </Link>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      <div className="max-w-4xl mx-auto mt-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Review Proposed Titles</h2>
        <p className="mb-6">Select a proposal to review and take action.</p>

        {loading && <p className="text-center text-gray-600">Loading proposals...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && proposals.length === 0 && (
          <p className="text-center text-gray-600">No pending proposals found.</p>
        )}

        {!loading && !error && proposals.length > 0 && (
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
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal) => (
                  <tr key={proposal.proposal_id}>
                    <td className="border border-gray-300 p-3 text-left">
                      {proposal.submitter_name}
                    </td>
                    <td className="border border-gray-300 p-3 text-left">
                      {proposal.title}
                    </td>
                    <td className="border border-gray-300 p-3 text-left">
                      <button
                        onClick={() =>
                          handleProposalAction(
                            proposal.title,
                            proposal.submitter_name
                          )
                        }
                        className="px-3 py-2 bg-cyan-600 text-white border-none rounded cursor-pointer text-sm no-underline hover:bg-cyan-700"
                      >
                        Action
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link
          to="/moderator/dashboard"
          className="inline-block mt-5 text-blue-600 font-bold no-underline hover:text-blue-800"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ModeratorProposedTitles;
