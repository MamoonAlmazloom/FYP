import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ExaminerDashboard = () => {
  const navigate = useNavigate();

  // Sample projects to examine data with marked status - in real app this would come from API
  const [projectsToExamine, setProjectsToExamine] = useState([
    {
      id: 1,
      title: "AI-Based Medical Diagnosis System",
      studentName: "John Doe",
      submissionDate: "March 5, 2025",
      examinationDate: "March 10, 2025",
      venue: "Room 205, Engineering Block",
      isMarked: false,
    },
    {
      id: 2,
      title: "Blockchain for Secure Voting",
      studentName: "Jane Smith",
      submissionDate: "March 3, 2025",
      examinationDate: "March 8, 2025",
      venue: "Room 102, IT Faculty",
      isMarked: true,
    },
    {
      id: 3,
      title: "Automated Inventory Management",
      studentName: "Mike Johnson",
      submissionDate: "March 1, 2025",
      examinationDate: "March 6, 2025",
      venue: "Hall A, Main Campus",
      isMarked: false,
    },
  ]);

  const handleSignOut = () => {
    // Handle sign out logic here
    navigate("/login");
  };

  const handleMarkProject = (projectId) => {
    setProjectsToExamine((projects) =>
      projects.map((project) =>
        project.id === projectId
          ? { ...project, isMarked: !project.isMarked }
          : project
      )
    );

    // In a real app, you would also make an API call here to save the status
    const project = projectsToExamine.find((p) => p.id === projectId);
    const newStatus = !project.isMarked;
    console.log(
      `Project "${project.title}" marked as ${
        newStatus ? "completed" : "pending"
      }`
    );
  };

  const completedCount = projectsToExamine.filter((p) => p.isMarked).length;
  const pendingCount = projectsToExamine.length - completedCount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-gray-800 text-white flex justify-between items-center px-5 py-4">
        <div className="text-xl font-bold">📑 Examiner Dashboard</div>
        <div className="flex-grow text-center">
          <Link
            to="/examiner/dashboard"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Home
          </Link>
          <Link
            to="#"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Assigned Projects
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

      {/* Examiner Info Header */}
      <div className="bg-gray-600 text-white px-4 py-4 text-base flex justify-around flex-wrap text-center">
        <span>
          <strong>Examiner Name:</strong> Dr. Robert Brown
        </span>
        <span>
          <strong>Department:</strong> Faculty of Engineering
        </span>
        <span>
          <strong>Total Projects:</strong> {projectsToExamine.length}
        </span>
        <span>
          <strong>Completed:</strong> {completedCount}
        </span>
        <span>
          <strong>Pending:</strong> {pendingCount}
        </span>
      </div>

      <div className="max-w-6xl mx-auto mt-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Projects to Examine</h2>
        <p className="mb-6">
          Review the examination schedule for assigned projects and mark them as
          completed.
        </p>

        {/* Projects to Examine Table */}
        <div className="overflow-x-auto">
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
                  Submission Date
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Examination Date
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Venue
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
              {projectsToExamine.map((project) => (
                <tr
                  key={project.id}
                  className={project.isMarked ? "bg-green-50" : ""}
                >
                  <td className="border border-gray-300 p-3 text-left">
                    {project.title}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    {project.studentName}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    {project.submissionDate}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    {project.examinationDate}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    {project.venue}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    <span
                      className={`px-2 py-1 rounded text-sm font-bold ${
                        project.isMarked
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {project.isMarked ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    <button
                      onClick={() => handleMarkProject(project.id)}
                      className={`px-3 py-2 border-none rounded cursor-pointer text-sm font-medium ${
                        project.isMarked
                          ? "bg-gray-500 text-white hover:bg-gray-600"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {project.isMarked ? "Unmark" : "Mark as Done"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {projectsToExamine.length === 0 && (
          <div className="mt-8 text-gray-600">
            <p>No projects assigned for examination at this time.</p>
          </div>
        )}

        {/* Summary Section */}
        {projectsToExamine.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Examination Progress</h3>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {completedCount}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingCount}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    (completedCount / projectsToExamine.length) * 100
                  )}
                  %
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExaminerDashboard;
