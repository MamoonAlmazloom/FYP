// ViewProgressReport.jsx - Copy content from artifact 'view_progress_report'
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ViewProgressReport = () => {
  const [searchParams] = useSearchParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reportId = searchParams.get("report") || "1";

    // Simulate API call to fetch report data
    setTimeout(() => {
      // Mock report data based on ID
      const mockReports = {
        1: {
          id: 1,
          title: "Monthly Progress Report - January",
          dateSubmitted: "2025-01-31",
          reportPeriod: { from: "2025-01-01", to: "2025-01-31" },
          type: "monthly",
          status: "reviewed",
          grade: "A",
          reportSummary:
            "Completed data collection and preprocessing phases. Successfully implemented initial model prototypes and conducted preliminary testing with promising results.",
          achievements: [
            "Collected and cleaned dataset of 50,000 medical records",
            "Implemented 3 different ML algorithms for comparison",
            "Achieved 85% accuracy on initial testing",
            "Completed literature review of 25 relevant papers",
          ],
          challenges:
            "Some missing data in the dataset required extensive cleaning. Model overfitting observed during initial training phases.",
          nextSteps:
            "Begin comprehensive model training and hyperparameter tuning. Implement cross-validation strategies.",
          hoursWorked: 120,
          milestones: [
            {
              name: "Data Collection",
              status: "completed",
              date: "2025-01-15",
            },
            {
              name: "Data Preprocessing",
              status: "completed",
              date: "2025-01-25",
            },
            {
              name: "Initial Model Training",
              status: "in-progress",
              date: "2025-02-05",
            },
          ],
          supervisorFeedback:
            "Excellent progress this month! The data collection strategy was well-executed. Focus on addressing the overfitting issues in the next phase.",
          supervisorGrade: "A",
          attachments: [
            "january_report.pdf",
            "data_analysis_results.xlsx",
            "model_comparison.png",
          ],
        },
        2: {
          id: 2,
          title: "Monthly Progress Report - February",
          dateSubmitted: "2025-02-28",
          reportPeriod: { from: "2025-02-01", to: "2025-02-28" },
          type: "monthly",
          status: "reviewed",
          grade: "B+",
          reportSummary:
            "Focused on model optimization and addressing overfitting issues. Implemented regularization techniques and cross-validation strategies.",
          achievements: [
            "Reduced overfitting through L1/L2 regularization",
            "Implemented k-fold cross-validation",
            "Improved model accuracy to 89%",
            "Completed comprehensive model evaluation",
          ],
          challenges:
            "Computational resources became a limiting factor for larger model training. Some datasets showed bias that needed addressing.",
          nextSteps:
            "Optimize computational efficiency and address dataset bias. Begin preparation for mid-project presentation.",
          hoursWorked: 110,
          milestones: [
            {
              name: "Model Optimization",
              status: "completed",
              date: "2025-02-15",
            },
            {
              name: "Cross-validation Implementation",
              status: "completed",
              date: "2025-02-20",
            },
            {
              name: "Bias Analysis",
              status: "in-progress",
              date: "2025-03-05",
            },
          ],
          supervisorFeedback:
            "Good improvement in model performance. The regularization approach was appropriate. Need to address computational efficiency concerns.",
          supervisorGrade: "B+",
          attachments: ["february_report.pdf", "model_performance_metrics.pdf"],
        },
      };

      setReportData(mockReports[reportId] || mockReports["1"]);
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

  const getMilestoneStatus = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
            ✓ Completed
          </span>
        );
      case "in-progress":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
            🔄 In Progress
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
            ⏳ Pending
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
            Unknown
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Report not found</p>
          <Link
            to="/student/select-report"
            className="text-cyan-600 hover:text-cyan-800 font-semibold"
          >
            ← Back to Report Selection
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
                {reportData.title}
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
                {new Date(reportData.dateSubmitted).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Period:</span>{" "}
                {new Date(reportData.reportPeriod.from).toLocaleDateString()} -{" "}
                {new Date(reportData.reportPeriod.to).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Type:</span> {reportData.type}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-cyan-50 p-6 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-cyan-800 mb-2">
                Hours Worked
              </h3>
              <div className="text-3xl font-bold text-cyan-600">
                {reportData.hoursWorked}
              </div>
              <p className="text-cyan-700 text-sm">This period</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Achievements
              </h3>
              <div className="text-3xl font-bold text-green-600">
                {reportData.achievements.length}
              </div>
              <p className="text-green-700 text-sm">Major milestones</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                Grade
              </h3>
              <div className="text-3xl font-bold text-purple-600">
                {reportData.grade || "N/A"}
              </div>
              <p className="text-purple-700 text-sm">Supervisor rating</p>
            </div>
          </div>

          {/* Report Content */}
          <div className="space-y-8">
            {/* Report Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📋 Report Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {reportData.reportSummary}
              </p>
            </div>

            {/* Achievements */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                🎯 Key Achievements
              </h3>
              <ul className="space-y-2">
                {reportData.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-green-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Milestones */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                🏁 Project Milestones
              </h3>
              <div className="space-y-3">
                {reportData.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-white rounded border"
                  >
                    <div>
                      <span className="font-medium text-gray-800">
                        {milestone.name}
                      </span>
                      <p className="text-sm text-gray-600">
                        Target: {new Date(milestone.date).toLocaleDateString()}
                      </p>
                    </div>
                    {getMilestoneStatus(milestone.status)}
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-orange-800 mb-4">
                ⚠️ Challenges & Issues
              </h3>
              <p className="text-orange-700 leading-relaxed">
                {reportData.challenges}
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">
                🚀 Next Steps
              </h3>
              <p className="text-purple-700 leading-relaxed">
                {reportData.nextSteps}
              </p>
            </div>

            {/* Supervisor Feedback */}
            {reportData.supervisorFeedback && (
              <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-400">
                <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                  💬 Supervisor Feedback
                </h3>
                <p className="text-indigo-700 leading-relaxed mb-4">
                  {reportData.supervisorFeedback}
                </p>
                {reportData.supervisorGrade && (
                  <div className="flex items-center space-x-2">
                    <span className="text-indigo-700 font-medium">Grade:</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded font-semibold">
                      {reportData.supervisorGrade}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Attachments */}
            {reportData.attachments && reportData.attachments.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  📎 Attachments
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {reportData.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-white rounded border"
                    >
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
                      <span className="text-gray-700 flex-1">{attachment}</span>
                      <button className="text-cyan-600 hover:text-cyan-800 text-sm">
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
            <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
              📄 Download PDF
            </button>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              ✏️ Edit Report
            </button>
            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              📊 Generate Analytics
            </button>
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              📧 Share with Supervisor
            </button>
          </div>

          {/* Navigation */}
          <div className="text-center mt-8">
            <Link
              to="/student/select-report"
              className="inline-block text-cyan-600 hover:text-cyan-800 font-bold no-underline transition-colors"
            >
              ← Back to Report Selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProgressReport;