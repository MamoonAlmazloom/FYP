// pages/NotificationTest.jsx
import React, { useState } from "react";
import NotificationCenter from "../components/NotificationCenter";
import {
  createCustomNotification,
  testNotificationService,
} from "../services/notificationService";

const NotificationTest = () => {
  const [userId, setUserId] = useState("");
  const [eventName, setEventName] = useState("test_notification");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Test data for notification triggers
  const [triggerData, setTriggerData] = useState({
    examinerAssignment: {
      projectId: 1,
      studentId: 1,
      examinerId: 2,
    },
    projectEvaluation: {
      projectId: 1,
      examinerId: 2,
      evaluationResult: "Pass",
      score: 85,
    },
    progressSubmission: {
      submissionType: "log",
      submissionId: 1,
      studentId: 1,
      projectId: 1,
    },
    feedbackReceived: {
      feedbackType: "report",
      feedbackId: 1,
      reviewerId: 2,
      targetId: 1,
    },
  });

  const handleTestAPI = async () => {
    setLoading(true);
    try {
      const response = await testNotificationService();
      setResult({ type: "success", data: response });
    } catch (error) {
      setResult({ type: "error", error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    if (!userId || !message) {
      setResult({ type: "error", error: "User ID and message are required" });
      return;
    }

    setLoading(true);
    try {
      const response = await createCustomNotification(
        parseInt(userId),
        eventName,
        message
      );
      setResult({ type: "success", data: response });
      setMessage(""); // Clear form
    } catch (error) {
      setResult({ type: "error", error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerTest = async (triggerType) => {
    setLoading(true);
    try {
      const API_BASE_URL = "http://localhost:5000/api";
      let endpoint = "";
      let body = {};

      switch (triggerType) {
        case "examinerAssignment":
          endpoint = "/notifications/test/examiner-assignment";
          body = triggerData.examinerAssignment;
          break;
        case "projectEvaluation":
          endpoint = "/notifications/test/project-evaluation";
          body = triggerData.projectEvaluation;
          break;
        case "progressSubmission":
          endpoint = "/notifications/test/progress-submission";
          body = triggerData.progressSubmission;
          break;
        case "feedbackReceived":
          endpoint = "/notifications/test/feedback-received";
          body = triggerData.feedbackReceived;
          break;
        default:
          throw new Error("Invalid trigger type");
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult({ type: "success", data });
    } catch (error) {
      setResult({ type: "error", error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Notification Service Test
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Test Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Test API Connection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Test API Connection
              </h2>
              <button
                onClick={handleTestAPI}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Testing..." : "Test Notification API"}
              </button>
            </div>

            {/* Notification Trigger Tests */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Test Notification Triggers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Examiner Assignment */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">🎯 Examiner Assignment</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Tests notification when examiner is assigned to student
                  </p>
                  <button
                    onClick={() => handleTriggerTest("examinerAssignment")}
                    disabled={loading}
                    className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    Test Trigger
                  </button>
                </div>

                {/* Project Evaluation */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">📊 Project Evaluation</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Tests notification when project is evaluated
                  </p>
                  <button
                    onClick={() => handleTriggerTest("projectEvaluation")}
                    disabled={loading}
                    className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    Test Trigger
                  </button>
                </div>

                {/* Progress Submission */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">📝 Progress Submission</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Tests notification when student submits log/report
                  </p>
                  <button
                    onClick={() => handleTriggerTest("progressSubmission")}
                    disabled={loading}
                    className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    Test Trigger
                  </button>
                </div>

                {/* Feedback Received */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">💬 Feedback Received</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Tests notification when student receives feedback
                  </p>
                  <button
                    onClick={() => handleTriggerTest("feedbackReceived")}
                    disabled={loading}
                    className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    Test Trigger
                  </button>
                </div>
              </div>
            </div>

            {/* Create Custom Notification */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">
                Create Test Notification
              </h2>
              <form onSubmit={handleCreateNotification} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID
                  </label>
                  <input
                    type="number"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter user ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="test_notification">Test Notification</option>
                    <option value="proposal_submitted">
                      Proposal Submitted
                    </option>
                    <option value="proposal_approved">Proposal Approved</option>
                    <option value="proposal_rejected">Proposal Rejected</option>
                    <option value="examiner_assigned">Examiner Assigned</option>
                    <option value="project_evaluated">Project Evaluated</option>
                    <option value="feedback_received">Feedback Received</option>
                    <option value="log_submitted">Log Submitted</option>
                    <option value="report_submitted">Report Submitted</option>
                    <option value="deadline_reminder">Deadline Reminder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter notification message"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Notification"}
                </button>
              </form>
            </div>

            {/* Result Display */}
            {result && (
              <div
                className={`rounded-lg p-4 ${
                  result.type === "success"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <h3
                  className={`font-semibold mb-2 ${
                    result.type === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {result.type === "success" ? "Success!" : "Error"}
                </h3>
                <pre
                  className={`text-sm ${
                    result.type === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {result.type === "success"
                    ? JSON.stringify(result.data, null, 2)
                    : result.error}
                </pre>
              </div>
            )}
          </div>

          {/* Notification Center Demo */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Live Notification Center
            </h2>
            <NotificationCenter userId={userId ? parseInt(userId) : null} />

            {/* Notification Types Legend */}
            <div className="mt-6 bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">Notification Types</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Examiner Assignment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>Project Evaluation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>💬</span>
                  <span>Feedback Received</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📝</span>
                  <span>Progress Submission</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>Proposal Approved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>❌</span>
                  <span>Proposal Rejected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>⏰</span>
                  <span>Deadline Reminder</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Backend Status */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Backend Status</h3>
          <p className="text-blue-700 text-sm">
            Backend server should be running on:{" "}
            <code>http://localhost:5000</code>
          </p>
          <p className="text-blue-700 text-sm">
            Frontend server running on: <code>http://localhost:5174</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationTest;
