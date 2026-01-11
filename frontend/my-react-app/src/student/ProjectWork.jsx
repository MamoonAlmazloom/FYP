import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getStudentProfile,
  getStudentProjects,
  getStudentProposals,
  getActiveProject,
} from "../API/StudentAPI";
import { logout } from "../API/authAPI";

const ProjectWork = () => {
  const { user, logout: contextLogout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        console.log("ProjectWork: Current user:", user);

        if (!user?.id) {
          console.error("ProjectWork: No user ID found");
          setError("User not found. Please log in again.");
          return;
        }

        // Check if token exists
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("ProjectWork: No authentication token found");
          setError("Authentication token missing. Please log in again.");
          return;
        }

        console.log(
          "ProjectWork: Token found, fetching data for user ID:",
          user.id
        );
        setLoading(true);

        // Fetch student profile, projects, proposals, and active project
        const [
          profileResponse,
          projectsResponse,
          proposalsResponse,
          activeProjectResponse,
        ] = await Promise.all([
          getStudentProfile(user.id),
          getStudentProjects(user.id),
          getStudentProposals(user.id),
          getActiveProject(user.id),
        ]);

        console.log("ProjectWork: API responses:", {
          profile: profileResponse,
          projects: projectsResponse,
          proposals: proposalsResponse,
          activeProject: activeProjectResponse,
        });

        if (profileResponse.success) {
          setProfile(profileResponse.student);
        } else {
          console.error("Failed to load profile:", profileResponse.error);
        }

        if (projectsResponse.success) {
          setProjects(projectsResponse.projects || []);
        } else {
          console.error("Failed to load projects:", projectsResponse.error);
        }

        if (proposalsResponse.success) {
          setProposals(proposalsResponse.proposals || []);
        } else {
          console.error("Failed to load proposals:", proposalsResponse.error);
        }

        if (activeProjectResponse.success) {
          setActiveProject(activeProjectResponse.project);
        } else {
          console.error(
            "Failed to load active project:",
            activeProjectResponse.error
          );
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });

        // Handle specific error types
        if (err.response?.status === 401) {
          setError("Authentication expired. Please log in again.");
        } else if (err.response?.status === 403) {
          setError(
            "Access denied. Please ensure you have the correct permissions."
          );
        } else if (err.response?.status === 404) {
          setError("Student data not found. Please contact support.");
        } else {
          setError(
            `Failed to load student data: ${err.message || "Unknown error"}`
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [user]);

  // Helper function to get the most recent proposal for current project work
  const getCurrentProposal = () => {
    if (proposals.length === 0) return null;

    // Find all approved proposals
    const approvedProposals = proposals.filter(
      (p) => p.status_name?.toLowerCase() === "approved"
    );

    if (approvedProposals.length > 0) {
      // Return the most recent approved proposal (highest proposal_id)
      // Since proposals are ordered by proposal_id DESC from backend, the first one is the most recent
      return approvedProposals[0];
    }

    // If no approved proposal, return the most recent one
    return proposals[0]; // proposals are ordered by proposal_id DESC from backend
  };

  // Helper function to get the current project info from either activeProject or most recent approved proposal
  const getCurrentProjectInfo = () => {
    // If there's an activeProject from supervisor-created projects, use it
    if (activeProject) {
      return activeProject;
    }

    // Otherwise, try to get info from the most recent approved proposal
    const currentProposal = getCurrentProposal();
    if (
      currentProposal &&
      currentProposal.status_name?.toLowerCase() === "approved"
    ) {
      // Convert proposal data to project-like structure
      return {
        title: currentProposal.title,
        description: currentProposal.proposal_description,
        supervisor_name: currentProposal.reviewer_name || "Not Assigned",
        specialization: currentProposal.specialization,
        type: currentProposal.type,
        outcome: currentProposal.outcome,
        project_id: currentProposal.project_id,
        proposal_id: currentProposal.proposal_id,
      };
    }

    // Fall back to projects array if available
    return projects[0] || null;
  };

  const handleSignOut = () => {
    logout();
    contextLogout();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>{" "}
          <button
            onClick={handleSignOut}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="transition-all duration-300 group-hover:tracking-wide">
              Sign Out and Retry
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Check if student has any active project (either from projects array, activeProject, or approved proposals)
  const currentProjectInfo = getCurrentProjectInfo();
  const hasActiveProject =
    projects.length > 0 || activeProject || currentProjectInfo;

  // If no active projects, redirect to choose path
  if (!hasActiveProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            No Active Projects
          </h2>
          <p className="text-gray-600 mb-8">
            You don't have any active projects yet. Please select or propose a
            project first.
          </p>{" "}
          <Link
            to="/student/choose-path"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
              Choose Your Path
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // Get current project - use the helper function to get the most appropriate project info
  const currentProject = getCurrentProjectInfo();
  const currentProposal = getCurrentProposal();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Enhanced Header */}
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Project Work Dashboard</h1>
                <p className="text-blue-100 text-sm">
                  Final Year Project Management
                </p>
              </div>
            </div>
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/student/project-work"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Dashboard
              </Link>
              <Link
                to="/student/choose-path"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Projects
              </Link>
            </div>{" "}
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
      {/* Student Info Banner */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center flex-wrap gap-4">
            <span className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <strong>Student:</strong>{" "}
              {profile?.name || user?.name || "Loading..."}
            </span>
            <span className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <strong>ID:</strong>{" "}
              {profile?.user_id || user?.id || "Loading..."}
            </span>
            <span className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <strong>Supervisor:</strong>{" "}
              {currentProject?.supervisor_name || "Not Assigned"}
            </span>
            <span className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <strong>Project:</strong>{" "}
              {currentProject?.title || "No Active Project"}
            </span>
          </div>
        </div>
      </div>
      {/* Main Container */}
      <div className="max-w-4xl mx-auto mt-5 p-5">
        {/* Project Overview Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Current Project Overview
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {currentProject?.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              {currentProject?.description}
            </p>{" "}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-3 text-sm">
              <div>
                <strong>Supervisor:</strong>{" "}
                {currentProject?.supervisor_name || "Not Assigned"}
              </div>
            </div>
          </div>
        </div>

        {/* Project Work Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Project Work
          </h2>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/student/progress-log-form"
              className="group flex items-center justify-center gap-3 w-full py-4 px-6 text-center text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                📝
              </span>
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Submit Progress Log
              </span>
            </Link>
            <Link
              to="/student/select-log"
              className="group flex items-center justify-center gap-3 w-full py-4 px-6 text-center text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                👁️
              </span>
              <span className="transition-all duration-300 group-hover:tracking-wide">
                View Progress Logs
              </span>
            </Link>
            <Link
              to="/student/progress-report-form"
              className="group flex items-center justify-center gap-3 w-full py-4 px-6 text-center text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                📊
              </span>
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Submit Progress Report
              </span>
            </Link>
            <Link
              to="/student/select-report"
              className="group flex items-center justify-center gap-3 w-full py-4 px-6 text-center text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                📋
              </span>
              <span className="transition-all duration-300 group-hover:tracking-wide">
                View Progress Reports
              </span>
            </Link>
            {currentProposal ? (
              <>
                <Link
                  to={`/student/modify-proposal?id=${currentProposal.proposal_id}`}
                  className="group flex items-center justify-center gap-3 w-full py-4 px-6 text-center text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">
                    ✏️
                  </span>
                  <span className="transition-all duration-300 group-hover:tracking-wide">
                    Modify Proposal
                  </span>
                </Link>

                <Link
                  to={`/student/view-proposal?id=${currentProposal.proposal_id}`}
                  className="group flex items-center justify-center gap-3 w-full py-4 px-6 text-center text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                    📄
                  </span>
                  <span className="transition-all duration-300 group-hover:tracking-wide">
                    View Proposal
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/student/project-status"
                  className="group flex items-center justify-center gap-3 w-full py-4 px-6 text-center text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">
                    ✏️
                  </span>
                  <span className="transition-all duration-300 group-hover:tracking-wide">
                    Manage Proposals
                  </span>
                </Link>

                <Link
                  to="/student/project-status"
                  className="group flex items-center justify-center gap-3 w-full py-4 px-6 text-center text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-300 no-underline font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                    📄
                  </span>
                  <span className="transition-all duration-300 group-hover:tracking-wide">
                    View Proposals
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Notification Center */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🔔 Notification Center
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Reminder:</strong> Regular progress updates help
                maintain project momentum. Consider submitting a log if you
                haven't done so recently.
              </p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Check with your supervisor regularly for
                feedback and guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectWork;
