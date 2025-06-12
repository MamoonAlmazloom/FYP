import React from 'react';
import { Link } from 'react-router-dom';

const SupervisorDashboard = () => {
  const handleSignOut = () => {
    // Handle sign out logic here
    console.log('Sign out clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-blue-700 text-white flex justify-between items-center px-5 py-4">
        <div className="text-xl font-bold">📘 Supervisor Dashboard</div>
        <div className="flex-grow text-center">
          <Link to="/supervisor/dashboard" className="text-white no-underline mx-4 text-base font-bold hover:underline">
            Home
          </Link>
          <Link to="/supervisor/my-students" className="text-white no-underline mx-4 text-base font-bold hover:underline">
            Students
          </Link>
          <span className="text-white no-underline mx-4 text-base font-bold">Logs</span>
          <span className="text-white no-underline mx-4 text-base font-bold">Reports</span>
        </div>
        <button 
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 border-0 rounded text-sm cursor-pointer hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>

      {/* Supervisor Info Header */}
      <div className="bg-blue-600 text-white p-4 text-center text-base flex justify-around flex-wrap">
        <span><strong>Supervisor Name:</strong> Dr. Noor</span>
        <span><strong>Department:</strong> Computer Science</span>
        <span><strong>Current Students:</strong> 10</span>
      </div>

      <div className="max-w-4xl mx-auto my-5 p-5 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Monitor Student Progress</h2>
        <p className="text-gray-600 mb-6">Manage and track student progress under your supervision.</p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            to="/supervisor/proposed-titles" 
            className="block w-full p-4 text-white bg-orange-500 rounded text-center no-underline text-base hover:opacity-90"
          >
            Review Proposed Titles
          </Link>
          <Link 
            to="/supervisor/my-students" 
            className="block w-full p-4 text-white bg-orange-500 rounded text-center no-underline text-base hover:opacity-90"
          >
            My Student List
          </Link>
          <Link 
            to="/supervisor/previous-projects" 
            className="block w-full p-4 text-white bg-orange-500 rounded text-center no-underline text-base hover:opacity-90"
          >
            Previous Project Archive
          </Link>
          <Link 
            to="/supervisor/propose-project" 
            className="block w-full p-4 text-white bg-orange-500 rounded text-center no-underline text-base hover:opacity-90"
          >
            Propose a New Title
          </Link>
          <Link 
            to="/supervisor/modify-proposal" 
            className="block w-full p-4 text-white bg-orange-500 rounded text-center no-underline text-base hover:opacity-90"
          >
            Modify Proposal
          </Link>
          <Link 
            to="/supervisor/view-proposal" 
            className="block w-full p-4 text-white bg-orange-500 rounded text-center no-underline text-base hover:opacity-90"
          >
            View Proposal
          </Link>
        </div>

        {/* Notification Center */}
        <div className="bg-yellow-300 p-4 rounded mt-5 text-sm text-black border border-yellow-600 text-left">
          <h3 className="m-0 mb-3 text-black">🔔 Notification Center</h3>
          <p className="mb-2"><strong>Reminder:</strong> Review pending student proposals.</p>
          <p className="mb-0"><strong>Update:</strong> A student has submitted a modified proposal for approval.</p>
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;