import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  getAvailableProjects,
  selectProject,
  getActiveProject,
} from "../../API/StudentAPI";

const SelectTitle = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectingProject, setSelectingProject] = useState(null);
  const [hasActiveProject, setHasActiveProject] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [checkingActiveProject, setCheckingActiveProject] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) {
          setError("User not found. Please log in again.");
          return;
        }

        // Check for active project first
        setCheckingActiveProject(true);
        const activeProjectResponse = await getActiveProject(user.id);
        if (activeProjectResponse.success) {
          setHasActiveProject(activeProjectResponse.hasActiveProject);
          setActiveProject(activeProjectResponse.activeProject);
        }
        setCheckingActiveProject(false);

        // Only fetch available projects if no active project
        if (!activeProjectResponse.hasActiveProject) {
          setLoading(true);
          const response = await getAvailableProjects(user.id);

          if (response.success) {
            console.log("Available projects:", response.projects);
            setProjects(response.projects || []);
          } else {
            setError(response.error || "Failed to load available projects");
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
        setCheckingActiveProject(false);
      }
    };

    fetchData();
  }, [user]);
  const handleSelectProject = async (projectId) => {
    try {
      setSelectingProject(projectId);

      const response = await selectProject(user.id, projectId);

      if (response.success) {
        alert(
          "Project application submitted successfully! Your request has been sent to the supervisor for approval. You will be notified once it is reviewed."
        );
        // Navigate to project status page to show pending proposal
        window.location.href = "/student/project-status";
      } else {
        alert(
          "Failed to select project: " + (response.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error selecting project:", error);
      alert("Failed to select project. Please try again.");
    } finally {
      setSelectingProject(null);
    }
  };

  if (checkingActiveProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking project status...</p>
        </div>
      </div>
    );
  }

  if (hasActiveProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <svg
                className="h-12 w-12 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              You Already Have an Active Project
            </h3>
            <p className="text-sm text-yellow-700 mb-4">
              You can only have one active project at a time.
            </p>
            <p className="text-sm text-yellow-700">
              Current project: <strong>{activeProject?.title}</strong>
            </p>
          </div>{" "}
          <div className="space-y-3">
            <Link
              to="/student/project-status"
              className="group block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 no-underline font-semibold text-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <span className="transition-all duration-300 group-hover:tracking-wide">
                View Current Project Status
              </span>
            </Link>
            <Link
              to="/student/choose-path"
              className="group block w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-300 no-underline font-semibold text-center shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Back to Select Path
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>{" "}
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/student/choose-path"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-lg transition-all duration-300 no-underline shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="transition-all duration-300 group-hover:tracking-wide">
              Back to Select Path
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Select a Project Title
        </h2>
        {projects.length === 0 ? (
          <div className="text-center py-8">
            {" "}
            <p className="text-gray-600 mb-6">
              No available projects at the moment.
            </p>{" "}
            <Link
              to="/student/propose-project"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-300 no-underline shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Propose Your Own Project
              </span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {projects.map((project) => (
              <div
                key={project.project_id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>
                        <strong>Supervisor:</strong>{" "}
                        {project.supervisor_name || "N/A"}
                      </span>
                      <span>
                        <strong>Type:</strong> {project.type || "N/A"}
                      </span>
                      <span>
                        <strong>Specialization:</strong>{" "}
                        {project.specialization || "N/A"}
                      </span>
                    </div>
                  </div>{" "}
                  <button
                    onClick={() => handleSelectProject(project.project_id)}
                    disabled={selectingProject === project.project_id}
                    className={`group ml-4 px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${
                      selectingProject === project.project_id
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                    }`}
                  >
                    {selectingProject === project.project_id ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Applying...
                      </div>
                    ) : (
                      <span className="transition-all duration-300 group-hover:tracking-wide">
                        Apply for Project
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}{" "}
        <div className="text-center">
          <Link
            to="/student/choose-path"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-lg transition-all duration-300 no-underline shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="transition-all duration-300 group-hover:tracking-wide">
              Back to Select Path
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SelectTitle;
