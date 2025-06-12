import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AssignExaminers = () => {
  const navigate = useNavigate();

  // Sample project data - in real app this would come from API
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "AI-Based Medical Diagnosis System",
      studentName: "John Doe",
      examiner: "",
    },
    {
      id: 2,
      title: "Blockchain for Secure Voting",
      studentName: "Jane Smith",
      examiner: "",
    },
    {
      id: 3,
      title: "Automated Inventory Management",
      studentName: "Mike Johnson",
      examiner: "",
    },
  ]);

  // Sample examiner options
  const examiners = ["Dr. Smith", "Prof. Adams", "Dr. Lee"];

  const handleSignOut = () => {
    navigate("/login");
  };

  const handleExaminerChange = (projectId, examiner) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId ? { ...project, examiner } : project
      )
    );
  };

  const handleAssign = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project.examiner) {
      alert("Please select an examiner first");
      return;
    }

    // Add API call logic here
    console.log(`Assigning ${project.examiner} to project: ${project.title}`);
    alert(`Successfully assigned ${project.examiner} to ${project.title}`);
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
        <h2 className="text-2xl font-bold mb-4">Assign Examiners</h2>
        <p className="mb-6">Select an examiner for each project.</p>

        {/* Assign Examiners Table */}
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
                  Assign Examiner
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="border border-gray-300 p-3 text-left">
                    {project.title}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    {project.studentName}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    <select
                      value={project.examiner}
                      onChange={(e) =>
                        handleExaminerChange(project.id, e.target.value)
                      }
                      className="w-full p-2 rounded border border-gray-300"
                    >
                      <option value="">Select Examiner</option>
                      {examiners.map((examiner) => (
                        <option key={examiner} value={examiner}>
                          {examiner}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    <button
                      onClick={() => handleAssign(project.id)}
                      className="px-3 py-2 bg-green-600 text-white border-none rounded cursor-pointer text-sm hover:bg-green-700"
                    >
                      Assign
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
          ← Back to Manager Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AssignExaminers;
