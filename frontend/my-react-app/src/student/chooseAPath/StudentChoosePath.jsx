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
          <p className="text-gray-600 mb-6">{error}</p>{" "}
          <button
            onClick={() => window.location.reload()}
            className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <span className="transition-all duration-300 group-hover:tracking-wide">
              Retry
            </span>
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
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
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Student Dashboard</h1>
                <p className="text-blue-100 text-sm">
                  Final Year Project Management
                </p>
              </div>
            </div>{" "}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 backdrop-blur-sm rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              title="Logout"
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
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Info Banner */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center flex-wrap gap-4">
            <span className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <strong>Student:</strong> {user?.name || "Loading..."}
            </span>
            <span className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <strong>Department:</strong> Computer Science
            </span>
            <span className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <strong>Total Proposals:</strong> {proposals.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Welcome Back, {user?.name || "Student"}!
            </h2>
            <p className="text-gray-600 text-lg">
              Choose how you would like to proceed with your FYP selection.
            </p>
          </div>
          {/* Status Information */}
          {proposals.length > 0 && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Your Current Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">
                    {proposals.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Proposals</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">
                    {getApprovedProposals().length}
                  </div>
                  <div className="text-sm text-gray-600">Approved</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-yellow-600">
                    {getPendingProposals().length}
                  </div>
                  <div className="text-sm text-gray-600">Pending Review</div>
                </div>
              </div>
            </div>
          )}{" "}
          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              to="/student/select-title"
              className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white rounded-xl p-6 text-center transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/50 no-underline border border-blue-400/20 hover:border-blue-300/40"
            >
              <div className="relative z-10">
                <div className="text-4xl mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  📋
                </div>
                <h3 className="text-lg font-bold mb-2 transition-all duration-300 group-hover:tracking-wide">
                  Select from Available Titles
                </h3>
                <p className="text-blue-100 text-sm opacity-90 transition-opacity duration-300 group-hover:opacity-100">
                  Browse pre-approved project titles
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            <Link
              to="/student/propose-project"
              className="group relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-green-700 hover:from-green-600 hover:via-green-700 hover:to-green-800 text-white rounded-xl p-6 text-center transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-green-500/50 no-underline border border-green-400/20 hover:border-green-300/40"
            >
              <div className="relative z-10">
                <div className="text-4xl mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  💡
                </div>
                <h3 className="text-lg font-bold mb-2 transition-all duration-300 group-hover:tracking-wide">
                  Propose a New Project
                </h3>
                <p className="text-green-100 text-sm opacity-90 transition-opacity duration-300 group-hover:opacity-100">
                  Submit your own project idea
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            <Link
              to="/student/project-status"
              className="group relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white rounded-xl p-6 text-center transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 no-underline border border-purple-400/20 hover:border-purple-300/40"
            >
              <div className="relative z-10">
                <div className="text-4xl mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  📊
                </div>
                <h3 className="text-lg font-bold mb-2 transition-all duration-300 group-hover:tracking-wide">
                  View Project Status
                </h3>
                <p className="text-purple-100 text-sm opacity-90 transition-opacity duration-300 group-hover:opacity-100">
                  Check your proposal status
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
          {/* Help Section */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <h4 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Quick Guide
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/60 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-700 mb-2">
                  📋 Available Titles
                </h5>
                <p className="text-gray-700">
                  Browse and choose from pre-approved project titles by
                  supervisors
                </p>
              </div>
              <div className="bg-white/60 p-4 rounded-lg">
                <h5 className="font-semibold text-green-700 mb-2">
                  💡 New Proposal
                </h5>
                <p className="text-gray-700">
                  Submit your own creative project idea for supervisor approval
                </p>
              </div>
              <div className="bg-white/60 p-4 rounded-lg">
                <h5 className="font-semibold text-purple-700 mb-2">
                  📊 Track Status
                </h5>
                <p className="text-gray-700">
                  Monitor the progress and status of all your submitted
                  proposals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentChoosePath;
