// ViewProgressLog.jsx - Copy content from artifact 'view_progress_log'
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ViewProgressLog = () => {
  const [searchParams] = useSearchParams();
  const [logData, setLogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logId = searchParams.get("log") || "1";

    // Simulate API call to fetch log data
    setTimeout(() => {
      // Mock log data based on ID
      const mockLogs = {
        1: {
          id: 1,
          title: "Week 1 Progress Log",
          dateSubmitted: "2025-01-15",
          progressSummary:
            "Completed initial research and finalized methodology. Set up development environment and created project repository.",
          challenges:
            "Difficulty in sourcing dataset; awaiting supervisor's feedback on the proposed approach. Some compatibility issues with the chosen ML frameworks.",
          nextSteps:
            "Start data preprocessing and feature selection. Schedule meeting with supervisor to discuss dataset alternatives.",
          hoursWorked: 25,
          completionPercentage: 15,
          status: "reviewed",
          supervisorFeedback:
            "Good progress on the initial setup. Please focus on finding alternative datasets and document your exploration process.",
          attachments: ["week1_log.pdf", "dataset_research.docx"],
        },
        2: {
          id: 2,
          title: "Week 2 Progress Log",
          dateSubmitted: "2025-01-22",
          progressSummary:
            "Successfully identified alternative datasets and started data preprocessing. Implemented basic data cleaning pipeline.",
          challenges:
            "Data quality issues requiring more extensive cleaning than initially planned.",
          nextSteps:
            "Complete data preprocessing and begin exploratory data analysis.",
          hoursWorked: 30,
          completionPercentage: 25,
          status: "submitted",
          supervisorFeedback: null,
          attachments: ["week2_log.pdf", "data_cleaning_script.py"],
        },
        3: {
          id: 3,
          title: "Week 3 Progress Log",
          dateSubmitted: "2025-01-29",
          progressSummary:
            "Completed exploratory data analysis and identified key patterns. Started feature engineering process.",
          challenges:
            "Some features showing high correlation, need to address multicollinearity.",
          nextSteps: "Complete feature selection and start model development.",
          hoursWorked: 28,
          completionPercentage: 40,
          status: "reviewed",
          supervisorFeedback:
            "Excellent analysis! The correlation findings are valuable. Consider using PCA or regularization techniques.",
          attachments: ["week3_log.pdf", "eda_results.html"],
        },
      };

      setLogData(mockLogs[logId] || mockLogs["1"]);
      setLoading(false);
    }, 500);
  }, [searchParams]);

  const getStatusBadge = (status) => {
    switch (status) {
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
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
            Pending
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
            Unknown
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading log...</p>
        </div>
      </div>
    );
  }

  if (!logData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Log not found</p>
          <Link
            to="/student/select-log"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Log Selection
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
                {logData.title}
              </h2>
              {getStatusBadge(logData.status)}
            </div>
            <p className="text-gray-600">
              Submitted on:{" "}
              {new Date(logData.dateSubmitted).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Progress Metrics */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Hours Worked
              </h3>
              <div className="text-3xl font-bold text-blue-600">
                {logData.hoursWorked}
              </div>
              <p className="text-blue-700 text-sm">This reporting period</p>
            </div>
          </div>

          {/* Log Details */}
          <div className="space-y-6">
            {/* Progress Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📋 Progress Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {logData.progressSummary}
              </p>
            </div>

            {/* Challenges */}
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">
                ⚠️ Challenges
              </h3>
              <p className="text-orange-700 leading-relaxed">
                {logData.challenges}
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">
                🎯 Next Steps
              </h3>
              <p className="text-purple-700 leading-relaxed">
                {logData.nextSteps}
              </p>
            </div>

            {/* Supervisor Feedback */}
            {logData.supervisorFeedback && (
              <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-400">
                <h3 className="text-lg font-semibold text-indigo-800 mb-3">
                  💬 Supervisor Feedback
                </h3>
                <p className="text-indigo-700 leading-relaxed">
                  {logData.supervisorFeedback}
                </p>
              </div>
            )}

            {/* Attachments */}
            {logData.attachments && logData.attachments.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  📎 Attachments
                </h3>
                <div className="space-y-2">
                  {logData.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <svg
                        className="w-5 h-5 text-gray-500"
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
                      <span className="text-gray-700">{attachment}</span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              📄 Download PDF
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              ✏️ Edit Log
            </button>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              📧 Share with Supervisor
            </button>
          </div>

          {/* Navigation */}
          <div className="text-center mt-8">
            <Link
              to="/student/select-log"
              className="inline-block text-blue-600 hover:text-blue-800 font-bold no-underline transition-colors"
            >
              ← Back to Log Selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProgressLog;
