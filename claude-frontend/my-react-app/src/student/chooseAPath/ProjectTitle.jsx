
import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { selectProject } from "../../API/StudentAPI";

const ProjectTitle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Project data from URL parameters
  const [projectData, setProjectData] = useState({
    id: "",
    title: "",
    supervisor: "",
    specialization: "",
    type: "",
    description: ""
  });

  useEffect(() => {
    // Get project data from URL parameters
    const id = searchParams.get("id") || "";
    const title = searchParams.get("title") || "Unknown Project";
    const supervisor = searchParams.get("supervisor") || "Unknown Supervisor";
    const specialization = searchParams.get("specialization") || "";
    const type = searchParams.get("type") || "";
    const description = searchParams.get("description") || "";

    setProjectData({
      id,
      title,
      supervisor,
      specialization,
      type,
      description
    });

    // If no project ID, redirect back
    if (!id) {
      console.log("No project ID found, redirecting...");
      navigate("/student/select-title");
    }
  }, [searchParams, navigate]);

  const handleApply = async () => {
    if (!user?.id || !projectData.id) {
      setError("User or project information is missing");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await selectProject(user.id, projectData.id);

      if (response.success) {
        setSuccessMessage("Project application submitted successfully!");
        // Navigate to project status after a brief delay
        setTimeout(() => {
          navigate("/student/project-status");
        }, 2000);
      } else {
        setError(response.error || "Failed to apply for project");
      }
    } catch (error) {
      console.error("Error applying for project:", error);
      setError("Failed to apply for project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getProjectDifficulty = () => {
    // Determine difficulty based on specialization or type
    if (projectData.specialization?.toLowerCase().includes("machine learning") || 
        projectData.specialization?.toLowerCase().includes("ai")) {
      return "Advanced";
    } else if (projectData.type?.toLowerCase().includes("research")) {
      return "Intermediate to Advanced";
    } else {
      return "Intermediate";
    }
  };

  const getEstimatedDuration = () => {
    return "2 Semesters"; // Standard FYP duration
  };

  const getPrerequisites = () => {
    const specialization = projectData.specialization?.toLowerCase() || "";
    const title = projectData.title?.toLowerCase() || "";
    
    if (specialization.includes("machine learning") || title.includes("ml") || title.includes("ai")) {
      return "Data Structures, Statistics, Programming (Python/R)";
    } else if (specialization.includes("web") || title.includes("web")) {
      return "Web Development, Database Systems, Programming";
    } else if (specialization.includes("mobile") || title.includes("mobile") || title.includes("app")) {
      return "Mobile Development, Programming, UI/UX Design";
    } else if (specialization.includes("security") || title.includes("security")) {
      return "Network Security, Cryptography, Programming";
    } else {
      return "Data Structures, Programming, Software Engineering";
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
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
              <h1 className="text-xl font-bold">Project Details</h1>
              <p className="text-indigo-100 text-sm">
                Review project information before applying
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto mt-8 p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/student/select-title"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors no-underline"
          >
            <svg
              className="w-5 h-5"
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
            Back to Project Selection
          </Link>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-green-700 font-medium">
                {successMessage}
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-2"
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
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Project Information Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Project Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {projectData.title}
            </h2>
            <p className="text-lg text-gray-600">
              <span className="font-semibold">Supervisor:</span> {projectData.supervisor}
            </p>
          </div>

          <div className="p-6">
            {/* Project Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Project Description
              </h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {projectData.description || 
                    `This project, "${projectData.title}", will involve comprehensive research, design, implementation, and testing phases. Students will work closely with the supervisor to develop a solution that meets academic and industry standards. The project will require strong analytical skills, programming expertise, and the ability to work independently while maintaining regular communication with the supervisor.`
                  }
                </p>
              </div>
            </div>

            {/* Project Details Grid */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Project Details
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-blue-800">Duration</span>
                  </div>
                  <p className="text-blue-700">{getEstimatedDuration()}</p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-semibold text-green-800">Type</span>
                  </div>
                  <p className="text-green-700">{projectData.type || "Individual Project"}</p>
                </div>

                {projectData.specialization && (
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      <span className="font-semibold text-purple-800">Specialization</span>
                    </div>
                    <p className="text-purple-700">{projectData.specialization}</p>
                  </div>
                )}

                <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-semibold text-orange-800">Difficulty</span>
                  </div>
                  <p className="text-orange-700">{getProjectDifficulty()}</p>
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Prerequisites & Requirements
              </h3>
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div>
                    <span className="font-semibold text-yellow-800 block mb-2">Recommended Prerequisites:</span>
                    <p className="text-yellow-700">{getPrerequisites()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-gray-200">
              <button
                onClick={handleApply}
                disabled={loading}
                className="group flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting Application...
                  </>
                ) : (
                  <>
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Apply for this Project
                  </>
                )}
              </button>

              <Link
                to="/student/select-title"
                className="group flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 no-underline"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Project Selection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTitle;