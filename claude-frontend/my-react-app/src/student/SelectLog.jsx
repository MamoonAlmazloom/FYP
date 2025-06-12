// SelectLog.jsx - Copy content from artifact 'select_log'
import { Link } from "react-router-dom";

const SelectLog = () => {
  // Mock log data - in real app this would come from API
  const logs = [
    {
      id: 1,
      title: "Week 1 Progress Log",
      date: "2025-06-01",
      status: "submitted",
    },
    {
      id: 2,
      title: "Week 2 Progress Log",
      date: "2025-06-08",
      status: "submitted",
    },
    {
      id: 3,
      title: "Week 3 Progress Log",
      date: "2025-06-15",
      status: "reviewed",
    },
    {
      id: 4,
      title: "Week 4 Progress Log",
      date: "2025-06-22",
      status: "submitted",
    },
    {
      id: 5,
      title: "Week 5 Progress Log",
      date: "2025-06-29",
      status: "pending",
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
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Select a Log to View
          </h2>

          {/* Logs List */}
          <div className="space-y-4 mb-8">
            {logs.map((log) => (
              <Link
                key={log.id}
                to={`/student/view-progress-log?log=${log.id}`}
                className="block p-6 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 no-underline"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {log.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Submitted on:{" "}
                      {new Date(log.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
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

          {/* Empty State */}
          {logs.length === 0 && (
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
                No logs submitted yet
              </p>
              <Link
                to="/student/progress-log-form"
                className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors no-underline"
              >
                Submit Your First Log
              </Link>
            </div>
          )}

          {/* Quick Actions */}
   
          {/* Statistics */}
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
                  {logs.filter((log) => log.status === "reviewed").length}
                </div>
                <div className="text-sm text-green-700">Reviewed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {logs.filter((log) => log.status === "pending").length}
                </div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {logs.filter((log) => log.status === "submitted").length}
                </div>
                <div className="text-sm text-blue-700">Submitted</div>
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

export default SelectLog;