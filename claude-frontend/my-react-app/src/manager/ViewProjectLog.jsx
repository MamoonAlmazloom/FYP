import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const ViewProjectLog = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [projectInfo, setProjectInfo] = useState({
    title: "",
    studentName: "",
    approvalDate: "March 1, 2025",
  });

  // Sample log history data - in real app this would come from API
  const [logHistory] = useState([
    {
      id: 1,
      date: "March 1, 2025",
      action: "Project Approved",
      by: "Dr. Emily Carter",
    },
    {
      id: 2,
      date: "February 20, 2025",
      action: "Proposal Reviewed & Updated",
      by: "Jane Smith (Student)",
    },
    {
      id: 3,
      date: "February 10, 2025",
      action: "Proposal Submitted",
      by: "Jane Smith (Student)",
    },
    {
      id: 4,
      date: "February 5, 2025",
      action: "Initial Project Discussion",
      by: "Dr. John Wilson (Supervisor)",
    },
    {
      id: 5,
      date: "January 30, 2025",
      action: "Student Registration",
      by: "Jane Smith (Student)",
    },
  ]);

  useEffect(() => {
    // Get project details from URL parameters
    const title = searchParams.get("title") || "Unknown Title";
    const studentName = searchParams.get("student") || "Unknown Student";

    setProjectInfo({
      title,
      studentName,
      approvalDate: "March 1, 2025",
    });
  }, [searchParams]);

  const handleSignOut = () => {
    navigate("/login");
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
            Moderation
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
        <h2 className="text-2xl font-bold mb-4">View Log History</h2>

        {/* Project Information */}
        <div className="bg-gray-50 p-4 rounded mb-4 text-left">
          <p className="mb-2">
            <strong>Project Title:</strong> {projectInfo.title}
          </p>
          <p className="mb-2">
            <strong>Student Name:</strong> {projectInfo.studentName}
          </p>
          <p className="mb-0">
            <strong>Approval Date:</strong> {projectInfo.approvalDate}
          </p>
        </div>

        {/* Log Count */}
        <div className="bg-blue-600 text-white p-3 rounded text-base font-bold text-center mb-4">
          Total Student Logs Submitted: {logHistory.length}
        </div>

        {/* Log History Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-5">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Date
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Action Taken
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  By
                </th>
              </tr>
            </thead>
            <tbody>
              {logHistory.map((log) => (
                <tr key={log.id}>
                  <td className="border border-gray-300 p-3 text-left">
                    {log.date}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    {log.action}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    {log.by}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Link
          to="/manager/approved-projects-logs"
          className="inline-block mt-5 text-blue-600 font-bold no-underline hover:text-blue-800"
        >
          ← Back to Approved Projects Logs
        </Link>
      </div>
    </div>
  );
};

export default ViewProjectLog;
