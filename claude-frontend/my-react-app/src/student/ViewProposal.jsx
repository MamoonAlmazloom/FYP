// ViewProposal.jsx - Copy content from artifact 'view_proposal'
import { Link } from "react-router-dom";

const ViewProposal = () => {
  // Mock proposal data - in real app this would come from API
  const proposalData = {
    title: "AI-Based Medical Diagnosis System",
    submittedOn: "2025-01-10",
    lastModified: "2025-01-15",
    status: "approved",
    proposalSummary:
      "The project aims to develop an AI model that assists doctors in diagnosing diseases based on patient symptoms and test results. The system will utilize machine learning algorithms to analyze medical data and provide diagnostic suggestions with confidence levels.",
    objectives: [
      "Develop a machine learning model for medical diagnosis assistance",
      "Create a user-friendly interface for healthcare professionals",
      "Achieve at least 85% accuracy in diagnostic predictions",
      "Implement real-time processing capabilities",
      "Ensure data privacy and security compliance",
    ],
    methodology:
      "The project will follow an agile development approach with iterative cycles. Data collection will be performed from anonymized medical records. Multiple ML algorithms including Random Forest, SVM, and Neural Networks will be evaluated. The system will be developed using Python, TensorFlow, and Flask for the web interface.",
    expectedOutcome:
      "A functional AI-based diagnostic assistance system that can help healthcare professionals make more accurate and faster diagnoses. The system should reduce diagnostic errors and improve patient outcomes.",
    timeline: [
      {
        phase: "Literature Review & Data Collection",
        duration: "4 weeks",
        status: "completed",
      },
      {
        phase: "Data Preprocessing & Analysis",
        duration: "3 weeks",
        status: "completed",
      },
      {
        phase: "Model Development & Training",
        duration: "6 weeks",
        status: "in-progress",
      },
      {
        phase: "System Integration & Testing",
        duration: "4 weeks",
        status: "pending",
      },
      {
        phase: "Documentation & Presentation",
        duration: "2 weeks",
        status: "pending",
      },
    ],
    resources: [
      "High-performance computing cluster for model training",
      "Access to anonymized medical datasets",
      "Healthcare domain expert consultation",
      "Software licenses (TensorFlow, development tools)",
    ],
    challenges:
      "Data sourcing and model accuracy tuning. Ensuring compliance with healthcare data regulations. Addressing potential bias in medical datasets.",
    supervisor: {
      name: "Dr. Sarah Johnson",
      department: "Computer Science",
      email: "sarah.johnson@university.edu",
    },
    coSupervisor: {
      name: "Dr. Michael Chen",
      department: "Medical Informatics",
      email: "michael.chen@medical.edu",
    },
    approvalDate: "2025-01-20",
    comments:
      "Excellent proposal with clear objectives and methodology. The healthcare application is highly relevant. Consider exploring additional datasets for better generalization.",
    attachments: [
      "proposal_full_document.pdf",
      "literature_review.pdf",
      "data_collection_plan.docx",
      "ethical_approval_form.pdf",
    ],
  };

  const getStatusBadge = () => {
    switch (proposalData.status) {
      case "approved":
        return (
          <span className="px-4 py-2 bg-green-100 text-green-800 text-lg rounded-full font-semibold">
            ✅ Approved
          </span>
        );
      case "pending":
        return (
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 text-lg rounded-full font-semibold">
            ⏳ Pending
          </span>
        );
      case "rejected":
        return (
          <span className="px-4 py-2 bg-red-100 text-red-800 text-lg rounded-full font-semibold">
            ❌ Rejected
          </span>
        );
      case "needs-revision":
        return (
          <span className="px-4 py-2 bg-blue-100 text-blue-800 text-lg rounded-full font-semibold">
            🔄 Needs Revision
          </span>
        );
      default:
        return (
          <span className="px-4 py-2 bg-gray-100 text-gray-800 text-lg rounded-full font-semibold">
            ❓ Unknown
          </span>
        );
    }
  };

  const getPhaseStatus = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
            ✓ Completed
          </span>
        );
      case "in-progress":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            🔄 In Progress
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
            ⏳ Pending
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-3xl font-bold text-gray-800">
                Project Proposal
              </h2>
              {getStatusBadge()}
            </div>
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              {proposalData.title}
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Submitted:</span>{" "}
                {new Date(proposalData.submittedOn).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Last Modified:</span>{" "}
                {new Date(proposalData.lastModified).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Approved:</span>{" "}
                {new Date(proposalData.approvalDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Supervisors */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                👨‍🏫 Primary Supervisor
              </h3>
              <div className="space-y-1 text-blue-700">
                <p className="font-medium">{proposalData.supervisor.name}</p>
                <p className="text-sm">{proposalData.supervisor.department}</p>
                <p className="text-sm">{proposalData.supervisor.email}</p>
              </div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">
                👩‍🏫 Co-Supervisor
              </h3>
              <div className="space-y-1 text-purple-700">
                <p className="font-medium">{proposalData.coSupervisor.name}</p>
                <p className="text-sm">
                  {proposalData.coSupervisor.department}
                </p>
                <p className="text-sm">{proposalData.coSupervisor.email}</p>
              </div>
            </div>
          </div>

          {/* Proposal Content */}
          <div className="space-y-8">
            {/* Proposal Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📋 Proposal Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {proposalData.proposalSummary}
              </p>
            </div>

            {/* Objectives */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                🎯 Project Objectives
              </h3>
              <ul className="space-y-2">
                {proposalData.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-green-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Methodology */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                🔬 Methodology
              </h3>
              <p className="text-blue-700 leading-relaxed">
                {proposalData.methodology}
              </p>
            </div>

            {/* Timeline */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">
                📅 Project Timeline
              </h3>
              <div className="space-y-3">
                {proposalData.timeline.map((phase, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-white rounded border"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">
                        {phase.phase}
                      </span>
                      <p className="text-sm text-gray-600">
                        Duration: {phase.duration}
                      </p>
                    </div>
                    {getPhaseStatus(phase.status)}
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-orange-800 mb-4">
                🛠️ Required Resources
              </h3>
              <ul className="space-y-2">
                {proposalData.resources.map((resource, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-orange-600 mt-1">•</span>
                    <span className="text-orange-700">{resource}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expected Outcome */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                🎖️ Expected Outcome
              </h3>
              <p className="text-indigo-700 leading-relaxed">
                {proposalData.expectedOutcome}
              </p>
            </div>

            {/* Challenges */}
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-red-800 mb-4">
                ⚠️ Anticipated Challenges
              </h3>
              <p className="text-red-700 leading-relaxed">
                {proposalData.challenges}
              </p>
            </div>

            {/* Approval Comments */}
            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
              <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                💬 Approval Comments
              </h3>
              <p className="text-yellow-700 leading-relaxed">
                {proposalData.comments}
              </p>
            </div>

            {/* Attachments */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📎 Attachments
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {proposalData.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-white rounded border"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-gray-700 flex-1">{attachment}</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              📄 Download Full Proposal
            </button>
            <Link
              to="/student/modify-proposal"
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors no-underline"
            >
              ✏️ Request Modification
            </Link>
            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              📧 Share Proposal
            </button>
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              📊 View Analytics
            </button>
          </div>

          {/* Navigation */}
          <div className="text-center mt-8">
            <Link
              to="/student/project-work"
              className="inline-block text-blue-600 hover:text-blue-800 font-bold no-underline transition-colors"
            >
              ← Back to Project Work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProposal;