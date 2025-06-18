import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as ExaminerAPI from "../API/ExaminerAPI";
import { useAuth } from "../contexts/AuthContext";

const ExaminerProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [project, setProject] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (projectId && user?.id) {
      loadProjectDetails();
    }
  }, [projectId, user?.id]);

  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await ExaminerAPI.getProjectDetails(user.id, projectId);
      if (response.success) {
        setProject(response.project);
        // Pre-fill existing feedback if available
        if (response.project.examination_feedback) {
          setFeedback(response.project.examination_feedback);
        }
        if (response.project.examination_grade) {
          setGrade(response.project.examination_grade);
        }
      } else {
        setError(response.error || "Failed to load project details");
      }
    } catch (error) {
      console.error("Error loading project details:", error);
      setError("Error loading project details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim() || !grade.trim()) {
      setError("Please provide both feedback and grade");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const feedbackData = {
        feedback: feedback.trim(),
        grade: grade.trim(),
      };

      const response = await ExaminerAPI.provideExaminationFeedback(
        user.id,
        projectId,
        feedbackData
      );

      if (response.success) {
        setSuccess("Feedback submitted successfully!");
        // Refresh project details to show updated status
        setTimeout(() => {
          loadProjectDetails();
        }, 2000);
      } else {
        setError(response.error || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("Error submitting feedback");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFeedback = async () => {
    if (!feedback.trim() || !grade.trim()) {
      setError("Please provide both feedback and grade");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const feedbackData = {
        feedback: feedback.trim(),
        grade: grade.trim(),
      };

      const response = await ExaminerAPI.updateExaminationFeedback(
        user.id,
        projectId,
        feedbackData
      );

      if (response.success) {
        setSuccess("Feedback updated successfully!");
        // Refresh project details
        setTimeout(() => {
          loadProjectDetails();
        }, 2000);
      } else {
        setError(response.error || "Failed to update feedback");
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
      setError("Error updating feedback");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-lg shadow-lg">
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
              Loading project details...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-red-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Project
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              to="/examiner/dashboard"
              className="group flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 no-underline"
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
                Back to Dashboard
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                <h1 className="text-xl font-bold">Project Examination</h1>
                <p className="text-indigo-100 text-sm">
                  Detailed Project Review
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
              <span className="text-white/90 font-medium">Project Details</span>
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
      <div className="max-w-6xl mx-auto p-6">
        {/* Enhanced Project Information */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          {/* Project Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
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
                <h2 className="text-lg font-semibold text-gray-900">
                  Project Details
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Complete project information for examination
                </p>
              </div>
            </div>
          </div>

          {project && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Project Title
                    </label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {project.title}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Student Name
                    </label>
                    <p className="mt-1 text-gray-900">{project.student_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Supervisor
                    </label>
                    <p className="mt-1 text-gray-900">
                      {project.supervisor_name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </label>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === "Evaluated"
                            ? "bg-green-100 text-green-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {project.status || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Project Description
                  </label>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {project.description || "No description available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Feedback Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Feedback Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Examination Feedback
                </h3>
                <p className="text-blue-700 text-sm mt-1">
                  Provide detailed feedback and grading for this project
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Enhanced Error Banner */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 mb-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-red-100 rounded-lg">
                    <svg
                      className="w-5 h-5 text-red-600"
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
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Enhanced Success Banner */}
            {success && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-green-100 rounded-lg">
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
                  <span className="text-green-800 font-medium">{success}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={saving}
                >
                  <option value="">Select Grade</option>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                  <option value="C-">C-</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                </select>
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback Comments
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide detailed feedback on the project examination..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  rows="6"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Enhanced Footer Actions */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link
                to="/examiner/dashboard"
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
                  Back to Dashboard
                </span>
              </Link>

              <div className="flex gap-3">
                {project?.examination_feedback ? (
                  <button
                    onClick={handleUpdateFeedback}
                    disabled={saving || !feedback.trim() || !grade.trim()}
                    className={`group flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 ${
                      saving || !feedback.trim() || !grade.trim()
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span className="transition-all duration-300 group-hover:tracking-wide">
                      {saving ? "Updating..." : "Update Feedback"}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={saving || !feedback.trim() || !grade.trim()}
                    className={`group flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 ${
                      saving || !feedback.trim() || !grade.trim()
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
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
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    <span className="transition-all duration-300 group-hover:tracking-wide">
                      {saving ? "Submitting..." : "Submit Feedback"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminerProjectDetails;
