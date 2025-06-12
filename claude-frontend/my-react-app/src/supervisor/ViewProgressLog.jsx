import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const ViewProgressLog = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("Unknown Student");
  const [currentWeek, setCurrentWeek] = useState("Week 3");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const student = searchParams.get("student") || "Unknown Student";
    const week = searchParams.get("week") || "Week 3";

    setStudentName(student);
    setCurrentWeek(week);
  }, [searchParams]);

  const handleSignOut = () => {
    console.log("Sign out clicked");
  };

  const changeLog = (week) => {
    navigate(
      `/supervisor/view-progress-log?student=${encodeURIComponent(
        studentName
      )}&week=${week}`
    );
  };

  const handleSubmitFeedback = () => {
    console.log("Feedback submitted:", feedback);
    // Handle feedback submission logic here
  };

  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];

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
          </Link>
          <Link
            to="/supervisor/my-students"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Students
          </Link>
          <span className="text-white no-underline mx-4 text-base font-bold">
            Logs
          </span>
          <span className="text-white no-underline mx-4 text-base font-bold">
            Reports
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 border-0 rounded text-sm cursor-pointer hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      <div className="max-w-3xl mx-auto my-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          View Progress Log
        </h2>

        {/* Milestone Selection */}
        <div className="flex justify-center my-5 flex-wrap gap-2">
          {weeks.map((week) => (
            <div
              key={week}
              onClick={() => changeLog(week)}
              className={`px-3 py-2 rounded cursor-pointer ${
                currentWeek === week
                  ? "bg-blue-800 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-800"
              }`}
            >
              {week}
            </div>
          ))}
        </div>

        {/* Student Information */}
        <div className="bg-gray-50 p-4 rounded mb-4 text-left">
          <p className="mb-2">
            <strong>Student Name:</strong> {studentName}
          </p>
          <p className="mb-2">
            <strong>Log Entry:</strong> {currentWeek} Progress
          </p>
          <p className="mb-2">
            <strong>Submitted On:</strong> February 10, 2025
          </p>
          <p className="mb-2">
            <strong>Progress Summary:</strong> The student has completed the
            literature review and started the data collection phase.
          </p>
          <p className="mb-0">
            <strong>Challenges:</strong> Limited access to real-world datasets;
            working on alternatives.
          </p>
        </div>

        {/* Supervisor Feedback Section */}
        <div className="mt-5 text-left bg-blue-50 rounded pb-1">
          <div className="bg-gray-800 text-white p-3 rounded text-center mb-3 font-bold">
            Add Feedback
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
              className="w-full p-4 text-base text-white bg-green-600 border-0 rounded cursor-pointer mt-3 mb-3 hover:bg-green-700"
            >
              Submit Feedback
            </button>
          </div>
        </div>

        <Link
          to="/supervisor/student-details"
          className="inline-block mt-5 no-underline text-blue-600 font-bold hover:text-blue-800"
        >
          ← Back to Student Details
        </Link>
      </div>
    </div>
  );
};

export default ViewProgressLog;
