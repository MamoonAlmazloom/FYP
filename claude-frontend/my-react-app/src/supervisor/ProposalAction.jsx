import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ProposalAction = () => {
  const [searchParams] = useSearchParams();
  const [proposalInfo, setProposalInfo] = useState({
    studentName: "Unknown Student",
    projectTitle: "Unknown Title",
  });

  useEffect(() => {
    const studentName = searchParams.get("student") || "Unknown Student";
    const projectTitle = searchParams.get("title") || "Unknown Title";

    setProposalInfo({
      studentName,
      projectTitle,
    });
  }, [searchParams]);

  const handleSignOut = () => {
    console.log("Sign out clicked");
  };

  const handleDecision = (decision) => {
    console.log(
      `Decision: ${decision} for student: ${proposalInfo.studentName}`
    );
    // Handle decision logic here
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

      <div className="max-w-2xl mx-auto my-10 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Submit Proposal Decision
        </h2>

        <div className="bg-gray-50 p-4 rounded mb-4 text-left">
          <p className="mb-2">
            <strong>Student Name:</strong> {proposalInfo.studentName}
          </p>
          <p className="mb-2">
            <strong>Project Title:</strong> {proposalInfo.projectTitle}
          </p>
          <p className="mb-0">
            <strong>Proposal Summary:</strong> The student has submitted a
            proposal for review. Review the details and take the appropriate
            action.
          </p>
        </div>

        {/* Decision Buttons */}
        <div className="flex justify-between mt-5 gap-3">
          <button
            onClick={() => handleDecision("approve")}
            className="flex-1 p-3 text-base text-white bg-green-600 border-0 rounded cursor-pointer hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => handleDecision("modify")}
            className="flex-1 p-3 text-base text-black bg-yellow-400 border-0 rounded cursor-pointer hover:bg-yellow-500"
          >
            Request Modification
          </button>
          <button
            onClick={() => handleDecision("reject")}
            className="flex-1 p-3 text-base text-white bg-red-600 border-0 rounded cursor-pointer hover:bg-red-700"
          >
            Reject
          </button>
        </div>

        <Link
          to="/supervisor/proposed-titles"
          className="inline-block mt-5 no-underline text-blue-600 font-bold hover:text-blue-800"
        >
          ← Back to Proposed Titles
        </Link>
      </div>
    </div>
  );
};

export default ProposalAction;
