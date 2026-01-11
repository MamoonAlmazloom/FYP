import React, { useEffect, useState } from "react";
import { getStudentLogs, getStudentReports } from "../API/SupervisorAPI";

// Test component to verify data display
const DataDisplayTest = () => {
  const [testResults, setTestResults] = useState({
    logs: null,
    reports: null,
    error: null,
  });

  useEffect(() => {
    const testDataDisplay = async () => {
      try {
        // Test logs
        console.log("Testing logs data display...");
        const logsResponse = await getStudentLogs(8, 1); // Supervisor 8, Student 1

        // Test reports
        console.log("Testing reports data display...");
        const reportsResponse = await getStudentReports(8, 1); // Supervisor 8, Student 1

        setTestResults({
          logs: logsResponse,
          reports: reportsResponse,
          error: null,
        });
      } catch (error) {
        console.error("Test error:", error);
        setTestResults({
          logs: null,
          reports: null,
          error: error.message,
        });
      }
    };

    testDataDisplay();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  if (testResults.error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded">
        <h2 className="text-red-800 font-bold text-xl mb-4">❌ Test Error</h2>
        <p className="text-red-600">{testResults.error}</p>
      </div>
    );
  }

  if (!testResults.logs || !testResults.reports) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-200 rounded">
        <h2 className="text-blue-800 font-bold text-xl mb-4">
          🔄 Testing Data Display...
        </h2>
        <p className="text-blue-600">Loading and parsing data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        📊 Data Display Test Results
      </h1>

      {/* Progress Logs Test */}
      <div className="bg-green-50 border border-green-200 rounded p-4">
        <h2 className="text-green-800 font-bold text-lg mb-4">
          ✅ Progress Logs Data
        </h2>
        {testResults.logs.success ? (
          <div>
            <p className="mb-2">
              <strong>Total Logs:</strong> {testResults.logs.logs?.length || 0}
            </p>
            <p className="mb-2">
              <strong>Student:</strong>{" "}
              {testResults.logs.student?.name || "Unknown"}
            </p>

            <h3 className="font-bold mt-4 mb-2">Sample Log Display:</h3>
            {testResults.logs.logs && testResults.logs.logs[0] && (
              <div className="bg-white p-3 rounded border ml-4">
                <p>
                  <strong>Student Name:</strong>{" "}
                  {testResults.logs.student?.name || "Unknown Student"}
                </p>
                <p>
                  <strong>Log Entry:</strong> Week 1 Progress
                </p>
                <p>
                  <strong>Submitted On:</strong>{" "}
                  {formatDate(testResults.logs.logs[0].submission_date)}
                </p>
                <p>
                  <strong>Project:</strong>{" "}
                  {testResults.logs.logs[0].project_title || "No project title"}
                </p>
                <p>
                  <strong>Progress Details:</strong>{" "}
                  {testResults.logs.logs[0].details || "No details provided"}
                </p>
                <p>
                  <strong>Log ID:</strong> {testResults.logs.logs[0].log_id}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-red-600">❌ Error: {testResults.logs.error}</p>
        )}
      </div>

      {/* Progress Reports Test */}
      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <h2 className="text-blue-800 font-bold text-lg mb-4">
          ✅ Progress Reports Data
        </h2>
        {testResults.reports.success ? (
          <div>
            <p className="mb-2">
              <strong>Total Reports:</strong>{" "}
              {testResults.reports.reports?.length || 0}
            </p>
            <p className="mb-2">
              <strong>Student:</strong>{" "}
              {testResults.reports.student?.name || "Unknown"}
            </p>

            <h3 className="font-bold mt-4 mb-2">Sample Report Display:</h3>
            {testResults.reports.reports && testResults.reports.reports[0] && (
              <div className="bg-white p-3 rounded border ml-4">
                <p>
                  <strong>Student Name:</strong>{" "}
                  {testResults.reports.student?.name || "Unknown Student"}
                </p>
                <p>
                  <strong>Report:</strong>{" "}
                  {testResults.reports.reports[0].title || "Report 1"}
                </p>
                <p>
                  <strong>Submitted On:</strong>{" "}
                  {formatDate(testResults.reports.reports[0].submission_date)}
                </p>
                <p>
                  <strong>Project:</strong>{" "}
                  {testResults.reports.reports[0].project_title ||
                    "No project title"}
                </p>
                <p>
                  <strong>Report Details:</strong>{" "}
                  {testResults.reports.reports[0].details ||
                    "No details provided"}
                </p>
                <p>
                  <strong>Report ID:</strong>{" "}
                  {testResults.reports.reports[0].report_id}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-red-600">❌ Error: {testResults.reports.error}</p>
        )}
      </div>

      {/* Comparison */}
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <h2 className="text-yellow-800 font-bold text-lg mb-4">
          🔍 Before vs After Fix
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-red-600">
              ❌ Before Fix (What you saw):
            </h3>
            <ul className="list-disc ml-6 text-sm">
              <li>Student Name: Unknown Student</li>
              <li>Submitted On: Invalid Date</li>
              <li>Progress Summary: No summary provided</li>
              <li>Challenges: No challenges reported</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-green-600">
              ✅ After Fix (What you should see now):
            </h3>
            <ul className="list-disc ml-6 text-sm">
              <li>
                Student Name:{" "}
                {testResults.logs.student?.name || "Actual student name"}
              </li>
              <li>
                Submitted On:{" "}
                {testResults.logs.logs?.[0]
                  ? formatDate(testResults.logs.logs[0].submission_date)
                  : "Actual date"}
              </li>
              <li>
                Project:{" "}
                {testResults.logs.logs?.[0]?.project_title ||
                  "Actual project title"}
              </li>
              <li>
                Progress Details:{" "}
                {testResults.logs.logs?.[0]?.details
                  ? "Actual content..."
                  : "Actual details"}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded p-4">
        <h2 className="text-gray-800 font-bold text-lg mb-4">🚀 Next Steps</h2>
        <p className="mb-2">
          The data mapping fix is complete. You should now see actual data
          instead of placeholder text.
        </p>
        <p className="mb-2">
          <strong>Test the actual components:</strong>
        </p>
        <ul className="list-disc ml-6">
          <li>
            <a
              href="/supervisor/view-progress-log/1"
              className="text-blue-600 underline"
            >
              Progress Log Component
            </a>
          </li>
          <li>
            <a
              href="/supervisor/view-progress-report/1"
              className="text-blue-600 underline"
            >
              Progress Report Component
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DataDisplayTest;
