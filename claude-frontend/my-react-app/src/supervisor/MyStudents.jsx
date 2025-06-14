import React from "react";
import { Link } from "react-router-dom";

const MyStudents = () => {
  const handleSignOut = () => {
    console.log("Sign out clicked");
  };

  const students = [
    {
      name: "John Doe",
      projectTitle: "AI-Based Medical Diagnosis System",
    },
    {
      name: "Jane Smith",
      projectTitle: "Blockchain for Secure Voting",
    },
    {
      name: "Mike Johnson",
      projectTitle: "Automated Inventory Management",
    },
  ];

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
          <span className="text-white no-underline mx-4 text-base font-bold">
            Logs
          </span>
          <span className="text-white no-underline mx-4 text-base font-bold">
            Reports
          </span>
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
          My Students List
        </h2>
        <p className="text-gray-600 mb-6">
          View and manage the students under your supervision.
        </p>

        {/* Student List Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-5">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Student Name
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Project Title
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-3 text-left">
                    {student?.name}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    {student?.projectTitle}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    <Link
                      to={`/supervisor/student-details?student=${encodeURIComponent(
                        student?.name || ""
                      )}&title=${encodeURIComponent(student?.projectTitle || "")}`}
                      className="px-3 py-2 bg-cyan-600 text-white border-0 rounded text-sm cursor-pointer no-underline hover:bg-cyan-700"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
