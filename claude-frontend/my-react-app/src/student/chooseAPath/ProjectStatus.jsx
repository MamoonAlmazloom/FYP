import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProjectStatus = () => {
  // Mock status - in real app this would come from API/context
  const [projectStatus] = useState({
    status: 'pending', // pending, approved, rejected, modify
    projectTitle: 'Machine Learning for Healthcare Diagnostics',
    submissionDate: '2025-06-01',
    supervisor: 'Dr. Sarah Johnson',
    comments: ''
  });

  const getStatusDisplay = () => {
    switch (projectStatus.status) {
      case 'pending':
        return {
          className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          text: 'Pending Review',
          icon: '⏳'
        };
      case 'approved':
        return {
          className: 'bg-green-100 text-green-800 border-green-300',
          text: 'Approved',
          icon: '✅'
        };
      case 'rejected':
        return {
          className: 'bg-red-100 text-red-800 border-red-300',
          text: 'Rejected',
          icon: '❌'
        };
      case 'modify':
        return {
          className: 'bg-blue-100 text-blue-800 border-blue-300',
          text: 'Requires Modification',
          icon: '🔄'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800 border-gray-300',
          text: 'Unknown Status',
          icon: '❓'
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Project Status
        </h2>
        
        {/* Project Information */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Project Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Project Title:</span>
              <span className="text-gray-800">{projectStatus.projectTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Submission Date:</span>
              <span className="text-gray-800">{projectStatus.submissionDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Supervisor:</span>
              <span className="text-gray-800">{projectStatus.supervisor}</span>
            </div>
          </div>
        </div>
        
        {/* Status Display */}
        <div className="mb-8">
          <p className="text-gray-600 text-center mb-4">Your project proposal's current status is:</p>
          <div className={`p-6 rounded-lg border-2 text-center text-xl font-semibold ${statusDisplay.className}`}>
            <span className="text-2xl mr-2">{statusDisplay.icon}</span>
            {statusDisplay.text}
          </div>
        </div>
        
        {/* Additional Actions based on status */}
        {projectStatus.status === 'approved' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-center mb-4">
              🎉 Congratulations! Your project has been approved. You can now proceed to project work.
            </p>
            <div className="text-center">
              <Link 
                to="/student/project-work" 
                className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
              >
                Start Project Work
              </Link>
            </div>
          </div>
        )}
        
        {projectStatus.status === 'modify' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-center mb-4">
              Your project requires modifications. Please review the feedback and resubmit.
            </p>
            <div className="text-center">
              <Link 
                to="/student/propose-project" 
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
              >
                Modify Proposal
              </Link>
            </div>
          </div>
        )}
        
        {projectStatus.status === 'rejected' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-center mb-4">
              Your project proposal has been rejected. You can submit a new proposal.
            </p>
            <div className="text-center">
              <Link 
                to="/student/choose-path" 
                className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
              >
                Submit New Proposal
              </Link>
            </div>
          </div>
        )}
        
        {/* Comments Section */}
        {projectStatus.comments && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Supervisor Comments:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{projectStatus.comments}</p>
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <div className="text-center">
          <Link 
            to="/student/choose-path" 
            className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
          >
            ← Back to Select a Path
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;