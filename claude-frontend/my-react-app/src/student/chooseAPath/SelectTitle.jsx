import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  getAvailableProjects,
  selectProject,
  getActiveProject,
} from "../../API/StudentAPI";

const SelectTitle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectingProject, setSelectingProject] = useState(null);
  const [hasActiveProject, setHasActiveProject] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [checkingActiveProject, setCheckingActiveProject] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState("");
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
  }, [user]);  const handleSelectProject = async (projectId) => {
    try {
      setSelectingProject(projectId);

      // Find the project title for display
      const selectedProject = projects.find((p) => p.project_id === projectId);
      const projectTitle = selectedProject?.title || "Unknown Project";

      const response = await selectProject(user.id, projectId);

      if (response.success) {
        setSelectedProjectTitle(projectTitle);
        setShowSuccessModal(true);
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

  const handleViewProjectDetails = (project) => {
    // Navigate to project details page with project information
    const params = new URLSearchParams({
      id: project.project_id,
      title: project.title || "Unknown Project",
      supervisor: project.supervisor_name || "Unknown Supervisor",
      specialization: project.specialization || "",
      type: project.type || "",
      description: project.description || ""
    });
    navigate(`/student/project-title?${params.toString()}`);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Navigate to project status page after a short delay to allow modal close animation
    setTimeout(() => {
      window.location.href = "/student/project-status";
    }, 300);
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
                    <p className="text-gray-600 mb-3">{project.description}</p>{" "}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>
                        <strong>Supervisor:</strong>{" "}
                        {project.supervisor_name || "N/A"}
                      </span>
                      {project.type && (
                        <span>
                          <strong>Type:</strong> {project.type}
                        </span>
                      )}
                      {project.specialization && (
                        <span>
                          <strong>Specialization:</strong>{" "}
                          {project.specialization}
                        </span>
                      )}
                    </div>                  </div>{" "}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewProjectDetails(project)}
                      className="group px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    >
                      <span className="transition-all duration-300 group-hover:tracking-wide">
                        View Details
                      </span>
                    </button>
                    <button
                      onClick={() => handleSelectProject(project.project_id)}
                      disabled={selectingProject === project.project_id}
                      className={`group px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 ${
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
                          Apply Now
                        </span>
                      )}
                    </button>
                  </div>
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

      {/* Enhanced Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-scale-in">
            {/* Success Animation Background */}
            <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 p-8 text-center">
              {/* Animated Circles */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-4 left-4 w-8 h-8 bg-white bg-opacity-20 rounded-full animate-bounce-slow"></div>
                <div className="absolute top-8 right-8 w-4 h-4 bg-white bg-opacity-30 rounded-full animate-bounce-delayed"></div>
                <div className="absolute bottom-6 left-1/3 w-6 h-6 bg-white bg-opacity-25 rounded-full animate-bounce-extra-slow"></div>
              </div>

              {/* Main Success Icon */}
              <div className="relative">
                <div className="mx-auto mb-4 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce-once">
                  <svg
                    className="w-12 h-12 text-green-500 animate-check-draw"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                      style={{
                        strokeDasharray: "24",
                        strokeDashoffset: "24",
                        animation: "draw-check 0.6s ease-in-out 0.3s forwards",
                      }}
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 animate-slide-up">
                  🎉 Application Submitted!
                </h2>
                <p className="text-green-50 text-lg animate-slide-up-delayed">
                  Your request is on its way!
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4">
              {/* Project Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
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
                  Selected Project
                </h3>
                <p className="text-gray-700 font-medium">
                  {selectedProjectTitle}
                </p>
              </div>

              {/* Success Message */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-2 text-gray-700">
                  <svg
                    className="w-5 h-5 text-orange-500"
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
                  <span className="text-sm font-medium">
                    Your application has been sent to the supervisor
                  </span>
                </div>

                <div className="flex items-center justify-center space-x-2 text-gray-700">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L16 4"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    You'll be notified once it's reviewed
                  </span>
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Next steps:</strong> Check your project status
                    regularly for updates from your supervisor.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleCloseSuccessModal}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-200"
                >
                  View Project Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-once {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes bounce-delayed {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes bounce-extra-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-up-delayed {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes draw-check {
          to {
            stroke-dashoffset: 0;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
        .animate-bounce-once {
          animation: bounce-once 1s ease-in-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-bounce-delayed {
          animation: bounce-delayed 2s ease-in-out infinite 0.3s;
        }
        .animate-bounce-extra-slow {
          animation: bounce-extra-slow 2s ease-in-out infinite 0.6s;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }
        .animate-slide-up-delayed {
          animation: slide-up-delayed 0.6s ease-out 0.4s both;
        }
        .animate-check-draw {
          animation: draw-check 0.6s ease-in-out 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export default SelectTitle;
