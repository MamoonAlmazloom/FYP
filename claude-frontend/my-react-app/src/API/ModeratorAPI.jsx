/* eslint-disable no-useless-catch */
import api from "./clientAPI";

/**
 * Get pending proposals for moderator review
 * @returns {Promise<Object>} - List of pending proposals
 */
export const getPendingProposals = async () => {
  try {
    const response = await api.get(`/api/moderators/pending-proposals`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Review a student proposal (supervisor-approved)
 * @param {number} proposalId - Proposal ID
 * @param {Object} reviewData - Review data {decision, comments}
 * @returns {Promise<Object>} - Review response
 */
export const reviewProposal = async (proposalId, reviewData) => {
  try {
    const response = await api.post(
      `/api/moderators/review-proposal/${proposalId}`,
      reviewData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Review a supervisor proposal directly
 * @param {number} proposalId - Proposal ID
 * @param {Object} reviewData - Review data {decision, comments}
 * @returns {Promise<Object>} - Review response
 */
export const reviewSupervisorProposal = async (proposalId, reviewData) => {
  try {
    const response = await api.post(
      `/api/moderators/review-supervisor-proposal/${proposalId}`,
      reviewData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get moderator profile
 * @returns {Promise<Object>} - Moderator profile data
 */
export const getModeratorProfile = async () => {
  try {
    const response = await api.get(`/api/moderators/profile`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get proposal details for review
 * @param {number} proposalId - Proposal ID
 * @returns {Promise<Object>} - Proposal details
 */
export const getProposalDetails = async (proposalId) => {
  try {
    const response = await api.get(`/api/moderators/proposal/${proposalId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get previous (evaluated) projects for moderator
 * @param {number} moderatorId - Moderator ID
 * @returns {Promise<Object>} - Previous projects response
 */
export const getPreviousProjects = async (moderatorId) => {
  try {
    const response = await api.get(
      `/api/moderators/${moderatorId}/previous-projects`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
