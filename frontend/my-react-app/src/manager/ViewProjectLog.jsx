import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useParams,
} from "react-router-dom";
import ManagerAPI from "../API/ManagerAPI";

const ViewProjectLog = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { projectId } = useParams();
  const [projectInfo, setProjectInfo] = useState({
    title: "",
    studentName: "",
  });
  const [logHistory, setLogHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const managerId = localStorage.getItem("userId") || "1";

  useEffect(() => {
    loadProjectLog();
  }, [projectId]);

  const loadProjectLog = async () => {
    try {
      setLoading(true);

      // Get project details from URL parameters as fallback
      const title = searchParams.get("title") || "Unknown Title";
      const studentName = searchParams.get("student") || "Unknown Student";
      setProjectInfo({
        title,
        studentName,
      });

      // Load the actual project logs from the database
      const response = await ManagerAPI.getProjectLogs(managerId, projectId);

      if (response.success && response.logs) {
        // Transform the logs to match the expected format
        const transformedLogs = response.logs.map((log) => ({
          id: log.log_id,
          date: new Date(log.submission_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          action: log.details || "Progress Log Submitted",
          by: `${log.student_name} (Student)`,
        }));

        setLogHistory(transformedLogs);
      } else {
        setLogHistory([]);
      }
    } catch (error) {
      console.error("Error loading project log:", error);
      setError("Error loading project log. Please try again.");
      setLogHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userProfile");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Manager Dashboard</h1>
                <p className="text-indigo-100 text-sm">
                  Final Year Project Management
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/manager/dashboard"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Home
              </Link>
              <Link
                to="/manager/manage-users"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Users
              </Link>
              <Link
                to="/manager/assign-examiners"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Examiners
              </Link>
              <Link
                to="/manager/previous-projects"
                className="text-white/90 hover:text-white font-medium transition-colors no-underline"
              >
                Archive
              </Link>
            </div>

            <button
              onClick={handleSignOut}
              className="group flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="transition-all duration-300 group-hover:tracking-wide">
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </div>{" "}
      <div className="max-w-4xl mx-auto mt-5 p-5 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          View Log History
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p>Loading project log...</p>
          </div>
        ) : (
          <>
            {/* Project Information */}{" "}
            <div className="bg-gray-50 p-4 rounded mb-4 text-left">
              <p className="mb-2">
                <strong>Project ID:</strong> {projectId}
              </p>
              <p className="mb-2">
                <strong>Project Title:</strong> {projectInfo.title}
              </p>
              <p className="mb-0">
                <strong>Student Name:</strong> {projectInfo.studentName}
              </p>
            </div>
            {/* Log Count */}
            <div className="bg-blue-600 text-white p-3 rounded text-base font-bold text-center mb-4">
              Total Progress Logs: {logHistory.length}
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
          </>
        )}

        <div className="text-center mt-6">
          <Link
            to="/manager/approved-projects-logs"
            className="inline-block text-blue-600 font-bold no-underline hover:text-blue-800"
          >
            ← Back to Approved Projects Logs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectLog;
