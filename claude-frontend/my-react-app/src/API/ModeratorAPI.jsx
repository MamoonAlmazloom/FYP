/* eslint-disable no-useless-catch */
import api from "./clientAPI";

/**
 * Get pending proposals for moderator review
 * @param {number} moderatorId - Moderator's ID
 * @returns {Promise<Object>} - List of pending proposals
 */
export const getPendingProposals = async (moderatorId) => {
  try {
    const response = await api.get(`/api/moderators/${moderatorId}/pending-proposals`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Review a student proposal (supervisor-approved)
 * @param {number} moderatorId - Moderator's ID
 * @param {number} proposalId - Proposal ID
 * @param {Object} reviewData - Review data {decision, comments}
 * @returns {Promise<Object>} - Review response
 */
export const reviewProposal = async (moderatorId, proposalId, reviewData) => {
  try {
    const response = await api.post(
      `/api/moderators/${moderatorId}/review-proposal/${proposalId}`,
      reviewData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Review a supervisor proposal directly
 * @param {number} moderatorId - Moderator's ID
 * @param {number} proposalId - Proposal ID
 * @param {Object} reviewData - Review data {decision, comments}
 * @returns {Promise<Object>} - Review response
 */
export const reviewSupervisorProposal = async (moderatorId, proposalId, reviewData) => {
  try {
    const response = await api.post(
      `/api/moderators/${moderatorId}/review-supervisor-proposal/${proposalId}`,
      reviewData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get moderator profile by ID
 * @param {number} moderatorId - Moderator's ID
 * @returns {Promise<Object>} - Moderator profile data
 */
export const getModeratorProfile = async (moderatorId) => {
  try {
    const response = await api.get(`/api/moderators/${moderatorId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
