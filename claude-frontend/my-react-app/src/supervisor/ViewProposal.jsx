import React from "react";
import { Link } from "react-router-dom";

const ViewProposal = () => {
  // Mock proposal data - in real app this would come from API
  const proposalData = {
    title: "AI-Based Medical Diagnosis System",
    submittedOn: "2025-01-10",
    proposalSummary:
      "The project aims to develop an AI model that assists doctors in diagnosing diseases based on patient symptoms and test results. The system will utilize machine learning algorithms to analyze medical data and provide diagnostic suggestions with confidence levels.",
    challenges: "Data sourcing and model accuracy tuning. Ensuring compliance with healthcare data regulations.",
    status: "Pending", // Example: Pending, Approved, Rejected
    supervisorFeedback: "The project is well-structured but needs more focus on dataset selection.",
    submitter_name: "John Doe", // Added as per typical data model
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-green-600 font-bold";
      case "rejected":
        return "text-red-600 font-bold";
      case "pending":
        return "text-yellow-600 font-bold";
      default:
        return "text-gray-600 font-bold";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-12">
      <div className="max-w-2xl w-full mx-auto p-5 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          View Proposal Details
        </h2>

        <div className="bg-gray-50 p-6 rounded-lg mt-3 space-y-4">
          <div>
            <strong className="block text-gray-700">Title:</strong>
            <span className="text-gray-900">{proposalData?.title || "N/A"}</span>
          </div>
          <div>
            <strong className="block text-gray-700">Submitted By:</strong>
            <span className="text-gray-900">{proposalData?.submitter_name || "N/A"}</span>
          </div>
          <div>
            <strong className="block text-gray-700">Submitted On:</strong>
            <span className="text-gray-900">
              {proposalData?.submittedOn
                ? new Date(proposalData.submittedOn).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div>
            <strong className="block text-gray-700">Proposal Summary:</strong>
            <p className="text-gray-900 whitespace-pre-wrap">
              {proposalData?.proposalSummary || "N/A"}
            </p>
          </div>
          <div>
            <strong className="block text-gray-700">Anticipated Challenges:</strong>
            <p className="text-gray-900 whitespace-pre-wrap">
              {proposalData?.challenges || "N/A"}
            </p>
          </div>
          <div>
            <strong className="block text-gray-700">Status:</strong>
            <span className={getStatusClass(proposalData?.status)}>
              {proposalData?.status || "Unknown"}
            </span>
          </div>
          <div>
            <strong className="block text-gray-700">Supervisor Feedback:</strong>
            <p className="text-gray-900 whitespace-pre-wrap">
              {proposalData?.supervisorFeedback || "No feedback yet."}
            </p>
          </div>
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

export default ViewProposal;
