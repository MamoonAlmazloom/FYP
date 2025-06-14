import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../API/authAPI";
import { getStudentsBySupervisor } from "../API/SupervisorAPI";

const MyStudents = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }
        setUser(currentUser);

        const response = await getStudentsBySupervisor(currentUser.id, true);
        if (response.success) {
          setStudents(response.students);
        } else {
          setError(response.error || "Failed to load students");
        }
      } catch (err) {
        console.error("Error loading students:", err);
        setError("Failed to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
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
          <Link
            to="/supervisor/approved-projects-logs"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Logs
          </Link>
          <Link
            to="/supervisor/progress-reports"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Reports
          </Link>
        </div>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 border-0 rounded text-sm cursor-pointer hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>{" "}
      <div className="max-w-4xl mx-auto my-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          My Students List
        </h2>
        <p className="text-gray-600 mb-6">
          View and manage the students under your supervision.
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading students...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : students.length === 0 ? (
          <div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-8 rounded">
            <p className="text-lg">
              No active students found under your supervision.
            </p>
            <p className="text-sm mt-2">
              Students will appear here once they have approved projects.
            </p>
          </div>
        ) : (
          /* Student List Table */
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mt-5">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Student Name
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Email
                  </th>
                  <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.user_id}>
                    <td className="border border-gray-300 p-3 text-left">
                      {student.name}
                    </td>
                    <td className="border border-gray-300 p-3 text-left">
                      {student.email}
                    </td>
                    <td className="border border-gray-300 p-3 text-left">
                      <Link
                        to={`/supervisor/student-details/${student.user_id}`}
                        className="px-3 py-2 bg-cyan-600 text-white border-0 rounded text-sm cursor-pointer no-underline hover:bg-cyan-700"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link
          to="/supervisor/dashboard"
          className="inline-block mt-5 no-underline text-blue-600 font-bold hover:text-blue-800"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default MyStudents;
