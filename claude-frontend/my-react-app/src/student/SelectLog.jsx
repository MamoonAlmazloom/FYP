import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getProgressLogs } from "../API/StudentAPI";

const SelectLog = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        if (!user?.id) {
          setError("User not found. Please log in again.");
          return;
        }

        setLoading(true);
        const response = await getProgressLogs(user.id);

        if (response.success) {
          setLogs(response.logs || []);
        } else {
          setError(response.error || "Failed to load progress logs");
        }
      } catch (err) {
        console.error("Error fetching progress logs:", err);
        setError("Failed to load progress logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "submitted":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            Submitted
          </span>
        );
      case "reviewed":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Reviewed
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Approved
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            {status || "Unknown"}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link
              to="/student/progress-log-form"
              className="block w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
            >
              Submit New Log
            </Link>
            <Link
              to="/student/project-work"
              className="block w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
            >
              Back to Project Work
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            My Progress Logs
          </h2>

          {/* Logs List */}
          {logs.length > 0 ? (
            <div className="space-y-4 mb-8">
              {logs.map((log) => (
                <Link
                  key={log.log_id}
                  to={`/student/view-progress-log?log=${log.log_id}`}
                  className="block p-6 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 no-underline"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Progress Log #{log.log_id}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {log.details
                          ? log.details.length > 100
                            ? log.details.substring(0, 100) + "..."
                            : log.details
                          : "No details available"}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>
                          Submitted:{" "}
                          {new Date(log.submission_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                        {log.project_title && (
                          <span>Project: {log.project_title}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(log.status)}
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
              <p className="text-gray-500 text-lg mb-4">
                No progress logs submitted yet
              </p>
              <Link
                to="/student/progress-log-form"
                className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors no-underline font-semibold"
              >
                Submit Your First Log
              </Link>
            </div>
          )}

          {/* Statistics */}
          {logs.length > 0 && (
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Log Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {logs.length}
                  </div>
                  <div className="text-sm text-blue-700">Total Logs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {
                      logs.filter(
                        (log) =>
                          log.status?.toLowerCase() === "reviewed" ||
                          log.status?.toLowerCase() === "approved"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-green-700">Reviewed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      logs.filter(
                        (log) => log.status?.toLowerCase() === "pending"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-yellow-700">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {
                      logs.filter(
                        (log) => log.status?.toLowerCase() === "submitted"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-blue-700">Submitted</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/student/progress-log-form"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors no-underline text-sm font-semibold"
              >
                Submit New Log
              </Link>
              <Link
                to="/student/progress-report-form"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors no-underline text-sm font-semibold"
              >
                Submit Report
              </Link>
              <Link
                to="/student/select-report"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors no-underline text-sm font-semibold"
              >
                View Reports
              </Link>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link
              to="/student/project-work"
              className="inline-block text-blue-600 hover:text-blue-800 font-bold no-underline transition-colors"
            >
              ← Back to Project Work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectLog;
