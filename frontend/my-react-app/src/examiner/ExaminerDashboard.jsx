import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as ExaminerAPI from "../API/ExaminerAPI";
import { useAuth } from "../contexts/AuthContext";

const ExaminerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [projectsToExamine, setProjectsToExamine] = useState([]);
  const [examinerProfile, setExaminerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    loadAssignedProjects();
    loadExaminerProfile();
  }, []);

  const loadExaminerProfile = async () => {
    try {
      if (!user?.id) {
        return;
      }
      const response = await ExaminerAPI.getExaminerProfile(user.id);
      if (response.success) {
        setExaminerProfile(response.profile);
      }
    } catch (error) {
      console.error("Error loading examiner profile:", error);
    }
  };

  const loadAssignedProjects = async () => {
    try {
      if (!user?.id) {
        setError("User not found. Please log in again.");
        return;
      }

      setLoading(true);
      const response = await ExaminerAPI.getAssignedProjects(user.id);
      if (response.success) {
        const map = new Map(
          response.projects.map((item) => [item.project_id, item])
        );
        response.projects = Array.from(map.values());

        console.log("Assigned projects loaded:", response.projects);
        setProjectsToExamine(response.projects || []);
      } else {
        setError(response.error || "Failed to load assigned projects");
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setError("Error loading assigned projects");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };
  const handleMarkProject = async (projectId) => {
    try {
      const project = projectsToExamine.find((p) => p.project_id === projectId);
      if (!project) {
        setError("Project not found");
        return;
      }

      const newStatus =
        project.status === "Evaluated" ? "Pending" : "Evaluated";

      const response = await ExaminerAPI.updateProjectStatus(
        user.id,
        projectId,
        newStatus
      );

      if (response.success) {
        setProjectsToExamine((projects) =>
          projects.map((proj) =>
            proj.project_id === projectId
              ? { ...proj, status: newStatus }
              : proj
          )
        );
      } else {
        setError(response.error || "Failed to update project status");
      }
    } catch (error) {
      console.error("Error updating project status:", error);
      setError("Failed to update project status");
    }
  };
  const completedCount = projectsToExamine.filter(
    (p) => p.status === "Evaluated"
  ).length;
  const pendingCount = projectsToExamine.length - completedCount;
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
                <h1 className="text-xl font-bold">Examiner Dashboard</h1>
                <p className="text-indigo-100 text-sm">
                  Project Examination Portal
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/examiner/dashboard"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Dashboard
              </Link>
              <span className="text-white/90 font-medium">
                Assigned Projects
              </span>
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

      {/* Enhanced Examiner Info Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-inner">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-white/20 rounded">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-gray-300 text-xs">Examiner</div>
                <div className="font-medium">
                  {examinerProfile?.name || user?.name || "Loading..."}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-white/20 rounded">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <div className="text-gray-300 text-xs">Department</div>
                <div className="font-medium">
                  {examinerProfile?.department || "Faculty of Engineering"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-500/20 rounded">
                <svg
                  className="w-4 h-4 text-blue-300"
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
                <div className="text-gray-300 text-xs">Total Projects</div>
                <div className="font-bold text-blue-300">
                  {projectsToExamine.length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-green-500/20 rounded">
                <svg
                  className="w-4 h-4 text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-gray-300 text-xs">Evaluated</div>
                <div className="font-bold text-green-300">{completedCount}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-orange-500/20 rounded">
                <svg
                  className="w-4 h-4 text-orange-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-gray-300 text-xs">Pending</div>
                <div className="font-bold text-orange-300">{pendingCount}</div>
              </div>
            </div>
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-indigo-900">
                Projects to Examine
              </h2>
              <p className="text-indigo-700 text-sm mt-1">
                Review assigned projects and update examination status
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Projects Table */}
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
                    Assignment Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Exam Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-3">
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
                          Loading assigned projects...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <svg
                            className="w-6 h-6 text-red-600"
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
                        <span className="text-red-700 font-medium">
                          {error}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : projectsToExamine.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Projects Assigned
                      </h3>
                      <p className="text-gray-600">
                        No projects have been assigned for examination yet.
                      </p>
                    </td>
                  </tr>
                ) : (
                  projectsToExamine.map((project, index) => (
                    <tr
                      key={project.project_id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } ${
                        project.status === "Evaluated" ? "bg-green-50/50" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <Link
                          to={`/examiner/project/${project.project_id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors no-underline"
                        >
                          {project.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">
                          {project.student_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            project.status === "Pending"
                              ? "bg-orange-100 text-orange-800"
                              : project.status === "Evaluated"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {project.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            project.status === "Evaluated"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {project.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleMarkProject(project.project_id)}
                          className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 ${
                            project.status === "Evaluated"
                              ? "bg-gray-600 hover:bg-gray-700 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {project.status === "Evaluated" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            )}
                          </svg>
                          <span className="transition-all duration-300 group-hover:tracking-wide">
                            {project.status === "Evaluated"
                              ? "Mark Pending"
                              : "Mark as Evaluated"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Progress Summary */}
        {projectsToExamine.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-blue-900">
                Examination Progress
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {completedCount}
                    </div>
                    <div className="text-sm text-green-700 font-medium">
                      Evaluated
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <svg
                      className="w-5 h-5 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {pendingCount}
                    </div>
                    <div className="text-sm text-orange-700 font-medium">
                      Pending
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(
                        (completedCount / projectsToExamine.length) * 100
                      )}
                      %
                    </div>
                    <div className="text-sm text-blue-700 font-medium">
                      Complete
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExaminerDashboard;
