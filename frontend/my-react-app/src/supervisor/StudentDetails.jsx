import React, { useState, useEffect } from "react";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { getCurrentUser } from "../API/authAPI";
import { getStudentDetails } from "../API/SupervisorAPI";

const StudentDetails = () => {
  const { studentId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentInfo, setStudentInfo] = useState({
    name: "Unknown Student",
    title: "Unknown Title",
  });

  useEffect(() => {
    const loadStudentDetails = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }
        setUser(currentUser);

        if (studentId) {
          const response = await getStudentDetails(currentUser.id, studentId);
          if (response.success) {
            setStudent(response.student);
            setProjects(response.projects || []);
            setStudentInfo({
              name: response.student.name,
              title: response.projects?.[0]?.title || "No active project",
            });
          } else {
            setError(response.error || "Failed to load student details");
          }
        } else {
          // Fallback to URL params for backward compatibility
          const studentName = searchParams.get("student") || "Unknown Student";
          const projectTitle = searchParams.get("title") || "Unknown Title";
          setStudentInfo({
            name: studentName,
            title: projectTitle,
          });
        }
      } catch (err) {
        console.error("Error loading student details:", err);
        setError("Failed to load student details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadStudentDetails();
  }, [studentId, searchParams, navigate]);

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
          Student Details
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading student details...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : (
          <>
            {/* Student Information */}
            <div className="bg-gray-50 p-4 rounded mb-4 text-left">
              <p className="mb-2">
                <strong>Student Name:</strong> {studentInfo.name}
              </p>
              {student?.email && (
                <p className="mb-2">
                  <strong>Email:</strong> {student.email}
                </p>
              )}
              <p className="mb-2">
                <strong>Project Title:</strong> {studentInfo.title}
              </p>
              {projects.length > 0 && (
                <div className="mt-3">
                  <strong>Project Status:</strong>
                  <p className="text-gray-700">
                    Currently working on {projects.length} project(s)
                  </p>
                </div>
              )}
            </div>

            {/* Sections */}
            <div className="mt-5 rounded-lg bg-blue-50 pb-1">
              <h3 className="m-0 bg-gray-800 text-white p-3 rounded text-center font-bold">
                Progress Logs
              </h3>
              <div className="p-3">
                <Link
                  to={`/supervisor/view-progress-log/${
                    studentId || "legacy"
                  }?student=${encodeURIComponent(studentInfo.name)}`}
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
                  to={`/supervisor/view-progress-report/${
                    studentId || "legacy"
                  }?student=${encodeURIComponent(studentInfo.name)}`}
                  className="text-blue-600 font-bold no-underline hover:text-blue-800"
                >
                  View Reports
                </Link>
              </div>
            </div>

            {projects.length > 0 && (
              <div className="mt-5 rounded-lg bg-green-50 pb-1">
                <h3 className="m-0 bg-gray-800 text-white p-3 rounded text-center font-bold">
                  Active Projects
                </h3>
                <div className="p-3 text-left">
                  {projects.map((project, index) => (
                    <div
                      key={index}
                      className="mb-2 p-2 bg-white rounded border"
                    >
                      <p className="font-semibold">{project.title}</p>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {project.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

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
