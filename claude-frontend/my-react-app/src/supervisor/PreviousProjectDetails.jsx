import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const PreviousProjectDetails = () => {
  const [searchParams] = useSearchParams();
  const [projectInfo, setProjectInfo] = useState({
    title: "Unknown Title",
    studentName: "Unknown Student",
    year: "Unknown Year",
  });

  useEffect(() => {
    const projectTitle = searchParams.get("title") || "Unknown Title";
    const studentName = searchParams.get("student") || "Unknown Student";
    const year = searchParams.get("year") || "Unknown Year";

    setProjectInfo({
      title: projectTitle,
      studentName,
      year,
    });
  }, [searchParams]);

  const handleSignOut = () => {
    console.log("Sign out clicked");
  };

  const handleDownload = (fileType) => {
    console.log(`Downloading ${fileType} for project: ${projectInfo.title}`);
    // Handle download logic here
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

      <div className="max-w-4xl mx-auto my-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          View Previous Project Details
        </h2>

        {/* Project Information */}
        <div className="bg-gray-50 p-4 rounded mb-4 text-left">
          <p className="mb-3">
            <strong>Project Title:</strong> {projectInfo.title}
          </p>
          <p className="mb-3">
            <strong>Student Name:</strong> {projectInfo.studentName}
          </p>
          <p className="mb-3">
            <strong>Year:</strong> {projectInfo.year}
          </p>
          <p className="mb-3">
            <strong>Project Summary:</strong> This project explores the use of
            artificial intelligence in diagnosing medical conditions using
            patient data.
          </p>
          <p className="mb-3">
            <strong>Technologies Used:</strong> Python, TensorFlow, Deep
            Learning
          </p>
          <p className="mb-0">
            <strong>Outcome:</strong> The model achieved 92% accuracy in
            diagnosing respiratory diseases.
          </p>
        </div>

        {/* Download Project Files */}
        <div className="mt-5 text-left">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Download Project Files
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => handleDownload("PDF")}
              className="block w-full p-3 text-base text-white bg-green-600 border-0 rounded text-center cursor-pointer hover:bg-green-700"
            >
              Download Report (PDF)
            </button>
            <button
              onClick={() => handleDownload("ZIP")}
              className="block w-full p-3 text-base text-white bg-green-600 border-0 rounded text-center cursor-pointer hover:bg-green-700"
            >
              Download Code (ZIP)
            </button>
          </div>
        </div>

        <Link
          to="/supervisor/previous-projects"
          className="inline-block mt-5 no-underline text-blue-600 font-bold hover:text-blue-800"
        >
          ← Back to Previous Projects
        </Link>
      </div>
    </div>
  );
};

export default PreviousProjectDetails;
