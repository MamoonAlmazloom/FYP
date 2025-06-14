import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getProposalStatus } from "../API/StudentAPI";

const ViewProposal = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const proposalId = searchParams.get('id');
  
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        if (!user?.id) {
          setError('User not found. Please log in again.');
          return;
        }

        if (!proposalId) {
          setError('Proposal ID not provided.');
          return;
        }

        setLoading(true);
        const response = await getProposalStatus(user.id, proposalId);
        
        if (response.success) {
          setProposal(response.proposal);
        } else {
          setError(response.error || 'Failed to load proposal');
        }
      } catch (err) {
        console.error('Error fetching proposal:', err);
        setError('Failed to load proposal');
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [user, proposalId]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
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
      case "requires modification":
      case "needs-revision":
        return (
          <span className="px-4 py-2 bg-blue-100 text-blue-800 text-lg rounded-full font-semibold">
            🔄 Needs Revision
          </span>
        );
      default:
        return (
          <span className="px-4 py-2 bg-gray-100 text-gray-800 text-lg rounded-full font-semibold">
            {status || 'Unknown'}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading proposal details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link
              to="/student/project-status"
              className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
            >
              View All Proposals
            </Link>
            <Link
              to="/student/project-work"
              className="block w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
            >
              Back to Project Work
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Proposal Not Found</h2>
          <p className="text-gray-600 mb-6">The requested proposal could not be found.</p>
          <Link
            to="/student/project-status"
            className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 no-underline font-semibold"
          >
            View All Proposals
          </Link>
        </div>
      </div>
    );
  }

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
              {getStatusBadge(proposal.status_name)}
            </div>
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              {proposal.title}
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Submitted:</span>{" "}
                {proposal.submission_date ? 
                  new Date(proposal.submission_date).toLocaleDateString() : 'N/A'}
              </div>
              <div>
                <span className="font-medium">Type:</span>{" "}
                {proposal.type}
              </div>
              <div>
                <span className="font-medium">Specialization:</span>{" "}
                {proposal.specialization}
              </div>
            </div>
          </div>

          {/* Supervisor Info */}
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              👨‍🏫 Submitted To
            </h3>
            <div className="space-y-1 text-blue-700">
              <p className="font-medium">{proposal.reviewer_name || 'Supervisor information not available'}</p>
              <p className="text-sm">Proposal ID: {proposal.proposal_id}</p>
            </div>
          </div>

          {/* Proposal Content */}
          <div className="space-y-8">
            {/* Proposal Description */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📋 Project Description
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {proposal.proposal_description}
              </p>
            </div>

            {/* Project Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-800 mb-4">
                  🎯 Project Type
                </h3>
                <p className="text-green-700">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {proposal.type}
                  </span>
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-800 mb-4">
                  🔬 Specialization
                </h3>
                <p className="text-purple-700">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {proposal.specialization}
                  </span>
                </p>
              </div>
            </div>

            {/* Expected Outcome */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                🎖️ Expected Outcome
              </h3>
              <p className="text-indigo-700 leading-relaxed whitespace-pre-wrap">
                {proposal.outcome}
              </p>
            </div>

            {/* Comments/Feedback */}
            {proposal.comments && (
              <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                  💬 Supervisor Feedback
                </h3>
                <p className="text-yellow-700 leading-relaxed whitespace-pre-wrap">
                  {proposal.comments}
                </p>
              </div>
            )}

            {/* Proposal Status Details */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                📊 Proposal Status
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded">
                  <div className="text-sm text-gray-600">Current Status</div>
                  <div className="text-lg font-semibold text-gray-800">{proposal.status_name}</div>
                </div>
                <div className="bg-white p-4 rounded">
                  <div className="text-sm text-gray-600">Submission Date</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {new Date(proposal.submission_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
            {(proposal.status_name?.toLowerCase() === 'pending' || 
              proposal.status_name?.toLowerCase() === 'requires modification') && (
              <Link
                to={`/student/modify-proposal?id=${proposal.proposal_id}`}
                className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors no-underline font-semibold"
              >
                ✏️ Modify Proposal
              </Link>
            )}
            
            {proposal.status_name?.toLowerCase() === 'approved' && (
              <Link
                to="/student/project-work"
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors no-underline font-semibold"
              >
                🚀 Start Project Work
              </Link>
            )}

            <Link
              to="/student/project-status"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors no-underline font-semibold"
            >
              📋 View All Proposals
            </Link>
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
