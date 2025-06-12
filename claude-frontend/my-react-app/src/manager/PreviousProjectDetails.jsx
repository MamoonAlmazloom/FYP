import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const PreviousProjectDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [projectDetails, setProjectDetails] = useState({
    title: "",
    studentName: "",
    year: "",
    summary: "",
    technologies: "",
    outcome: "",
  });

  useEffect(() => {
    // Get project details from URL parameters
    const title = searchParams.get("title") || "Unknown Title";
    const studentName = searchParams.get("student") || "Unknown Student";
    const year = searchParams.get("year") || "Unknown Year";

    // In a real app, you would fetch project details from API based on the parameters
    setProjectDetails({
      title,
      studentName,
      year,
      summary:
        "This project explores the use of artificial intelligence in diagnosing medical conditions using patient data.",
      technologies: "Python, TensorFlow, Deep Learning",
      outcome:
        "The model achieved 92% accuracy in diagnosing respiratory diseases.",
    });
  }, [searchParams]);

  const handleSignOut = () => {
    navigate("/login");
  };

  const handleDownload = (fileType) => {
    // In a real app, this would trigger actual file download
    alert(`Downloading ${fileType} for project: ${projectDetails.title}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-gray-800 text-white flex justify-between items-center px-5 py-4">
        <div className="text-xl font-bold">📊 Manager Dashboard</div>
        <div className="flex-grow text-center">
          <Link
            to="/manager/dashboard"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Home
          </Link>
          <Link
            to="#"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Students
          </Link>
          <Link
            to="#"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Logs
          </Link>
          <Link
            to="#"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Reports
          </Link>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      <div className="max-w-4xl mx-auto mt-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">
          View Previous Project Details
        </h2>

        {/* Project Information */}
        <div className="bg-gray-50 p-4 rounded mb-4 text-left">
          <p className="mb-2">
            <strong>Project Title:</strong> {projectDetails.title}
          </p>
          <p className="mb-2">
            <strong>Student Name:</strong> {projectDetails.studentName}
          </p>
          <p className="mb-2">
            <strong>Year:</strong> {projectDetails.year}
          </p>
          <p className="mb-2">
            <strong>Project Summary:</strong> {projectDetails.summary}
          </p>
          <p className="mb-2">
            <strong>Technologies Used:</strong> {projectDetails.technologies}
          </p>
          <p className="mb-0">
            <strong>Outcome:</strong> {projectDetails.outcome}
          </p>
        </div>

        {/* Download Project Files */}
        <div className="mt-5 text-left">
          <h3 className="text-lg font-bold mb-4">Download Project Files</h3>
          <div className="space-y-3">
            <button
              onClick={() => handleDownload("Report (PDF)")}
              className="block w-full p-3 text-base text-white bg-green-600 border-none rounded cursor-pointer text-center hover:bg-green-700"
            >
              Download Report (PDF)
            </button>
            <button
              onClick={() => handleDownload("Code (ZIP)")}
              className="block w-full p-3 text-base text-white bg-green-600 border-none rounded cursor-pointer text-center hover:bg-green-700"
            >
              Download Code (ZIP)
            </button>
          </div>
        </div>

        <Link
          to="/manager/previous-projects"
          className="inline-block mt-5 text-blue-600 font-bold no-underline hover:text-blue-800"
        >
          ← Back to Previous Projects
        </Link>
      </div>
    </div>
  );
};

export default PreviousProjectDetails;
