import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../API/authAPI";
import {
  getStudentReports,
  provideFeedbackOnReport,
} from "../API/SupervisorAPI";

const ViewProgressReport = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [progressReports, setProgressReports] = useState([]);
  const [currentReportIndex, setCurrentReportIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const loadProgressReports = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }
        setUser(currentUser);

        if (!studentId) {
          navigate("/supervisor/my-students");
          return;
        }

        const response = await getStudentReports(currentUser.id, studentId);
        if (response.success) {
          setStudent(response.student);
          setProgressReports(response.reports || []);
          // Set existing feedback if available for current report
          if (response.reports && response.reports.length > 0) {
            const currentReport = response.reports[currentReportIndex];
            if (currentReport && currentReport.supervisorFeedback) {
              setFeedback(currentReport.supervisorFeedback);
            }
          }
        } else {
          setError(response.error || "Failed to load progress reports");
        }
      } catch (err) {
        console.error("Error loading progress reports:", err);
        setError("Failed to load progress reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProgressReports();
  }, [navigate, studentId, currentReportIndex]);
  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const changeReport = (reportIndex) => {
    setCurrentReportIndex(reportIndex);
    // Update feedback to show existing feedback for this report
    if (
      progressReports[reportIndex] &&
      progressReports[reportIndex].supervisorFeedback
    ) {
      setFeedback(progressReports[reportIndex].supervisorFeedback);
    } else {
      setFeedback("");
    }
    setSubmitSuccess(false);
  };
  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      setError("Please enter feedback before submitting.");
      return;
    }

    if (!user) {
      setError("User not authenticated. Please refresh the page.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const currentReport = progressReports[currentReportIndex];
      if (!currentReport) {
        setError("No progress report found for this period.");
        return;
      }
      const response = await provideFeedbackOnReport(
        user.id,
        currentReport.report_id,
        feedback
      );
      if (response.success) {
        setSubmitSuccess(true);
        // Update local state
        const updatedReports = [...progressReports];
        updatedReports[currentReportIndex] = {
          ...updatedReports[currentReportIndex],
          supervisorFeedback: feedback,
        };
        setProgressReports(updatedReports);
      } else {
        setError(response.error || "Failed to submit feedback");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const reports = progressReports.map((report, index) => `Report ${index + 1}`);
  const currentReport = progressReports[currentReportIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading progress reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-blue-700 text-white flex justify-between items-center px-5 py-4">
        <div className="text-xl font-bold">📘 Supervisor Dashboard</div>
        <div className="flex-grow text-center">
          <Link
            to="/supervisor/dashboard"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Home
          </Link>{" "}
          <Link
            to="/supervisor/my-students"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Students
          </Link>
          <Link
            to="/supervisor/proposed-titles"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Review Proposals
          </Link>
          <Link
            to="/supervisor/propose-project"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Propose a Title
          </Link>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 border-0 rounded text-sm cursor-pointer hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>{" "}
      <div className="max-w-3xl mx-auto my-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          View Progress Report
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            Feedback submitted successfully!
          </div>
        )}

        {progressReports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No progress reports found</p>
            <p className="text-sm">
              Progress reports will appear here once the student submits them.
            </p>
          </div>
        ) : (
          <>
            {/* Milestone Selection */}
            <div className="flex justify-center my-5 flex-wrap gap-2">
              {reports.map((report, index) => (
                <div
                  key={report}
                  onClick={() => changeReport(index)}
                  className={`px-3 py-2 rounded cursor-pointer ${
                    currentReportIndex === index
                      ? "bg-blue-800 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-800"
                  }`}
                >
                  {report}
                </div>
              ))}
            </div>{" "}
            {/* Student Information */}
            {currentReport && (
              <div className="bg-gray-50 p-4 rounded mb-4 text-left">
                {" "}
                <p className="mb-2">
                  <strong>Student Name:</strong> {student?.name || "Student"}
                </p>
                <p className="mb-2">
                  <strong>Report:</strong>{" "}
                  {currentReport.title || `Report ${currentReportIndex + 1}`}
                </p>
                <p className="mb-2">
                  <strong>Submitted On:</strong>{" "}
                  {currentReport.submission_date
                    ? new Date(
                        currentReport.submission_date
                      ).toLocaleDateString()
                    : "Invalid Date"}
                </p>
                <p className="mb-2">
                  <strong>Project:</strong>{" "}
                  {currentReport.project_title || "No project title"}
                </p>
                <p className="mb-2">
                  <strong>Report Details:</strong>{" "}
                  {currentReport.details || "No details provided"}
                </p>
                <p className="mb-2">
                  <strong>Report ID:</strong> {currentReport.report_id}
                </p>
              </div>
            )}
            {/* Supervisor Feedback Section */}
            <div className="mt-5 text-left bg-blue-50 rounded pb-1">
              <div className="bg-gray-800 text-white p-3 rounded text-center mb-3 font-bold">
                {currentReport?.supervisorFeedback
                  ? "Update Feedback"
                  : "Add Feedback"}
              </div>
              <div className="px-3">
                <textarea
                  id="feedback"
                  rows="4"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your feedback here..."
                  className="w-full p-3 border border-gray-300 rounded mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSubmitFeedback}
                  disabled={submitting}
                  className={`w-full p-4 text-base text-white border-0 rounded cursor-pointer mt-3 mb-3 ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </div>
          </>
        )}

        <Link
          to={`/supervisor/student-details/${studentId}`}
          className="inline-block mt-5 no-underline text-blue-600 font-bold hover:text-blue-800"
        >
          ← Back to Student Details
        </Link>
      </div>
    </div>
  );
};

export default ViewProgressReport;
