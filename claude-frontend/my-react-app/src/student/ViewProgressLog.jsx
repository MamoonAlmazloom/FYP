import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getProgressLogs } from "../API/StudentAPI";

const ViewProgressLog = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const logId = searchParams.get("log");

  const [logData, setLogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        if (!user?.id) {
          setError("User not found. Please log in again.");
          return;
        }

        if (!logId) {
          setError("Log ID not provided.");
          return;
        }

        setLoading(true);
        const response = await getProgressLogs(user.id);

        if (response.success) {
          const logs = response.logs || [];
          const foundLog = logs.find((log) => log.log_id === parseInt(logId));

          if (foundLog) {
            setLogData(foundLog);
          } else {
            setError("Progress log not found.");
          }
        } else {
          setError(response.error || "Failed to load progress log");
        }
      } catch (err) {
        console.error("Error fetching progress log:", err);
        setError("Failed to load progress log");
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [user, logId]);

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
      case "approved":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
            Pending
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
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading progress log...</p>
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
          <Link
            to="/student/select-log"
            className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
          >
            ← Back to Progress Logs
          </Link>
        </div>
      </div>
    );
  }

  if (!logData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Log Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requested progress log could not be found.
          </p>
          <Link
            to="/student/select-log"
            className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
          >
            ← Back to Progress Logs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-3xl font-bold text-gray-800">
                Progress Log #{logData.log_id}
              </h2>
              {getStatusBadge(logData.status)}
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Submitted:</span>{" "}
                {new Date(logData.submission_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {logData.project_title && (
                <div>
                  <span className="font-medium">Project:</span>{" "}
                  {logData.project_title}
                </div>
              )}
            </div>
          </div>

          {/* Log Details */}
          <div className="space-y-6">
            {/* Progress Details */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📋 Progress Details
              </h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {logData.details}
              </div>
            </div>

            {/* Log Metadata */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                📊 Log Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded">
                  <div className="text-sm text-blue-600">Log ID</div>
                  <div className="text-lg font-semibold text-blue-800">
                    #{logData.log_id}
                  </div>
                </div>
                <div className="bg-white p-4 rounded">
                  <div className="text-sm text-blue-600">Status</div>
                  <div className="text-lg font-semibold text-blue-800">
                    {logData.status || "Submitted"}
                  </div>
                </div>
                <div className="bg-white p-4 rounded">
                  <div className="text-sm text-blue-600">Submission Date</div>
                  <div className="text-lg font-semibold text-blue-800">
                    {new Date(logData.submission_date).toLocaleDateString()}
                  </div>
                </div>
                {logData.project_id && (
                  <div className="bg-white p-4 rounded">
                    <div className="text-sm text-blue-600">Project ID</div>
                    <div className="text-lg font-semibold text-blue-800">
                      #{logData.project_id}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Supervisor Feedback */}
            {logData.feedback && (
              <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-400">
                <h3 className="text-lg font-semibold text-indigo-800 mb-3">
                  💬 Supervisor Feedback
                </h3>
                <div className="text-indigo-700 leading-relaxed whitespace-pre-wrap">
                  {logData.feedback}
                </div>
              </div>
            )}

            {/* Progress Guidelines */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                📝 Progress Log Guidelines
              </h3>
              <div className="text-sm text-green-700 space-y-2">
                <p>
                  <strong>What to include in your progress logs:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Specific tasks completed since the last log</li>
                  <li>Challenges encountered and how they were addressed</li>
                  <li>New insights or discoveries made</li>
                  <li>Planned activities for the next period</li>
                  <li>Any questions or concerns for your supervisor</li>
                  <li>Time spent on different aspects of the project</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
            <Link
              to="/student/progress-log-form"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors no-underline font-semibold"
            >
              ✏️ Submit New Log
            </Link>
            <Link
              to="/student/select-log"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors no-underline font-semibold"
            >
              📋 View All Logs
            </Link>{" "}
            <Link
              to="/student/progress-report-form"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors no-underline font-semibold"
            >
              📊 Submit Report
            </Link>
          </div>

          {/* Navigation */}
          <div className="text-center mt-8">
            <Link
              to="/student/select-log"
              className="inline-block text-blue-600 hover:text-blue-800 font-bold no-underline transition-colors"
            >
              ← Back to Progress Logs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProgressLog;
