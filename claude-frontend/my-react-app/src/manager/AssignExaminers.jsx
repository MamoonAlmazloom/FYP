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
        setProjects(projectsResponse.projects);
      }

      if (examinersResponse.success) {
        setExaminers(examinersResponse.examiners);
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
          Assign Examiners
        </h2>
        <p className="mb-6 text-center">
          Select an examiner for each approved project.
        </p>

        {/* Project Summary */}
        {!loading && projects.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              📊 Assignment Overview
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white p-3 rounded">
                <div className="text-2xl font-bold text-blue-600">
                  {projects.length}
                </div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
              <div className="bg-white p-3 rounded">
                <div className="text-2xl font-bold text-green-600">
                  {projects.filter((p) => p.examiner_name).length}
                </div>
                <div className="text-sm text-gray-600">Assigned</div>
              </div>
              <div className="bg-white p-3 rounded">
                <div className="text-2xl font-bold text-orange-600">
                  {projects.filter((p) => !p.examiner_name).length}
                </div>
                <div className="text-sm text-gray-600">Unassigned</div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p>Loading projects and examiners...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mt-5">
              <thead>
                <tr>
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
                    Current Examiner
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Assign Examiner
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="border border-gray-300 p-3 text-center"
                    >
                      No approved projects found
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
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
                        {project.examiner_name ? (
                          <div className="space-y-1">
                            <div className="font-medium text-green-800">
                              {project.examiner_name}
                            </div>
                            <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full inline-block">
                              {project.assignment_status || "Assigned"}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-gray-500 font-medium">
                              Not assigned
                            </div>
                            <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full inline-block">
                              Unassigned
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-300 p-3 text-left">
                        <select
                          value={project.selected_examiner_id || ""}
                          onChange={(e) =>
                            handleExaminerChange(
                              project.project_id,
                              e.target.value
                            )
                          }
                          className="w-full p-2 rounded border border-gray-300"
                        >
                          <option value="">Select Examiner</option>
                          {examiners.map((examiner) => (
                            <option
                              key={examiner.user_id}
                              value={examiner.user_id}
                            >
                              {examiner.name}
                            </option>
                          ))}
                        </select>
                      </td>{" "}
                      <td className="border border-gray-300 p-3 text-left">
                        <button
                          onClick={() => handleAssign(project.project_id)}
                          disabled={assigning || !project.selected_examiner_id}
                          className={`px-4 py-2 text-white border-none rounded cursor-pointer text-sm ${
                            assigning
                              ? "bg-gray-400 cursor-not-allowed"
                              : !project.selected_examiner_id
                              ? "bg-gray-300 cursor-not-allowed"
                              : project.examiner_name
                              ? "bg-orange-600 hover:bg-orange-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {assigning
                            ? "Assigning..."
                            : project.examiner_name
                            ? "Reassign"
                            : "Assign"}
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
            ← Back to Manager Dashboard{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AssignExaminers;
