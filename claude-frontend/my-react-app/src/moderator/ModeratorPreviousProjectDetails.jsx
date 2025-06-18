import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const ModeratorPreviousProjectDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [projectDetails, setProjectDetails] = useState({
    title: "",
    studentName: "",
    year: "",
    summary: "",
    technologies: "",
    outcome: "",
  });

  useEffect(() => {
    // Get project details from URL parameters
    const title = searchParams.get("title") || "Unknown Title";
    const studentName = searchParams.get("student") || "Unknown Student";
    const year = searchParams.get("year") || "Unknown Year";

    // In a real app, you would fetch project details from API based on the parameters
    setProjectDetails({
      title,
      studentName,
      year,
      summary:
        "This project explores the use of artificial intelligence in diagnosing medical conditions using patient data.",
      technologies: "Python, TensorFlow, Deep Learning",
      outcome:
        "The model achieved 92% accuracy in diagnosing respiratory diseases.",
    });
  }, [searchParams]);

  const handleSignOut = () => {
    navigate("/login");
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
                <h1 className="text-xl font-bold">Project Details</h1>
                <p className="text-indigo-100 text-sm">
                  Complete Project Information
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/moderator/dashboard"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Dashboard
              </Link>
              <Link
                to="/moderator/previous-projects"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Previous Projects
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
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
                Project Archive Details
              </h2>
              <p className="text-indigo-700 text-sm mt-1">
                Comprehensive information about this completed project
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Project Details Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Project Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {projectDetails.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              By {projectDetails.studentName}
            </p>
          </div>

          {/* Project Information Grid */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Student Name
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {projectDetails.studentName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Academic Year
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">
                    {projectDetails.year}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Technologies Used
                  </label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {projectDetails.technologies
                      .split(", ")
                      .map((tech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tech}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Summary */}
            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Project Summary
              </label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  {projectDetails.summary}
                </p>
              </div>
            </div>

            {/* Project Outcome */}
            <div>
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Project Outcome
              </label>
              <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-green-100 rounded-lg">
                    <svg
                      className="w-4 h-4 text-green-600"
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
                  <p className="text-green-800 leading-relaxed">
                    {projectDetails.outcome}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer Navigation */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/moderator/previous-projects"
            className="group flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 no-underline"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="transition-all duration-300 group-hover:tracking-wide">
              Back to Previous Projects
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ModeratorPreviousProjectDetails;
