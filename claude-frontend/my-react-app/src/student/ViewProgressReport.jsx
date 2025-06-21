import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getProgressReports } from "../API/StudentAPI";

const ViewProgressReport = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get("report");

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!user?.id) {
          setError("User not found. Please log in again.");
          return;
        }

        if (!reportId) {
          setError("Report ID not provided.");
          return;
        }

        setLoading(true);
        const response = await getProgressReports(user.id);

        if (response.success) {
          const reports = response.reports || [];
          const foundReport = reports.find(
            (report) => report.report_id === parseInt(reportId)
          );

          if (foundReport) {
            setReportData(foundReport);
          } else {
            setError("Progress report not found.");
          }
        } else {
          setError(response.error || "Failed to load progress report");
        }
      } catch (err) {
        console.error("Error fetching progress report:", err);
        setError("Failed to load progress report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [user, reportId]);

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
          <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading progress report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>{" "}
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/student/select-report"
            className="inline-block py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
          >
            ← Back to Progress Reports
          </Link>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Report Not Found
          </h2>{" "}
          <p className="text-gray-600 mb-6">
            The requested progress report could not be found.
          </p>
          <Link
            to="/student/select-report"
            className="inline-block py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
          >
            ← Back to Progress Reports
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-3xl font-bold text-gray-800">
                {reportData.title || `Progress Report #${reportData.report_id}`}
              </h2>
              <div className="flex items-center space-x-3">
                {getStatusBadge(reportData.status)}
                {reportData.grade && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full font-semibold">
                    Grade: {reportData.grade}
                  </span>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Submitted:</span>{" "}
                {new Date(reportData.submission_date).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Report ID:</span> #
                {reportData.report_id}
              </div>
              {reportData.project_title && (
                <div>
                  <span className="font-medium">Project:</span>{" "}
                  {reportData.project_title}
                </div>
              )}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-cyan-50 p-6 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-cyan-800 mb-2">
                Report ID
              </h3>
              <div className="text-3xl font-bold text-cyan-600">
                #{reportData.report_id}
              </div>
              <p className="text-cyan-700 text-sm">Unique identifier</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Status
              </h3>
              <div className="text-xl font-bold text-green-600">
                {reportData.status || "Submitted"}
              </div>
              <p className="text-green-700 text-sm">Current status</p>
            </div>
          </div>

          {/* Report Content */}
          <div className="space-y-8">
            {/* Report Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📋 Report Details
              </h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {reportData.details}
              </div>
            </div>

            {/* Report Information */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                📊 Report Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded">
                  <div className="text-sm text-blue-600">Title</div>
                  <div className="text-lg font-semibold text-blue-800">
                    {reportData.title ||
                      `Progress Report #${reportData.report_id}`}
                  </div>
                </div>
                <div className="bg-white p-4 rounded">
                  <div className="text-sm text-blue-600">Submission Date</div>
                  <div className="text-lg font-semibold text-blue-800">
                    {new Date(reportData.submission_date).toLocaleDateString()}
                  </div>
                </div>
                {reportData.project_id && (
                  <div className="bg-white p-4 rounded">
                    <div className="text-sm text-blue-600">Project ID</div>
                    <div className="text-lg font-semibold text-blue-800">
                      #{reportData.project_id}
                    </div>
                  </div>
                )}
                <div className="bg-white p-4 rounded">
                  <div className="text-sm text-blue-600">Status</div>
                  <div className="text-lg font-semibold text-blue-800">
                    {reportData.status || "Submitted"}
                  </div>
                </div>
              </div>
            </div>

            {/* Supervisor Feedback */}
            {reportData.feedback && (
              <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-400">
                <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                  💬 Supervisor Feedback
                </h3>
                <div className="text-indigo-700 leading-relaxed whitespace-pre-wrap mb-4">
                  {reportData.feedback}
                </div>
                {reportData.grade && (
                  <div className="flex items-center space-x-2">
                    <span className="text-indigo-700 font-medium">Grade:</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded font-semibold">
                      {reportData.grade}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Progress Report Guidelines */}
            <div className="bg-cyan-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-cyan-800 mb-4">
                📝 Progress Report Guidelines
              </h3>
              <div className="text-sm text-cyan-700 space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">
                    What makes a good progress report:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      Clear summary of work completed during the reporting
                      period
                    </li>
                    <li>Specific achievements and milestones reached</li>
                    <li>
                      Detailed analysis of challenges and how they were
                      addressed
                    </li>
                    <li>
                      Progress assessment against original project timeline
                    </li>
                    <li>Comprehensive plans for the next reporting period</li>
                    <li>
                      Any changes to project scope, methodology, or timeline
                    </li>
                    <li>Resource utilization and budget considerations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tips for improvement:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      Use quantitative measures where possible (hours,
                      completion percentages)
                    </li>
                    <li>
                      Include visual aids like charts, graphs, or screenshots
                    </li>
                    <li>Be honest about challenges and setbacks</li>
                    <li>Connect progress to original project objectives</li>
                    <li>Seek feedback proactively from supervisors</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
            {" "}
            <Link
              to="/student/progress-report-form"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors no-underline font-semibold"
            >
              ✏️ Submit New Report
            </Link>
            <Link
              to="/student/select-report"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors no-underline font-semibold"
            >
              📊 View All Reports
            </Link>
            <Link
              to="/student/progress-log-form"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors no-underline font-semibold"
            >
              📝 Submit Progress Log
            </Link>
          </div>

          {/* Navigation */}
          <div className="text-center mt-8">
            <Link
              to="/student/select-report"
              className="inline-block text-blue-600 hover:text-blue-800 font-bold no-underline transition-colors"
            >
              ← Back to Progress Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProgressReport;
