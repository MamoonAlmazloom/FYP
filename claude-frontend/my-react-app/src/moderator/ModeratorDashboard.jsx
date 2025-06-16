import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPendingProposals } from "../API/ModeratorAPI";

const ModeratorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [pendingProposals, setPendingProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingProposals = async () => {
      try {
        if (!user?.id) {
          setError('User not found. Please log in again.');
          return;
        }

        setLoading(true);
        const response = await getPendingProposals(user.id);
        
        if (response.success) {
          setPendingProposals(response.proposals || []);
        } else {
          setError(response.error || 'Failed to load pending proposals');
        }
      } catch (err) {
        console.error('Error fetching pending proposals:', err);
        setError('Failed to load pending proposals');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingProposals();
  }, [user]);

  const handleSignOut = () => {
    logout();
    navigate("/login");
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
            Projects
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

      {/* Moderator Info Header */}
      <div className="bg-gray-600 text-white px-4 py-4 text-base flex justify-around flex-wrap text-center">
        <span>
          <strong>Moderator Name:</strong> Alex Johnson
        </span>
        <span>
          <strong>Department:</strong> Faculty of Computing
        </span>
        <span>
          <strong>Assigned Titles:</strong> 15
        </span>
      </div>

      <div className="max-w-4xl mx-auto mt-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Moderator Dashboard</h2>
        <p className="mb-6">
          Manage and review project moderation tasks efficiently.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/moderator/proposed-titles"
            className="block w-full p-4 bg-blue-600 text-white text-base rounded text-center no-underline hover:bg-blue-700"
          >
            Review Proposed Titles
          </Link>
          <Link
            to="/moderator/previous-projects"
            className="block w-full p-4 bg-blue-600 text-white text-base rounded text-center no-underline hover:bg-blue-700"
          >
            Previous Project Archive
          </Link>
        </div>

        {/* Notification Center */}
        <div className="bg-yellow-300 p-4 rounded mt-5 text-sm text-black border border-yellow-600 text-left">
          <h3 className="mt-0 mb-3 text-black text-left">
            🔔 Notification Center
          </h3>
          <p className="mb-2">
            <strong>Reminder:</strong> Review pending project titles.
          </p>
          <p className="mb-0">
            <strong>Update:</strong> A project requires additional feedback
            before final approval.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
