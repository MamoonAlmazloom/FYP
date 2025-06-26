import React, { useState, useEffect } from "react";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import ManagerAPI from "../API/ManagerAPI";

const ViewStudentLogs = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [searchParams] = useSearchParams();
  const [student, setStudent] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get manager data from localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const managerId = userData.id;

  useEffect(() => {
    const loadStudentLogs = async () => {
      try {
        setLoading(true);

        // Check authentication
        if (!managerId) {
          navigate("/login");
          return;
        }

        if (!userData.roles || !userData.roles.includes("Manager")) {
          navigate("/login");
          return;
        }

        if (!studentId) {
          setError("Student ID is required");
          return;
        }

        // Get student info from URL params as fallback
        const studentName = searchParams.get("student") || "Unknown Student";
        const projectTitle = searchParams.get("title") || "Unknown Project";

        setStudent({
          name: studentName,
          title: projectTitle,
        });

        // For now, using sample data - in a real implementation, you would call:
        // const response = await ManagerAPI.getStudentLogs(managerId, studentId);

        // Sample logs data
        setLogs([
          {
            id: 1,
            log_id: 1,
            project_id: studentId,
            submission_date: "2025-01-20",
            details:
              "Completed initial research phase and literature review. Set up development environment and familiarized myself with the required technologies.",
            status: "Submitted",
          },
          {
            id: 2,
            log_id: 2,
            project_id: studentId,
            submission_date: "2025-01-27",
            details:
              "Started working on the core functionality. Implemented basic user authentication system and database schema design.",
            status: "Submitted",
          },
          {
            id: 3,
            log_id: 3,
            project_id: studentId,
            submission_date: "2025-02-03",
            details:
              "Developed the main dashboard interface and integrated it with the backend API. Working on data validation and error handling.",
            status: "Submitted",
          },
          {
            id: 4,
            log_id: 4,
            project_id: studentId,
            submission_date: "2025-02-10",
            details:
              "Implemented advanced search functionality and optimized database queries. Started working on the reporting module.",
            status: "Submitted",
          },
          {
            id: 5,
            log_id: 5,
            project_id: studentId,
            submission_date: "2025-02-17",
            details:
              "Completed testing phase and bug fixes. Prepared documentation and user manual. Project is ready for final review.",
            status: "Submitted",
          },
        ]);
      } catch (error) {
        console.error("Error loading student logs:", error);
        setError("Failed to load student logs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadStudentLogs();
  }, [studentId, managerId, navigate, searchParams]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "submitted":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            Submitted
          </span>
        );
      case "reviewed":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            Reviewed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
            {status || "Submitted"}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
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
                <h1 className="text-xl font-bold">Student Progress Logs</h1>
                <p className="text-indigo-100 text-sm">
                  Review student progress logs
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
                to="/manager/approved-projects-logs"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Projects
              </Link>
              <Link
                to="/manager/manage-users"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Users
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
      <div className="max-w-6xl mx-auto mt-8 p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/manager/approved-projects-logs"
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
            Back to Projects
          </Link>
        </div>

        {/* Student Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {student?.name || "Unknown Student"}
              </h2>
              <p className="text-gray-600">
                Project: {student?.title || "Unknown Project"}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-800 font-semibold">
                  Total Progress Logs
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {logs.length}
                </p>
              </div>
              <div className="text-blue-600">
                <svg
                  className="w-12 h-12"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 1h2v4H7V6zm5 0h2v8h-2V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

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

        {/* Progress Logs */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">Progress Logs</h3>
            <p className="text-gray-600">
              Chronological view of student progress submissions
            </p>
          </div>

          {logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
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
              <p className="text-lg font-medium">No progress logs found</p>
              <p className="text-sm">
                Progress logs will appear here once the student submits them.
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-6">
                {logs.map((log, index) => (
                  <div
                    key={log.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          Progress Log #{log.log_id}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Submitted on {formatDate(log.submission_date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(log.status)}
                        <span className="text-xs text-gray-400">
                          Log {index + 1} of {logs.length}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-700 mb-2">
                        Progress Details:
                      </h5>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {log.details}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <div>Project ID: #{log.project_id}</div>
                      <div>
                        Submission Date: {formatDate(log.submission_date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewStudentLogs;
