import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../API/authAPI";
import { getPreviousProjects } from "../API/SupervisorAPI";

const PreviousProjects = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPreviousProjects = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }
        setUser(currentUser);
        const response = await getPreviousProjects(currentUser.id);
        if (response.success) {
          console.log("Previous projects loaded:", response.projects);
          setProjects(response.projects);
        } else {
          setError(response.error || "Failed to load previous projects");
        }
      } catch (err) {
        console.error("Error loading previous projects:", err);
        setError("Failed to load previous projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadPreviousProjects();
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
      </div>

      <div className="max-w-4xl mx-auto my-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Previous Projects Archive
        </h2>
        <p className="text-gray-600 mb-6">
          View past approved projects for reference.
        </p>{" "}
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">
              Loading previous projects...
            </span>
          </div>
        )}
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {/* Previous Projects Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">No previous projects found</p>
                <p className="text-sm">
                  Historical project data will appear here once available.
                </p>
              </div>
            ) : (
              <table className="w-full border-collapse mt-5">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                      Project Title
                    </th>
                    <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                      Student Name
                    </th>

                    <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                      Status
                    </th>
                    <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, index) => (
                    <tr key={project.id || index}>
                      <td className="border border-gray-300 p-3 text-left">
                        {project.title}
                      </td>
                      <td className="border border-gray-300 p-3 text-left">
                        {project.student_name}
                      </td>

                      <td className="border border-gray-300 p-3 text-left">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {project.status || "Completed"}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-3 text-left">
                        <Link
                          to={`/supervisor/previous-project-details/${project.id}`}
                          className="px-3 py-2 bg-cyan-600 text-white border-0 rounded text-sm cursor-pointer no-underline hover:bg-cyan-700"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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

export default PreviousProjects;
