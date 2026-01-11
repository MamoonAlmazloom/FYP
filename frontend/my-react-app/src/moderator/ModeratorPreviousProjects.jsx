import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPreviousProjects } from "../API/ModeratorAPI";

const ModeratorPreviousProjects = () => {
  const navigate = useNavigate();
  const [previousProjects, setPreviousProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userData = JSON.parse(localStorage.getItem("user"));
  const moderatorId = userData?.id;

  useEffect(() => {
    const fetchPreviousProjects = async () => {
      try {
        setLoading(true);
        const response = await getPreviousProjects(moderatorId);

        if (response.success) {
          const transformedProjects = response.projects.map((project) => ({
            id: project.id,
            title: project.title,
            studentName: project.student_name,
            supervisorName: project.supervisor_name,
            examinerName: project.examiner_name,
            status: project.examination_status,
            description: project.description,
          }));
          setPreviousProjects(transformedProjects);
        }
      } catch (err) {
        setError("Failed to load previous projects");
      } finally {
        setLoading(false);
      }
    };

    if (moderatorId) fetchPreviousProjects();
  }, [moderatorId]);

  const handleSignOut = () => {
    navigate("/login");
  };
  const handleViewProject = (project) => {
    navigate(
      `/moderator/previous-project-details?title=${encodeURIComponent(
        project.title
      )}&student=${encodeURIComponent(project.studentName)}&id=${project.id}`
    );
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-lg shadow-lg">
            <svg
              className="animate-spin w-6 h-6 text-indigo-600"
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
              Loading previous projects...
            </span>
          </div>
        </div>
      </div>
    );
  }

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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Previous Projects</h1>
                <p className="text-indigo-100 text-sm">
                  Archive of Completed Projects
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Enhanced Info Banner */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-indigo-900">
                Previous Projects Archive
              </h2>
              <p className="text-indigo-700 text-sm mt-1">
                Browse through completed projects and their examination results
              </p>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-red-100 rounded-lg">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {previousProjects.length === 0 && !loading && !error && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Previous Projects
            </h3>
            <p className="text-gray-600">
              There are no completed projects to display at this time.
            </p>
          </div>
        )}

        {/* Enhanced Projects Table */}
        {previousProjects.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Project Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Supervisor
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Examiner
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {previousProjects.map((project, index) => (
                    <tr
                      key={project.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {project.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">
                          {project.studentName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600">
                          {project.supervisorName || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600">
                          {project.examinerName || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewProject(project)}
                          className="group flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
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
                            View Details
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Enhanced Footer Navigation */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/moderator/dashboard"
            className="group flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 no-underline"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
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
  );
};

export default ModeratorPreviousProjects;
