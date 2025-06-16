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
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-gray-800 text-white flex justify-between items-center px-5 py-4">
        <div className="text-xl font-bold">📊 Manager Dashboard</div>
        <div className="flex-grow text-center">
          <Link
            to="/manager/dashboard"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Home
          </Link>
          <Link
            to="#"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Students
          </Link>
          <Link
            to="#"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Moderation
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
