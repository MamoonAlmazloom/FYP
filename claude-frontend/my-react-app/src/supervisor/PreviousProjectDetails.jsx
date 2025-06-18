import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../API/authAPI";
import { getProjectDetails } from "../API/SupervisorAPI";

const PreviousProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }
        setUser(currentUser);

        if (!projectId) {
          navigate("/supervisor/previous-projects");
          return;
        }

        const response = await getProjectDetails(currentUser.id, projectId);
        if (response.success) {
          setProject(response.project);
        } else {
          setError(response.error || "Failed to load project details");
        }
      } catch (err) {
        console.error("Error loading project details:", err);
        setError("Failed to load project details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProjectDetails();
  }, [navigate, projectId]);
  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-blue-700 text-white flex justify-between items-center px-5 py-4">
        <div className="text-xl font-bold">📘 Supervisor Dashboard</div>
        <div className="flex-grow text-center">
          <Link
            to="/supervisor/dashboard"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Home
          </Link>{" "}
          <Link
            to="/supervisor/my-students"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Students
          </Link>
          <Link
            to="/supervisor/approved-projects-logs"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Logs
          </Link>
          <Link
            to="/supervisor/progress-reports"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Reports
          </Link>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 border-0 rounded text-sm cursor-pointer hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>{" "}
      <div className="max-w-4xl mx-auto my-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Previous Project Details
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {project ? (
          <>
            {/* Project Information */}
            <div className="bg-gray-50 p-4 rounded mb-4 text-left">
              <p className="mb-3">
                <strong>Project Title:</strong> {project.title}
              </p>
              <p className="mb-3">
                <strong>Student Name:</strong> {project.student_name}
              </p>
           
              <p className="mb-3">
                <strong>Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {project.status || "Completed"}
                </span>
              </p>
              {project.description && (
                <p className="mb-3">
                  <strong>Project Description:</strong> {project.description}
                </p>
              )}
              {project.objectives && (
                <p className="mb-3">
                  <strong>Objectives:</strong> {project.objectives}
                </p>
              )}
              {project.technologies && (
                <p className="mb-3">
                  <strong>Technologies Used:</strong> {project.technologies}
                </p>
              )}
              {project.outcome && (
                <p className="mb-0">
                  {" "}
                  <strong>Outcome:</strong> {project.outcome}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">Project not found</p>
            <p className="text-sm">
              The requested project details could not be loaded.
            </p>{" "}
          </div>
        )}

        <Link
          to="/supervisor/previous-projects"
          className="inline-block mt-5 no-underline text-blue-600 font-bold hover:text-blue-800"
        >
          ← Back to Previous Projects
        </Link>
      </div>
    </div>
  );
};

export default PreviousProjectDetails;
