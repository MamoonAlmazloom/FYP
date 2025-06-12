import React from "react";
import { Link } from "react-router-dom";

const ProposedTitles = () => {
  const handleSignOut = () => {
    console.log("Sign out clicked");
  };

  const proposals = [
    {
      studentName: "John Doe",
      proposedTitle: "AI-Based Medical Diagnosis System",
    },
    {
      studentName: "Jane Smith",
      proposedTitle: "Blockchain for Secure Voting",
    },
    {
      studentName: "Mike Johnson",
      proposedTitle: "Automated Inventory Management",
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
          Review Proposed Titles
        </h2>
        <p className="text-gray-600 mb-6">
          Select a proposal to review and take action.
        </p>

        {/* Proposed Titles Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-5">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Student Name
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Proposed Title
                </th>
                <th className="border border-gray-300 p-3 text-left bg-blue-600 text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-3 text-left">
                    {proposal.studentName}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    {proposal.proposedTitle}
                  </td>
                  <td className="border border-gray-300 p-3 text-left">
                    <Link
                      to={`/supervisor/proposal-action?title=${encodeURIComponent(
                        proposal.proposedTitle
                      )}&student=${encodeURIComponent(proposal.studentName)}`}
                      className="px-3 py-2 bg-cyan-600 text-white border-0 rounded text-sm cursor-pointer no-underline hover:bg-cyan-700"
                    >
                      Action
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

export default ProposedTitles;
