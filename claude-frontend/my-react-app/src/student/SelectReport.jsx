import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getProgressReports } from "../API/StudentAPI";

const SelectReport = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (!user?.id) {
          setError("User not found. Please log in again.");
          return;
        }

        setLoading(true);
        const response = await getProgressReports(user.id);

        if (response.success) {
          setReports(response.reports || []);
        } else {
          setError(response.error || "Failed to load progress reports");
        }
      } catch (err) {
        console.error("Error fetching progress reports:", err);
        setError("Failed to load progress reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
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
      case "draft":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            Draft
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

  const getTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case "monthly":
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            Monthly
          </span>
        );
      case "milestone":
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
            Milestone
          </span>
        );
      case "final":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
            Final
          </span>
        );
      case "weekly":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            Weekly
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            Report
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress reports...</p>
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
              to="/student/progress-report-form"
              className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
            >
              Submit New Report
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            My Progress Reports
          </h2>

          {/* Reports List */}
          {reports.length > 0 ? (
            <div className="space-y-4 mb-8">
              {reports.map((report) => (
                <Link
                  key={report.report_id}
                  to={`/student/view-progress-report?report=${report.report_id}`}
                  className="block p-6 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 no-underline"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {report.title || `Progress Report #${report.report_id}`}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {report.details
                          ? report.details.length > 150
                            ? report.details.substring(0, 150) + "..."
                            : report.details
                          : "No details available"}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                        <span>
                          Submitted:{" "}
                          {new Date(report.submission_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                        {report.project_title && (
                          <span>Project: {report.project_title}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTypeBadge(report.type)}
                        {getStatusBadge(report.status)}
                        {report.grade && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-semibold">
                            Grade: {report.grade}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
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
                No progress reports submitted yet
              </p>
              <Link
                to="/student/progress-report-form"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors no-underline font-semibold"
              >
                Submit Your First Report
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-cyan-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-cyan-800 mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/student/progress-report-form"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors no-underline font-semibold"
              >
                + Submit New Report
              </Link>
              <Link
                to="/student/select-log"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors no-underline font-semibold"
              >
                📝 View Progress Logs
              </Link>
              <Link
                to="/student/progress-log-form"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors no-underline font-semibold"
              >
                📋 Submit Log
              </Link>
            </div>
          </div>

          {/* Report Statistics */}
          {reports.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Status Statistics */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Report Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {reports.length}
                    </div>
                    <div className="text-sm text-blue-700">Total Reports</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {
                        reports.filter(
                          (report) =>
                            report.status?.toLowerCase() === "reviewed" ||
                            report.status?.toLowerCase() === "approved"
                        ).length
                      }
                    </div>
                    <div className="text-sm text-green-700">Reviewed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {
                        reports.filter(
                          (report) => report.status?.toLowerCase() === "pending"
                        ).length
                      }
                    </div>
                    <div className="text-sm text-yellow-700">Pending</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-600">
                      {
                        reports.filter(
                          (report) =>
                            report.status?.toLowerCase() === "submitted"
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-700">Submitted</div>
                  </div>
                </div>
              </div>

              {/* Recent Reports */}
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 mb-4">
                  Recent Reports
                </h3>
                <div className="space-y-3">
                  {reports
                    .sort(
                      (a, b) =>
                        new Date(b.submission_date) -
                        new Date(a.submission_date)
                    )
                    .slice(0, 3)
                    .map((report) => (
                      <div
                        key={report.report_id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-indigo-700 truncate flex-1 mr-2">
                          {report.title || `Report #${report.report_id}`}
                        </span>
                        <span className="text-xs text-indigo-600">
                          {new Date(
                            report.submission_date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  {reports.length === 0 && (
                    <p className="text-indigo-600 text-sm">
                      No reports available yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

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

export default SelectReport;
