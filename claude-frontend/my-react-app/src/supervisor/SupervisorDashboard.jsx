import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../API/authAPI";
import {
  getStudentsBySupervisor,
  getProposalsBySupervisor,
} from "../API/SupervisorAPI";

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    pendingProposals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }
        setUser(currentUser);

        // Fetch dashboard data
        const [studentsResponse, proposalsResponse] = await Promise.all([
          getStudentsBySupervisor(currentUser.id, true),
          getProposalsBySupervisor(currentUser.id),
        ]);

        setDashboardData({
          totalStudents: studentsResponse.success
            ? studentsResponse.students.length
            : 0,
          pendingProposals: proposalsResponse.success
            ? proposalsResponse.proposals.filter(
                (p) => p.status_name === "Pending"
              ).length
            : 0,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center px-5 py-4 shadow-lg">
        <div className="text-xl font-bold flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            📘
          </div>
          Supervisor Dashboard
        </div>
        <div className="flex-grow text-center">
          <Link
            to="/supervisor/dashboard"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Home
          </Link>{" "}
          <Link
            to="/supervisor/my-students"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Students
          </Link>
          <Link
            to="/supervisor/approved-projects-logs"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Logs
          </Link>
          <Link
            to="/supervisor/progress-reports"
            className="text-white no-underline mx-4 text-base font-bold hover:underline"
          >
            Reports
          </Link>
        </div>{" "}
        <button
          onClick={handleSignOut}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 border-0 rounded-lg text-sm cursor-pointer hover:from-red-600 hover:to-red-700 shadow-lg transition-all"
        >
          Sign Out
        </button>
      </div>{" "}
      {/* Supervisor Info Header */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4 text-center text-base flex justify-around flex-wrap shadow-md">
        <span className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 m-1">
          <strong>Supervisor Name:</strong> {user?.name || "Loading..."}
        </span>
        <span className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 m-1">
          <strong>Department:</strong> Computer Science
        </span>
        <span className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 m-1">
          <strong>Current Students:</strong>{" "}
          {loading ? "Loading..." : dashboardData.totalStudents}
        </span>
      </div>
      <div className="max-w-4xl mx-auto my-8 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Monitor Student Progress
        </h2>
        <p className="text-gray-600 mb-6">
          Manage and track student progress under your supervision.
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading dashboard...</span>
          </div>
        ) : (
          <>
            {" "}
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800">
                  Active Students
                </h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {dashboardData.totalStudents}
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-800">
                  Pending Proposals
                </h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                  {dashboardData.pendingProposals}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800">
                  Department
                </h3>
                <p className="text-sm font-semibold text-green-600">
                  Computer Science
                </p>
              </div>
            </div>{" "}
            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to="/supervisor/proposed-titles"
                className="block w-full p-4 text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-center no-underline text-base hover:from-orange-600 hover:to-orange-700 shadow-lg transition-all transform hover:scale-105"
              >
                Review Proposed Titles ({dashboardData.pendingProposals})
              </Link>
              <Link
                to="/supervisor/my-students"
                className="block w-full p-4 text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-center no-underline text-base hover:from-orange-600 hover:to-orange-700 shadow-lg transition-all transform hover:scale-105"
              >
                My Student List ({dashboardData.totalStudents})
              </Link>
              <Link
                to="/supervisor/previous-projects"
                className="block w-full p-4 text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-center no-underline text-base hover:from-orange-600 hover:to-orange-700 shadow-lg transition-all transform hover:scale-105"
              >
                Previous Project Archive
              </Link>
              <Link
                to="/supervisor/propose-project"
                className="block w-full p-4 text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-center no-underline text-base hover:from-orange-600 hover:to-orange-700 shadow-lg transition-all transform hover:scale-105"
              >
                Propose a New Title
              </Link>
              <Link
                to="/supervisor/view-proposal"
                className="block w-full p-4 text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-center no-underline text-base hover:from-orange-600 hover:to-orange-700 shadow-lg transition-all transform hover:scale-105"
              >
                View My Proposals
              </Link>
            </div>{" "}
            {/* Notification Center */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl mt-6 text-sm text-gray-800 border border-yellow-200 text-left shadow-lg">
              <h3 className="m-0 mb-4 text-yellow-800 font-bold flex items-center gap-2">
                🔔 Notification Center
              </h3>
              <div className="space-y-3">
                <p className="bg-white/50 p-3 rounded-lg">
                  <strong>Reminder:</strong>{" "}
                  {dashboardData.pendingProposals > 0
                    ? `You have ${dashboardData.pendingProposals} pending proposal(s) to review.`
                    : "All proposals have been reviewed."}
                </p>
                <p className="bg-white/50 p-3 rounded-lg mb-0">
                  <strong>Update:</strong>{" "}
                  {dashboardData.totalStudents > 0
                    ? `Currently supervising ${dashboardData.totalStudents} active student(s).`
                    : "No active students at the moment."}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SupervisorDashboard;
