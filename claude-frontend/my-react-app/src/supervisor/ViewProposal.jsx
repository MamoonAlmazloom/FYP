import React from "react";
import { Link } from "react-router-dom";

const ViewProposal = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-12">
      <div className="max-w-2xl w-full mx-auto p-5 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          View Proposal
        </h2>

        <div className="bg-gray-50 p-4 rounded mt-3">
          <p className="mb-3">
            <strong>Title:</strong> AI-Based Medical Diagnosis System
          </p>
          <p className="mb-3">
            <strong>Submitted On:</strong> January 10, 2025
          </p>
          <p className="mb-3">
            <strong>Proposal Summary:</strong> The project aims to develop an AI
            model that assists doctors in diagnosing diseases based on patient
            symptoms and test results.
          </p>
          <p className="mb-3">
            <strong>Challenges:</strong> Data sourcing and model accuracy
            tuning.
          </p>
          <p className="mb-3">
            <strong>Status:</strong>{" "}
            <span className="text-yellow-600 font-bold">Pending</span>
          </p>
          <p className="mb-0">
            <strong>Supervisor Feedback:</strong> The project is well-structured
            but needs more focus on dataset selection.
          </p>
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
