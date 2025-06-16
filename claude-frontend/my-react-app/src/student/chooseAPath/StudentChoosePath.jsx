import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getStudentProjects, getStudentProposals } from "../../API/StudentAPI";

const StudentChoosePath = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkStudentStatus = async () => {
      try {
        if (!user?.id) {
          setError("User not found. Please log in again.");
          return;
        }

        setLoading(true);

        // Check if student has active projects
        const [projectsResponse, proposalsResponse] = await Promise.all([
          getStudentProjects(user.id),
          getStudentProposals(user.id),
        ]);

        if (projectsResponse.success) {
          setProjects(projectsResponse.projects || []);

          // If student has active projects, redirect to project work
          if (
            projectsResponse.projects &&
            projectsResponse.projects.length > 0
          ) {
            navigate("/student/project-work");
            return;
          }
        }

        if (proposalsResponse.success) {
          setProposals(proposalsResponse.proposals || []);
        }
      } catch (err) {
        console.error("Error checking student status:", err);
        setError("Failed to load student status");
      } finally {
        setLoading(false);
      }
    };
    checkStudentStatus();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getApprovedProposals = () => {
    return proposals.filter((p) => p.status_name?.toLowerCase() === "approved");
  };

  const getPendingProposals = () => {
    return proposals.filter((p) => p.status_name?.toLowerCase() === "pending");
  };

  const hasApprovedProposals = getApprovedProposals().length > 0;
  const hasPendingProposals = getPendingProposals().length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your project status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white p-8 border border-gray-200 rounded-lg shadow-lg">
        {/* Header with logout button */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome, {user?.name || "Student"}!
            </h2>
            <p className="text-gray-600">
              Choose how you would like to proceed with your FYP selection.
            </p>
          </div>{" "}
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
            title="Logout"
          >
            <svg
              className="w-4 h-4 inline-block mr-1"
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
            Logout
          </button>
        </div>

        {/* Status Information */}
        {proposals.length > 0 && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Your Current Status
            </h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• Total proposals submitted: {proposals.length}</p>
              {hasApprovedProposals && (
                <p>• Approved proposals: {getApprovedProposals().length}</p>
              )}
              {hasPendingProposals && (
                <p>• Pending proposals: {getPendingProposals().length}</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Link
            to="/student/select-title"
            className="block w-full py-4 px-6 text-center text-lg text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 no-underline font-semibold"
          >
            📋 Select from Available Titles
          </Link>

          <Link
            to="/student/propose-project"
            className="block w-full py-4 px-6 text-center text-lg text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 no-underline font-semibold"
          >
            💡 Propose a New Project
          </Link>

          <Link
            to="/student/project-status"
            className="block w-full py-4 px-6 text-center text-lg text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-200 no-underline font-semibold"
          >
            📊 View Project Status
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Quick Overview
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {proposals.length}
              </div>
              <div className="text-sm text-gray-600">Proposals</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {getApprovedProposals().length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {getPendingProposals().length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h4 className="text-lg font-semibold text-yellow-800 mb-2">
            Need Help?
          </h4>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>
              • <strong>Select from Available Titles:</strong> Browse and choose
              from pre-approved project titles
            </p>
            <p>
              • <strong>Propose a New Project:</strong> Submit your own project
              idea for approval
            </p>
            <p>
              • <strong>View Project Status:</strong> Check the status of your
              submitted proposals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentChoosePath;
