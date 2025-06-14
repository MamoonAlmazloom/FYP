import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getStudentProfile, getStudentProjects } from "../API/StudentAPI";
import { logout } from "../API/authAPI";

const ProjectWork = () => {
  const { user, logout: contextLogout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (!user?.id) {
          setError('User not found. Please log in again.');
          return;
        }

        setLoading(true);

        // Fetch student profile and projects
        const [profileResponse, projectsResponse] = await Promise.all([
          getStudentProfile(user.id),
          getStudentProjects(user.id)
        ]);

        if (profileResponse.success) {
          setProfile(profileResponse.student);
        } else {
          console.error('Failed to load profile:', profileResponse.error);
        }

        if (projectsResponse.success) {
          setProjects(projectsResponse.projects || []);
        } else {
          console.error('Failed to load projects:', projectsResponse.error);
        }

      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  const handleSignOut = () => {
    logout();
    contextLogout();
    window.location.href = '/login';
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
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleSignOut}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Sign Out and Retry
          </button>
        </div>
      </div>
    );
  }

  // If no projects, redirect to choose path
  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            No Active Projects
          </h2>
          <p className="text-gray-600 mb-8">
            You don't have any active projects yet. Please select or propose a project first.
          </p>
          <Link
            to="/student/choose-path"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
          >
            Choose Your Path
          </Link>
        </div>
      </div>
    );
  }

  const currentProject = projects[0]; // Assuming student has one active project

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-blue-700 text-white flex justify-between items-center px-5 py-4">
        <div className="text-xl font-bold">📘 FYP Portal</div>
        <div className="flex-grow text-center">
          <Link
            to="/student/project-work"
            className="text-white no-underline mx-4 font-bold hover:underline"
          >
            Dashboard
          </Link>
          <Link
            to="/student/choose-path"
            className="text-white no-underline mx-4 font-bold hover:underline"
          >
            Projects
          </Link>
          <Link
            to="/student/resources"
            className="text-white no-underline mx-4 font-bold hover:underline"
          >
            Help
          </Link>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Student Info Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm md:text-base">
            <div className="text-center md:text-left">
              <strong>Student Name:</strong> 
              <br className="md:hidden" />
              <span className="ml-2 md:ml-1">{profile?.name || user?.name || 'N/A'}</span>
            </div>
            <div className="text-center md:text-left">
              <strong>Student ID:</strong> 
              <br className="md:hidden" />
              <span className="ml-2 md:ml-1">{profile?.user_id || user?.id || 'N/A'}</span>
            </div>
            <div className="text-center md:text-left">
              <strong>Supervisor:</strong> 
              <br className="md:hidden" />
              <span className="ml-2 md:ml-1">{currentProject?.supervisor_name || 'N/A'}</span>
            </div>
            <div className="text-center md:text-left">
              <strong>Project:</strong> 
              <br className="md:hidden" />
              <span className="ml-2 md:ml-1">{currentProject?.title || 'N/A'}</span>
            </div>
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
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <strong>Type:</strong> {currentProject?.type || 'N/A'}
              </div>
              <div>
                <strong>Status:</strong> 
                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                  currentProject?.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {currentProject?.status || 'Active'}
                </span>
              </div>
              <div>
                <strong>Start Date:</strong> 
                {currentProject?.start_date ? 
                  new Date(currentProject.start_date).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Project Work Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Project Work
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/student/progress-log-form"
              className="block w-full py-4 px-6 text-center text-white bg-red-800 hover:bg-red-900 rounded-lg transition-colors duration-200 no-underline font-semibold"
            >
              📝 Submit Progress Log
            </Link>

            <Link
              to="/student/select-log"
              className="block w-full py-4 px-6 text-center text-white bg-red-800 hover:bg-red-900 rounded-lg transition-colors duration-200 no-underline font-semibold"
            >
              👁️ View Progress Logs
            </Link>

            <Link
              to="/student/progress-report-form"
              className="block w-full py-4 px-6 text-center text-white bg-red-800 hover:bg-red-900 rounded-lg transition-colors duration-200 no-underline font-semibold"
            >
              📊 Submit Progress Report
            </Link>

            <Link
              to="/student/select-report"
              className="block w-full py-4 px-6 text-center text-white bg-red-800 hover:bg-red-900 rounded-lg transition-colors duration-200 no-underline font-semibold"
            >
              📋 View Progress Reports
            </Link>

            <Link
              to="/student/modify-proposal"
              className="block w-full py-4 px-6 text-center text-white bg-red-800 hover:bg-red-900 rounded-lg transition-colors duration-200 no-underline font-semibold"
            >
              ✏️ Modify Proposal
            </Link>

            <Link
              to="/student/view-proposal"
              className="block w-full py-4 px-6 text-center text-white bg-red-800 hover:bg-red-900 rounded-lg transition-colors duration-200 no-underline font-semibold"
            >
              📄 View Proposal
            </Link>
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
                <strong>Reminder:</strong> Regular progress updates help maintain project momentum. 
                Consider submitting a log if you haven't done so recently.
              </p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Check with your supervisor regularly for feedback and guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectWork;
