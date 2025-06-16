import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ExaminerAPI from "../API/ExaminerAPI";

const ExaminerDashboard = () => {
  const navigate = useNavigate();
  const [projectsToExamine, setProjectsToExamine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const examinerId = userData.id;

  useEffect(() => {
    loadAssignedProjects();
  }, []);

  const loadAssignedProjects = async () => {
    try {
      setLoading(true);
      const response = await ExaminerAPI.getAssignedProjects(examinerId);
      if (response.success) {
        setProjectsToExamine(response.projects);
      } else {
        setError("Failed to load assigned projects");
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setError("Error loading assigned projects");
    } finally {
      setLoading(false);
    }
  };
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleMarkProject = async (projectId) => {
    try {
      const project = projectsToExamine.find((p) => p.project_id === projectId);
      const newStatus =
        project.status === "Completed" ? "Pending" : "Completed";

      const response = await ExaminerAPI.updateProjectStatus(
        examinerId,
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
      }
    } catch (error) {
      console.error("Error updating project status:", error);
      setError("Failed to update project status");
    }
  };

  const completedCount = projectsToExamine.filter(
    (p) => p.status === "Completed"
  ).length;
  const pendingCount = projectsToExamine.length - completedCount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-gray-800 text-white flex justify-between items-center px-5 py-4">
        <div className="text-xl font-bold">📑 Examiner Dashboard</div>
        <div className="flex-grow text-center">
          <Link
            to="/examiner/dashboard"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Home
          </Link>
          <Link
            to="#"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Assigned Projects
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

      {/* Examiner Info Header */}
      <div className="bg-gray-600 text-white px-4 py-4 text-base flex justify-around flex-wrap text-center">
        <span>
          <strong>Examiner Name:</strong> Dr. Robert Brown
        </span>
        <span>
          <strong>Department:</strong> Faculty of Engineering
        </span>
        <span>
          <strong>Total Projects:</strong> {projectsToExamine.length}
        </span>
        <span>
          <strong>Completed:</strong> {completedCount}
        </span>
        <span>
          <strong>Pending:</strong> {pendingCount}
        </span>
      </div>

      <div className="max-w-6xl mx-auto mt-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Projects to Examine</h2>
        <p className="mb-6">
          Review the examination schedule for assigned projects and mark them as
          completed.
        </p>

        {/* Projects to Examine Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-5">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Project Title
                </th>{" "}
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Student Name
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Assignment Status
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Examination Date
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Venue
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Status
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Action
                </th>
              </tr>
            </thead>{" "}
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="border border-gray-300 p-6 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                      Loading assigned projects...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="7"
                    className="border border-gray-300 p-6 text-center text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              ) : projectsToExamine.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="border border-gray-300 p-6 text-center text-gray-600"
                  >
                    No projects assigned for examination yet.
                  </td>
                </tr>
              ) : (
                projectsToExamine.map((project) => (
                  <tr
                    key={project.project_id}
                    className={
                      project.status === "Completed" ? "bg-green-50" : ""
                    }
                  >
                    <td className="border border-gray-300 p-3 text-left">
                      {project.title}
                    </td>{" "}
                    <td className="border border-gray-300 p-3 text-left">
                      {project.student_name}
                    </td>
                    <td className="border border-gray-300 p-3 text-left">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          project.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : project.status === "Evaluated"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.status || "Pending"}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-3 text-left">
                      {project.examination_date
                        ? new Date(
                            project.examination_date
                          ).toLocaleDateString()
                        : "TBA"}
                    </td>
                    <td className="border border-gray-300 p-3 text-left">
                      {project.venue || "TBA"}
                    </td>
                    <td className="border border-gray-300 p-3 text-left">
                      <span
                        className={`px-2 py-1 rounded text-sm font-bold ${
                          project.status === "Completed"
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {project.status || "Pending"}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-3 text-left">
                      <button
                        onClick={() => handleMarkProject(project.project_id)}
                        className={`px-3 py-2 border-none rounded cursor-pointer text-sm font-medium ${
                          project.status === "Completed"
                            ? "bg-gray-500 text-white hover:bg-gray-600"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {project.status === "Completed"
                          ? "Mark Pending"
                          : "Mark as Done"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {projectsToExamine.length === 0 && (
          <div className="mt-8 text-gray-600">
            <p>No projects assigned for examination at this time.</p>
          </div>
        )}

        {/* Summary Section */}
        {projectsToExamine.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Examination Progress</h3>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {completedCount}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingCount}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    (completedCount / projectsToExamine.length) * 100
                  )}
                  %
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExaminerDashboard;
