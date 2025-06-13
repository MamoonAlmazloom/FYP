/* eslint-disable no-useless-catch */
import api from "./clientAPI";

/**
 * Get student profile by ID
 * @param {number} studentId - Student's ID
 * @returns {Promise<Object>} - Student profile data
 */
export const getStudentProfile = async (studentId) => {
  try {
    const response = await api.get(`/api/students/${studentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get student's projects (approved proposals)
 * @param {number} studentId - Student's ID
 * @returns {Promise<Object>} - Student's active projects
 */
export const getStudentProjects = async (studentId) => {
  try {
    const response = await api.get(`/api/students/${studentId}/projects`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get student's proposals
 * @param {number} studentId - Student's ID
 * @returns {Promise<Object>} - Student's proposals
 */
export const getStudentProposals = async (studentId) => {
  try {
    const response = await api.get(`/api/students/${studentId}/proposals`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Submit a new proposal
 * @param {number} studentId - Student's ID
 * @param {Object} proposalData - Proposal data
 * @returns {Promise<Object>} - Submission response
 */
export const submitProposal = async (studentId, proposalData) => {
  try {
    const response = await api.post(
      `/api/students/${studentId}/proposals`,
      proposalData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing proposal
 * @param {number} studentId - Student's ID
 * @param {number} proposalId - Proposal ID
 * @param {Object} proposalData - Updated proposal data
 * @returns {Promise<Object>} - Update response
 */
export const updateProposal = async (studentId, proposalId, proposalData) => {
  try {
    const response = await api.put(
      `/api/students/${studentId}/proposals/${proposalId}`,
      proposalData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get proposal status
 * @param {number} studentId - Student's ID
 * @param {number} proposalId - Proposal ID
 * @returns {Promise<Object>} - Proposal status
 */
export const getProposalStatus = async (studentId, proposalId) => {
  try {
    const response = await api.get(
      `/api/students/${studentId}/proposals/${proposalId}/status`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get available projects for selection
 * @param {number} studentId - Student's ID
 * @returns {Promise<Object>} - Available projects
 */
export const getAvailableProjects = async (studentId) => {
  try {
    const response = await api.get(
      `/api/students/${studentId}/available-projects`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Select a project from available projects
 * @param {number} studentId - Student's ID
 * @param {number} projectId - Project ID to select
 * @returns {Promise<Object>} - Selection response
 */
export const selectProject = async (studentId, projectId) => {
  try {
    const response = await api.post(
      `/api/students/${studentId}/select-project`,
      {
        project_id: projectId,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get progress logs for a student
 * @param {number} studentId - Student's ID
 * @returns {Promise<Object>} - Progress logs
 */
export const getProgressLogs = async (studentId) => {
  try {
    const response = await api.get(`/api/students/${studentId}/progress-logs`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Submit a progress log
 * @param {number} studentId - Student's ID
 * @param {Object} logData - Progress log data
 * @returns {Promise<Object>} - Submission response
 */
export const submitProgressLog = async (studentId, logData) => {
  try {
    const response = await api.post(
      `/api/students/${studentId}/progress-logs`,
      logData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get progress reports for a student
 * @param {number} studentId - Student's ID
 * @param {string} startDate - Optional start date filter
 * @param {string} endDate - Optional end date filter
 * @returns {Promise<Object>} - Progress reports
 */
export const getProgressReports = async (
  studentId,
  startDate = null,
  endDate = null
) => {
  try {
    let url = `/api/students/${studentId}/progress-reports`;
    const params = new URLSearchParams();

    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Submit a progress report
 * @param {number} studentId - Student's ID
 * @param {Object} reportData - Progress report data
 * @returns {Promise<Object>} - Submission response
 */
export const submitProgressReport = async (studentId, reportData) => {
  try {
    const response = await api.post(
      `/api/students/${studentId}/progress-reports`,
      reportData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get feedback for a student
 * @param {number} studentId - Student's ID
 * @param {string} type - Feedback type (proposal, log, report)
 * @param {number} itemId - ID of the item receiving feedback
 * @returns {Promise<Object>} - Feedback data
 */
export const getFeedback = async (studentId, type, itemId) => {
  try {
    const response = await api.get(`/api/students/${studentId}/feedback`, {
      params: { type, item_id: itemId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Check if student has active approved proposals
 * @param {number} studentId - Student's ID
 * @returns {Promise<boolean>} - True if student has active projects
 */
export const hasActiveProject = async (studentId) => {
  try {
    const response = await getStudentProjects(studentId);
    return (
      response.success && response.projects && response.projects.length > 0
    );
  } catch (error) {
    console.error("Error checking active project status:", error);
    return false;
  }
};
