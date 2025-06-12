import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const StudentDetails = () => {
  const [searchParams] = useSearchParams();
  const [studentInfo, setStudentInfo] = useState({
    name: "Unknown Student",
    title: "Unknown Title",
  });

  useEffect(() => {
    const studentName = searchParams.get("student") || "Unknown Student";
    const projectTitle = searchParams.get("title") || "Unknown Title";

    setStudentInfo({
      name: studentName,
      title: projectTitle,
    });
  }, [searchParams]);

  const handleSignOut = () => {
    console.log("Sign out clicked");
  };

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
          Student Details
        </h2>

        {/* Student Information */}
        <div className="bg-gray-50 p-4 rounded mb-4 text-left">
          <p className="mb-2">
            <strong>Student Name:</strong> {studentInfo.name}
          </p>
          <p className="mb-2">
            <strong>Project Title:</strong> {studentInfo.title}
          </p>
          <p className="mb-0">
            <strong>Supervisor Feedback:</strong> This student is progressing
            well but needs more refinement in their research methodology.
          </p>
        </div>

        {/* Sections */}
        <div className="mt-5 rounded-lg bg-blue-50 pb-1">
          <h3 className="m-0 bg-gray-800 text-white p-3 rounded text-center font-bold">
            Progress Logs
          </h3>
          <div className="p-3">
            <Link
              to={`/supervisor/view-progress-log?student=${encodeURIComponent(
                studentInfo.name
              )}`}
              className="text-blue-600 font-bold no-underline hover:text-blue-800"
            >
              View Logs
            </Link>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-blue-50 pb-1">
          <h3 className="m-0 bg-gray-800 text-white p-3 rounded text-center font-bold">
            Reports
          </h3>
          <div className="p-3">
            <Link
              to={`/supervisor/view-progress-report?student=${encodeURIComponent(
                studentInfo.name
              )}`}
              className="text-blue-600 font-bold no-underline hover:text-blue-800"
            >
              View Reports
            </Link>
          </div>
        </div>

        <Link
          to="/supervisor/my-students"
          className="inline-block mt-5 no-underline text-blue-600 font-bold hover:text-blue-800"
        >
          ← Back to My Students List
        </Link>
      </div>
    </div>
  );
};

export default StudentDetails;
