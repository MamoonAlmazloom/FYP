import React from "react";
import { Link, useNavigate } from "react-router-dom";

const PreviousProjects = () => {
  const navigate = useNavigate();

  // Sample previous projects data - in real app this would come from API
  const previousProjects = [
    {
      id: 1,
      title: "AI-Based Medical Diagnosis System",
      studentName: "John Doe",
      year: "2023",
    },
    {
      id: 2,
      title: "Blockchain for Secure Voting",
      studentName: "Jane Smith",
      year: "2022",
    },
    {
      id: 3,
      title: "Automated Inventory Management",
      studentName: "Mike Johnson",
      year: "2021",
    },
  ];

  const handleSignOut = () => {
    navigate("/login");
  };

  const handleViewProject = (projectTitle, studentName, year) => {
    navigate(
      `/manager/previous-project-details?title=${encodeURIComponent(
        projectTitle
      )}&student=${encodeURIComponent(studentName)}&year=${year}`
    );
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
        <h2 className="text-2xl font-bold mb-4">Previous Projects Archive</h2>
        <p className="mb-6">View past approved projects for reference.</p>

        {/* Previous Projects Table */}
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
                  Year
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {previousProjects.map((project) => (
                <tr key={project.id}>
                  <td className="border border-gray-300 p-3 text-left">
                    {project.title}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    {project.studentName}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    {project.year}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    <button
                      onClick={() =>
                        handleViewProject(
                          project.title,
                          project.studentName,
                          project.year
                        )
                      }
                      className="px-3 py-2 bg-cyan-600 text-white border-none rounded cursor-pointer text-sm no-underline hover:bg-cyan-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Link
          to="/manager/dashboard"
          className="inline-block mt-5 text-blue-600 font-bold no-underline hover:text-blue-800"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PreviousProjects;
