// ProjectWork.jsx - Copy content from artifact 'project_work'
import { Link } from "react-router-dom";

const ProjectWork = () => {
  // Mock student and project data - in real app this would come from API/context
  const studentData = {
    name: "John Doe",
    studentId: "12345678",
    supervisor: "Dr. Noor",
    projectTitle: "AI-Based Medical Diagnosis System",
  };

  const handleSignOut = () => {
    // Handle sign out logic
    console.log("Signing out...");
    // In real app, this would clear auth tokens and redirect to login
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-blue-700 text-white flex justify-between items-center px-5 py-4">
        <div className="text-xl font-bold">📘 FYP Portal</div>
        <div className="flex-grow text-center">
          <Link
            to="/student/project-work"
            className="text-white no-underline mx-4 font-bold hover:underline"
          >
            Dashboard
          </Link>
          <Link
            to="/student/choose-path"
            className="text-white no-underline mx-4 font-bold hover:underline"
          >
            Projects
          </Link>
          <Link
            to="#"
            className="text-white no-underline mx-4 font-bold hover:underline"
          >
            Help
          </Link>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Student Info Header */}
      <div className="bg-blue-600 text-white p-4 text-center">
        <div className="flex flex-wrap justify-around text-sm md:text-base">
          <span>
            <strong>Student Name:</strong> {studentData.name}
          </span>
          <span>
            <strong>Student ID:</strong> {studentData.studentId}
          </span>
          <span>
            <strong>Supervisor:</strong> {studentData.supervisor}
          </span>
          <span>
            <strong>Project Title:</strong> {studentData.projectTitle}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto mt-5 p-5 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Project Work
        </h2>

        <div className="space-y-3">
          <Link
            to="/student/progress-log-form"
            className="block w-full py-4 px-6 text-center text-white bg-red-800 hover:bg-red-900 rounded-lg transition-colors duration-200 no-underline"
          >
            Log Submission
          </Link>

          <Link
            to="/student/select-log"
            className="block w-full py-4 px-6 text-center text-white bg-red-800 hover:bg-red-900 rounded-lg transition-colors duration-200 no-underline"
          >
            View Logs
          </Link>

          <Link
            to="/student/progress-report-form"
            className="block w-full py-4 px-6 text-center text-white bg-red-800 hover:bg-red-900 rounded-lg transition-colors duration-200 no-underline"
          >
            Report Submission
          </Link>

          <Link
            to="/student/select-report"
            className="block w-full py-4 px-6 text-center text-white bg-red-800 hover:bg-red-900 rounded-lg transition-colors duration-200 no-underline"
          >
            View Reports
          </Link>

          <Link
            to="/student/modify-proposal"
            className="block w-full py-4 px-6 text-center text-white bg-red-800 hover:bg-red-900 rounded-lg transition-colors duration-200 no-underline"
          >
            Modify Proposal
          </Link>

          <Link
            to="/student/view-proposal"
            className="block w-full py-4 px-6 text-center text-white bg-red-800 hover:bg-red-900 rounded-lg transition-colors duration-200 no-underline"
          >
            View Proposal
          </Link>
        </div>

        {/* Notification Center */}
        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
          <h3 className="text-lg font-semibold text-black mb-3">
            🔔 Notification Center
          </h3>
          <div className="space-y-2 text-sm text-black">
            <p>
              <strong>Reminder:</strong> Your next report submission is due in 3
              days.
            </p>
            <p>
              <strong>Update:</strong> Supervisor feedback available on your
              last submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectWork;