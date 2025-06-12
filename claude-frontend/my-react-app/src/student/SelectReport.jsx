// SelectReport.jsx - Copy content from artifact 'select_report'
import { Link } from "react-router-dom";

const SelectReport = () => {
  // Mock report data - in real app this would come from API
  const reports = [
    {
      id: 1,
      title: "Monthly Progress Report - January",
      date: "2025-01-31",
      type: "monthly",
      status: "reviewed",
      grade: "A",
    },
    {
      id: 2,
      title: "Monthly Progress Report - February",
      date: "2025-02-28",
      type: "monthly",
      status: "reviewed",
      grade: "B+",
    },
    {
      id: 3,
      title: "Milestone 1 Report",
      date: "2025-03-15",
      type: "milestone",
      status: "submitted",
      grade: null,
    },
    {
      id: 4,
      title: "Monthly Progress Report - March",
      date: "2025-03-31",
      type: "monthly",
      status: "pending",
      grade: null,
    },
    {
      id: 5,
      title: "Mid-Project Review Report",
      date: "2025-04-10",
      type: "milestone",
      status: "draft",
      grade: null,
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
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
      case "draft":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            Draft
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            Unknown
          </span>
        );
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
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
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            Other
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Select a Report to View
          </h2>

          {/* Reports List */}
          <div className="space-y-4 mb-8">
            {reports.map((report) => (
              <Link
                key={report.id}
                to={`/student/view-progress-report?report=${report.id}`}
                className="block p-6 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 no-underline"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {report.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Submitted on:{" "}
                      {new Date(report.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
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

          {/* Empty State */}
          {reports.length === 0 && (
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
                No reports submitted yet
              </p>
              <Link
                to="/student/progress-report-form"
                className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors no-underline"
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
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm transition-colors no-underline"
              >
                + Submit New Report
              </Link>
              <button className="px-4 py-2 bg-cyan-100 hover:bg-cyan-200 text-cyan-800 rounded-lg text-sm transition-colors">
                📊 View Performance
              </button>
              <button className="px-4 py-2 bg-cyan-100 hover:bg-cyan-200 text-cyan-800 rounded-lg text-sm transition-colors">
                📄 Export All Reports
              </button>
              <button className="px-4 py-2 bg-cyan-100 hover:bg-cyan-200 text-cyan-800 rounded-lg text-sm transition-colors">
                📈 Grade Analytics
              </button>
            </div>
          </div>

          {/* Report Statistics */}
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
                      reports.filter((report) => report.status === "reviewed")
                        .length
                    }
                  </div>
                  <div className="text-sm text-green-700">Reviewed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      reports.filter((report) => report.status === "pending")
                        .length
                    }
                  </div>
                  <div className="text-sm text-yellow-700">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">
                    {
                      reports.filter((report) => report.status === "draft")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-700">Drafts</div>
                </div>
              </div>
            </div>

            {/* Grade Overview */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">
                Grade Overview
              </h3>
              <div className="space-y-3">
                {reports
                  .filter((report) => report.grade)
                  .map((report) => (
                    <div
                      key={report.id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-indigo-700 truncate flex-1 mr-2">
                        {report.title}
                      </span>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded font-semibold">
                        {report.grade}
                      </span>
                    </div>
                  ))}
                {reports.filter((report) => report.grade).length === 0 && (
                  <p className="text-indigo-600 text-sm">
                    No grades available yet
                  </p>
                )}
              </div>
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

export default SelectReport;