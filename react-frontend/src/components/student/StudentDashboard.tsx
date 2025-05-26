import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StudentChoosePath from './StudentChoosePath'; // ← Relative import
// Types
interface Project {
  project_id: number;
  title: string;
  description: string;
  supervisor_name?: string;
}

interface Proposal {
  proposal_id: number;
  title: string;
  status_name: string;
  project_id?: number;
}

// Main Student Dashboard Router Component
const StudentDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [hasApprovedProject, setHasApprovedProject] = useState(false);
  const [approvedProject, setApprovedProject] = useState<Project | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    checkStudentProjectStatus();
  }, []);

  const checkStudentProjectStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const studentId = localStorage.getItem('userId');

      if (!token || !studentId) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      // Check if student has any approved proposals/projects
      const proposalsResponse = await fetch(`/api/students/${studentId}/proposals`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!proposalsResponse.ok) {
        throw new Error('Failed to fetch proposals');
      }

      const proposalsData = await proposalsResponse.json();
      const proposals: Proposal[] = proposalsData.proposals || [];

      // Look for approved proposals
      const approvedProposal = proposals.find(
        proposal => proposal.status_name === 'Approved' && proposal.project_id
      );

      if (approvedProposal) {
        // Student has an approved project, fetch project details
        const projectsResponse = await fetch(`/api/students/${studentId}/projects`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          const projects: Project[] = projectsData.projects || [];
          
          if (projects.length > 0) {
            setApprovedProject(projects[0]); // Get the first (and typically only) project
            setHasApprovedProject(true);
          }
        }
      }

    } catch (error) {
      console.error('Error checking project status:', error);
      setError('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  // Loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  // Error screen
  if (error) {
    return <ErrorScreen error={error} onRetry={checkStudentProjectStatus} />;
  }

  // Case 1: No approved project - Show Choose Your Path
  if (!hasApprovedProject) {
    return <StudentChoosePath />;
  }

  // Case 2: Has approved project - Show Project Work (placeholder for now)
  return <ProjectWorkDashboard project={approvedProject} />;
};

// Loading Screen Component
const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Loading Student Dashboard</h2>
        <p className="text-gray-300 mb-6">Checking your project status...</p>
        
        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </motion.div>
    </div>
  );
};

// Error Screen Component
const ErrorScreen: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center p-6">
      <motion.div
        className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 border border-gray-600/40 max-w-md w-full text-center shadow-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-16 h-16 bg-red-500/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h2 className="text-xl font-bold text-white mb-4">Unable to Load Dashboard</h2>
        <p className="text-gray-300 mb-6">{error}</p>
        
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full px-6 py-3 border border-gray-600/40 text-gray-300 rounded-lg hover:bg-gray-700/30 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Project Work Dashboard Placeholder Component (for Case 2)
const ProjectWorkDashboard: React.FC<{ project: Project | null }> = ({ project }) => {
  const studentName = localStorage.getItem('userName') || 'Student';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900">
      {/* Header */}
      <div className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-600/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FYP Portal</h1>
                <p className="text-sm text-gray-400">Project Workspace</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{studentName}</p>
                <p className="text-xs text-gray-400">Student</p>
              </div>
              <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Project Info Header */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/30 mb-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">
                {project?.title || 'Your Project'}
              </h2>
              <p className="text-gray-300 mb-4">
                {project?.description || 'Project description will appear here'}
              </p>
              {project?.supervisor_name && (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-blue-400 font-medium">Supervisor: {project.supervisor_name}</span>
                </div>
              )}
            </div>
            
            <div className="bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
              <span className="text-green-400 font-medium">✓ Approved Project</span>
            </div>
          </div>
        </motion.div>

        {/* Placeholder for Project Work Components */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-600/30 text-center shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="w-20 h-20 bg-blue-500/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">Project Work Dashboard</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Welcome to your project workspace! This is where you'll manage your project activities, 
            submit progress reports, communicate with your supervisor, and track your project milestones.
          </p>
          
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
            <p className="text-blue-400 font-medium">
              🚧 Project Work components will be implemented next
            </p>
            <p className="text-gray-400 text-sm mt-2">
              This will include: Progress Logs, Reports, Supervisor Communication, File Uploads, and more
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;