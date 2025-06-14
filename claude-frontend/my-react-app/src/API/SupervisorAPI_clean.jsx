/* eslint-disable no-useless-catch */
import api from "./clientAPI";

/**
 * Get students under supervision
 * @param {number} supervisorId - Supervisor's ID
 * @param {boolean} activeOnly - Filter only active students
 * @returns {Promise<Object>} - Students data
 */
export const getStudentsBySupervisor = async (
  supervisorId,
  activeOnly = false
) => {
  try {
    const response = await api.get(
      `/api/supervisors/${supervisorId}/students`,
      {
        params: { active: activeOnly },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get proposals assigned to supervisor for review
 * @param {number} supervisorId - Supervisor's ID
 * @returns {Promise<Object>} - Proposals data
 */
export const getProposalsBySupervisor = async (supervisorId) => {
  try {
    const response = await api.get(
      `/api/supervisors/${supervisorId}/proposals`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get specific proposal details
 * @param {number} supervisorId - Supervisor's ID
 * @param {number} proposalId - Proposal ID
 * @returns {Promise<Object>} - Proposal details
 */
export const getProposalDetails = async (supervisorId, proposalId) => {
  try {
    const response = await api.get(
      `/api/supervisors/${supervisorId}/proposals/${proposalId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Submit decision on a proposal
 * @param {number} supervisorId - Supervisor's ID
 * @param {number} proposalId - Proposal ID
 * @param {string} decision - Decision (approve, reject, modify)
 * @param {string} comments - Optional comments
 * @returns {Promise<Object>} - Decision response
 */
export const submitProposalDecision = async (
  supervisorId,
  proposalId,
  decision,
  comments = ""
) => {
  try {
    const response = await api.post(
      `/api/supervisors/${supervisorId}/proposal-decision/${proposalId}`,
      {
        decision,
        comments,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Review student proposal (new endpoint)
 * @param {number} supervisorId - Supervisor's ID
 * @param {number} proposalId - Proposal ID
 * @param {string} decision - Decision (approve, reject, modify)
 * @param {string} comments - Optional comments
 * @returns {Promise<Object>} - Review response
 */
export const reviewStudentProposal = async (
  supervisorId,
  proposalId,
  decision,
  comments = ""
) => {
  try {
    const response = await api.post(
      `/api/supervisors/${supervisorId}/review-proposal/${proposalId}`,
      {
        decision,
        comments,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get student details
 * @param {number} supervisorId - Supervisor's ID
 * @param {number} studentId - Student ID
 * @returns {Promise<Object>} - Student details
 */
export const getStudentDetails = async (supervisorId, studentId) => {
  try {
    const response = await api.get(
      `/api/supervisors/${supervisorId}/students/${studentId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get student logs
 * @param {number} supervisorId - Supervisor's ID
 * @param {number} studentId - Student ID
 * @param {string} startDate - Optional start date filter
 * @param {string} endDate - Optional end date filter
 * @returns {Promise<Object>} - Student logs
 */
export const getStudentLogs = async (
  supervisorId,
  studentId,
  startDate = null,
  endDate = null
) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get(
      `/api/supervisors/${supervisorId}/students/${studentId}/logs`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Provide feedback on student log
 * @param {number} supervisorId - Supervisor's ID
 * @param {number} logId - Log ID
 * @param {string} comments - Feedback comments
 * @returns {Promise<Object>} - Feedback response
 */
export const provideFeedbackOnLog = async (supervisorId, logId, comments) => {
  try {
    const response = await api.post(
      `/api/supervisors/${supervisorId}/feedback/log/${logId}`,
      {
        comments,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get student reports
 * @param {number} supervisorId - Supervisor's ID
 * @param {number} studentId - Student ID
 * @param {string} startDate - Optional start date filter
 * @param {string} endDate - Optional end date filter
 * @returns {Promise<Object>} - Student reports
 */
export const getStudentReports = async (
  supervisorId,
  studentId,
  startDate = null,
  endDate = null
) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get(
      `/api/supervisors/${supervisorId}/students/${studentId}/reports`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Provide feedback on student report
 * @param {number} supervisorId - Supervisor's ID
 * @param {number} reportId - Report ID
 * @param {string} comments - Feedback comments
 * @returns {Promise<Object>} - Feedback response
 */
export const provideFeedbackOnReport = async (
  supervisorId,
  reportId,
  comments
) => {
  try {
    const response = await api.post(
      `/api/supervisors/${supervisorId}/feedback/report/${reportId}`,
      {
        comments,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get previous projects archive
 * @param {number} supervisorId - Supervisor's ID
 * @returns {Promise<Object>} - Previous projects
 */
export const getPreviousProjects = async (supervisorId) => {
  try {
    const response = await api.get(
      `/api/supervisors/${supervisorId}/previous-projects`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get project details
 * @param {number} supervisorId - Supervisor's ID
 * @param {number} projectId - Project ID
 * @returns {Promise<Object>} - Project details
 */
export const getProjectDetails = async (supervisorId, projectId) => {
  try {
    const response = await api.get(
      `/api/supervisors/${supervisorId}/previous-projects/${projectId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Propose a new project
 * @param {number} supervisorId - Supervisor's ID
 * @param {Object} projectData - Project proposal data
 * @returns {Promise<Object>} - Proposal response
 */
export const proposeProject = async (supervisorId, projectData) => {
  try {
    const response = await api.post(
      `/api/supervisors/${supervisorId}/propose-project`,
      projectData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get supervisor's own proposal
 * @param {number} supervisorId - Supervisor's ID
 * @param {number} proposalId - Proposal ID
 * @returns {Promise<Object>} - Proposal details
 */
export const getSupervisorProposal = async (supervisorId, proposalId) => {
  try {
    const response = await api.get(
      `/api/supervisors/${supervisorId}/my-proposals/${proposalId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update supervisor's own proposal
 * @param {number} supervisorId - Supervisor's ID
 * @param {number} proposalId - Proposal ID
 * @param {Object} proposalData - Updated proposal data
 * @returns {Promise<Object>} - Update response
 */
export const updateSupervisorProposal = async (
  supervisorId,
  proposalId,
  proposalData
) => {
  try {
    const response = await api.put(
      `/api/supervisors/${supervisorId}/my-proposals/${proposalId}`,
      proposalData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all supervisors
 * @returns {Promise<Object>} - All supervisors
 */
export const getAllSupervisors = async () => {
  try {
    const response = await api.get("/api/supervisors");
    return response.data;
  } catch (error) {
    throw error;
  }
};
