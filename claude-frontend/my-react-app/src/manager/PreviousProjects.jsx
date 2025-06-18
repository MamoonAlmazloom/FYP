import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ManagerAPI from "../API/ManagerAPI";

const PreviousProjects = () => {
  const navigate = useNavigate();
  const [previousProjects, setPreviousProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const managerId = userData?.id;

  useEffect(() => {
    const fetchPreviousProjects = async () => {
      try {
        setLoading(true);
        setError("");

        if (!managerId) {
          throw new Error("Manager ID not found. Please login again.");
        }

        const response = await ManagerAPI.getPreviousProjects(managerId);

        if (response.success) {
          console.log("Previous projects loaded:", response.projects);
          // Transform API data to match component structure
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
        } else {
          throw new Error("Failed to fetch previous projects");
        }
      } catch (err) {
        console.error("Error fetching previous projects:", err);
        setError(err.message || "Failed to load previous projects");
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousProjects();
  }, [managerId]);

  const handleSignOut = () => {
    navigate("/login");
  };
  const handleViewProject = (project) => {
    navigate(
      `/manager/previous-project-details?title=${encodeURIComponent(
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
                to="/manager/dashboard"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Dashboard
              </Link>
              <Link
                to="/manager/manage-users"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Manage Users
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Previous Projects Archive
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse and review completed final year projects that have been
              evaluated and archived in the system.
            </p>
          </div>{" "}
          {error && (
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
                <div>
                  <strong className="font-semibold">Error:</strong>
                  <span className="ml-1">{error}</span>
                </div>
              </div>
            </div>
          )}
          {previousProjects.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4 text-gray-500">
                <div className="p-4 bg-gray-100 rounded-full">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No Previous Projects Found
                  </h3>
                  <p className="text-gray-600">
                    Projects will appear here once examiners mark them as
                    "Evaluated".
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Check back later for completed project records.
                  </p>
                </div>
              </div>
            </div>
          )}{" "}
          {/* Previous Projects Table */}
          {previousProjects.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Project Title
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Student Name
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
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {previousProjects.map((project, index) => (
                      <tr
                        key={project.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-indigo-50 transition-colors duration-200`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {project.title}
                          </div>
                          {project.description && (
                            <div className="text-sm text-gray-600 mt-1 max-w-md">
                              {project.description.length > 100
                                ? `${project.description.substring(0, 100)}...`
                                : project.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {project.studentName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {project.supervisorName || (
                            <span className="text-gray-400 italic">
                              Not assigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {project.examinerName || (
                            <span className="text-gray-400 italic">
                              Not assigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleViewProject(project)}
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
          <div className="text-center mt-8">
            <Link
              to="/manager/dashboard"
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

export default PreviousProjects;
