import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ManagerAPI from "../API/ManagerAPI";

const ApprovedProjectsLogs = () => {
  const navigate = useNavigate();
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const managerId = userData.id;

  useEffect(() => {
    loadApprovedProjects();
  }, []);

  const loadApprovedProjects = async () => {
    try {
      setLoading(true);
      const response = await ManagerAPI.getApprovedProjects(managerId);

      if (response.success) {
        setApprovedProjects(response.projects);
      } else {
        setError("Failed to load approved projects");
      }
    } catch (error) {
      console.error("Error loading approved projects:", error);
      setError("Error loading approved projects. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleViewLog = (projectId, projectTitle, studentName) => {
    navigate(
      `/manager/view-project-log/${projectId}?title=${encodeURIComponent(
        projectTitle
      )}&student=${encodeURIComponent(studentName)}`
    );
  };

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
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Manager Dashboard</h1>
                <p className="text-indigo-100 text-sm">
                  Final Year Project Management
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/manager/dashboard"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Home
              </Link>
              <Link
                to="/manager/manage-users"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Users
              </Link>
              <Link
                to="/manager/assign-examiners"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Examiners
              </Link>
              <Link
                to="/manager/previous-projects"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Archive
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
      </div>{" "}
      <div className="max-w-4xl mx-auto mt-5 p-5 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Approved Proposed Projects Logs
        </h2>
        <p className="mb-6 text-center">
          Review logs of approved proposed projects.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p>Loading approved projects...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mt-5">
              <thead>
                <tr>
                  {" "}
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Project ID
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Project Title
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Student Name
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Supervisor
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Examiner
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {approvedProjects.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="border border-gray-300 p-3 text-center"
                    >
                      No approved projects found
                    </td>
                  </tr>
                ) : (
                  approvedProjects.map((project) => (
                    <tr key={project.project_id}>
                      <td className="border border-gray-300 p-3 text-left">
                        {project.project_id}
                      </td>
                      <td className="border border-gray-300 p-3 text-left">
                        {project.title}
                      </td>
                      <td className="border border-gray-300 p-3 text-left">
                        {project.student_name}
                      </td>{" "}
                      <td className="border border-gray-300 p-3 text-left">
                        {project.supervisor_name}
                      </td>
                      <td className="border border-gray-300 p-3 text-left">
                        {project.examiner_name || "Not assigned"}
                      </td>
                      <td className="border border-gray-300 p-3 text-left">
                        <button
                          onClick={() =>
                            handleViewLog(
                              project.project_id,
                              project.title,
                              project.student_name
                            )
                          }
                          className="px-3 py-2 bg-cyan-600 text-white border-none rounded cursor-pointer text-sm no-underline hover:bg-cyan-700"
                        >
                          View Log
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-center mt-6">
          <Link
            to="/manager/dashboard"
            className="inline-block text-blue-600 font-bold no-underline hover:text-blue-800"
          >
            ← Back to Manager Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApprovedProjectsLogs;
