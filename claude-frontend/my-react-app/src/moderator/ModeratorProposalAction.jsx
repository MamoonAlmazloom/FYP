import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const ModeratorProposalAction = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [proposalDetails, setProposalDetails] = useState({
    studentName: "",
    projectTitle: "",
    summary: "",
  });

  useEffect(() => {
    // Get proposal details from URL parameters
    const studentName = searchParams.get("student") || "Unknown Student";
    const projectTitle = searchParams.get("title") || "Unknown Title";

    setProposalDetails({
      studentName,
      projectTitle,
      summary:
        "The student has submitted a proposal for review. Review the details and take the appropriate action.",
    });
  }, [searchParams]);

  const handleSignOut = () => {
    navigate("/login");
  };

  const handleDecision = (decision) => {
    // In a real app, this would make an API call to save the decision
    let message = "";
    switch (decision) {
      case "approve":
        message = `Proposal "${proposalDetails.projectTitle}" by ${proposalDetails.studentName} has been approved.`;
        break;
      case "modify":
        message = `Modification requested for proposal "${proposalDetails.projectTitle}" by ${proposalDetails.studentName}.`;
        break;
      case "reject":
        message = `Proposal "${proposalDetails.projectTitle}" by ${proposalDetails.studentName} has been rejected.`;
        break;
      default:
        message = "Action completed.";
    }

    alert(message);
    // Navigate back to proposed titles after action
    navigate("/moderator/proposed-titles");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-gray-800 text-white flex justify-between items-center px-5 py-4">
        <div className="text-xl font-bold">🔍 Moderator Dashboard</div>
        <div className="flex-grow text-center">
          <Link
            to="/moderator/dashboard"
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

      <div className="max-w-2xl mx-auto mt-10 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Submit Proposal Decision</h2>

        <div className="bg-gray-50 p-4 rounded mb-4 text-left">
          <p className="mb-2">
            <strong>Student Name:</strong> {proposalDetails.studentName}
          </p>
          <p className="mb-2">
            <strong>Project Title:</strong> {proposalDetails.projectTitle}
          </p>
          <p className="mb-0">
            <strong>Proposal Summary:</strong> {proposalDetails.summary}
          </p>
        </div>

        {/* Decision Buttons */}
        <div className="flex justify-between mt-5 space-x-4">
          <button
            onClick={() => handleDecision("approve")}
            className="flex-1 p-3 text-base text-white bg-green-600 border-none rounded cursor-pointer hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => handleDecision("modify")}
            className="flex-1 p-3 text-base text-black bg-yellow-500 border-none rounded cursor-pointer hover:bg-yellow-600"
          >
            Request Modification
          </button>
          <button
            onClick={() => handleDecision("reject")}
            className="flex-1 p-3 text-base text-white bg-red-600 border-none rounded cursor-pointer hover:bg-red-700"
          >
            Reject
          </button>
        </div>

        <Link
          to="/moderator/proposed-titles"
          className="inline-block mt-5 text-blue-600 font-bold no-underline hover:text-blue-800"
        >
          ← Back to Proposed Titles
        </Link>
      </div>
    </div>
  );
};

export default ModeratorProposalAction;
