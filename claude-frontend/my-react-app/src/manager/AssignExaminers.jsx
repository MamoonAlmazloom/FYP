import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ManagerAPI from "../API/ManagerAPI";

const AssignExaminers = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [examiners, setExaminers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const managerId = userData.id;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load approved projects and examiners in parallel
      const [projectsResponse, examinersResponse] = await Promise.all([
        ManagerAPI.getApprovedProjects(managerId),
        ManagerAPI.getExaminers(managerId),
      ]);
      if (projectsResponse.success) {
        // Remove any potential duplicates based on project_id
        const uniqueProjects = projectsResponse.projects.filter(
          (project, index, self) =>
            index === self.findIndex((p) => p.project_id === project.project_id)
        );
        console.log(
          "Original projects:",
          projectsResponse.projects.length,
          "Unique projects:",
          uniqueProjects.length
        );
        setProjects(uniqueProjects);
      }

      if (examinersResponse.success) {
        // Remove any potential duplicates based on user_id
        const uniqueExaminers = examinersResponse.examiners.filter(
          (examiner, index, self) =>
            index === self.findIndex((e) => e.user_id === examiner.user_id)
        );
        console.log(
          "Original examiners:",
          examinersResponse.examiners.length,
          "Unique examiners:",
          uniqueExaminers.length
        );
        setExaminers(uniqueExaminers);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Error loading data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleExaminerChange = (projectId, examinerId) => {
    setProjects(
      projects.map((project) =>
        project.project_id === projectId
          ? { ...project, selected_examiner_id: examinerId }
          : project
      )
    );
  };
  const handleAssign = async (projectId) => {
    if (assigning) return; // Prevent multiple simultaneous assignments

    try {
      setAssigning(true);
      const project = projects.find((p) => p.project_id === projectId);

      if (!project.selected_examiner_id) {
        setError("Please select an examiner first");
        setAssigning(false);
        return;
      }

      console.log("Starting assignment:", {
        projectId,
        examinerId: project.selected_examiner_id,
        managerId,
      });

      setError(""); // Clear any previous errors
      setSuccess(""); // Clear any previous success messages

      const response = await ManagerAPI.assignExaminer(managerId, {
        project_id: projectId,
        examiner_id: project.selected_examiner_id,
      });

      console.log("Assignment response received:", response);
      if (response.success) {
        const wasReassignment = project.examiner_name ? true : false;
        const selectedExaminer = examiners.find(
          (e) => e.user_id == project.selected_examiner_id
        );
        const examinerName = selectedExaminer
          ? selectedExaminer.name
          : "examiner";

        setSuccess(
          wasReassignment
            ? `Successfully reassigned "${project.title}" to ${examinerName}`
            : `Successfully assigned "${project.title}" to ${examinerName}`
        );

        // Reload data to get updated assignments
        await loadData();
        setTimeout(() => setSuccess(""), 5000); // Show success for 5 seconds
      } else {
        console.log("Assignment failed:", response);
        setError(response.error || "Failed to assign examiner");
      }
    } catch (error) {
      console.error("Error assigning examiner:", error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "Error assigning examiner. Please try again."
      );
    } finally {
      setAssigning(false);
    }
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Assign Examiners</h1>
                <p className="text-indigo-100 text-sm">
                  Manage Project Examiner Assignments
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Assign Examiners
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage examiner assignments for approved final year projects.
              Select appropriate examiners for each project to ensure
              comprehensive evaluation.
            </p>
          </div>{" "}
          {/* Project Summary */}
          {!loading && projects.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
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
                <h3 className="text-xl font-bold text-blue-800">
                  Assignment Overview
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
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
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {projects.length}
                      </div>
                      <div className="text-sm font-medium text-gray-600">
                        Total Projects
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg
                        className="w-6 h-6 text-green-600"
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
                        {projects.filter((p) => p.examiner_name).length}
                      </div>
                      <div className="text-sm font-medium text-gray-600">
                        Assigned
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <svg
                        className="w-6 h-6 text-orange-600"
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
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {projects.filter((p) => !p.examiner_name).length}
                      </div>
                      <div className="text-sm font-medium text-gray-600">
                        Unassigned
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
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
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{success}</span>
              </div>
            </div>
          )}{" "}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-50 rounded-lg">
                <svg
                  className="animate-spin w-5 h-5 text-indigo-600"
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
                  Loading projects and examiners...
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Project ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Project Title
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Student Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Current Examiner
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Assign Examiner
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-3 text-gray-500">
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
                            <span className="text-lg font-medium">
                              No approved projects found
                            </span>
                            <span className="text-sm">
                              Projects will appear here once they are approved
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      projects.map((project, index) => (
                        <tr
                          key={`project-${project.project_id}-${index}`}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-indigo-50 transition-colors duration-200`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            #{project.project_id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="font-medium">{project.title}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="font-medium">
                              {project.student_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {project.examiner_name ? (
                              <div className="space-y-2">
                                <div className="font-medium text-green-800">
                                  {project.examiner_name}
                                </div>
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {project.assignment_status || "Assigned"}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="text-gray-500 font-medium">
                                  Not assigned
                                </div>
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  Unassigned
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <select
                              value={project.selected_examiner_id || ""}
                              onChange={(e) =>
                                handleExaminerChange(
                                  project.project_id,
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white text-sm"
                            >
                              {" "}
                              <option value="">Select Examiner</option>
                              {examiners.map((examiner, examinerIndex) => (
                                <option
                                  key={`examiner-${examiner.user_id}-${examinerIndex}`}
                                  value={examiner.user_id}
                                >
                                  {examiner.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleAssign(project.project_id)}
                              disabled={
                                assigning || !project.selected_examiner_id
                              }
                              className={`group inline-flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                                assigning
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : !project.selected_examiner_id
                                  ? "bg-gray-300 cursor-not-allowed"
                                  : project.examiner_name
                                  ? "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl"
                                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl"
                              }`}
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
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              <span className="transition-all duration-300 group-hover:tracking-wide">
                                {assigning
                                  ? "Assigning..."
                                  : project.examiner_name
                                  ? "Reassign"
                                  : "Assign"}
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

export default AssignExaminers;
