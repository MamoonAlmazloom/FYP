// API/ExaminerAPI.jsx
import api from "./clientAPI";

/**
 * Get all assigned projects for an examiner
 * @param {number} examinerId - Examiner's ID
 * @returns {Promise<Object>} - List of assigned projects
 */
export const getAssignedProjects = async (examinerId) => {
  try {
    const response = await api.get(
      `/api/examiners/${examinerId}/assigned-projects`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get specific project details
 * @param {number} examinerId - Examiner's ID
 * @param {number} projectId - Project ID
 * @returns {Promise<Object>} - Project details
 */
export const getProjectDetails = async (examinerId, projectId) => {
  try {
    const response = await api.get(
      `/api/examiners/${examinerId}/project-details/${projectId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get project submission
 * @param {number} examinerId - Examiner's ID
 * @param {number} projectId - Project ID
 * @returns {Promise<Object>} - Project submission details
 */
export const getProjectSubmission = async (examinerId, projectId) => {
  try {
    const response = await api.get(
      `/api/examiners/${examinerId}/project-submissions/${projectId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Provide examination feedback
 * @param {number} examinerId - Examiner's ID
 * @param {number} projectId - Project ID
 * @param {Object} feedbackData - Feedback data {feedback, grade}
 * @returns {Promise<Object>} - Feedback response
 */
export const provideExaminationFeedback = async (
  examinerId,
  projectId,
  feedbackData
) => {
  try {
    const response = await api.post(
      `/api/examiners/${examinerId}/examination-feedback/${projectId}`,
      feedbackData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update examination feedback
 * @param {number} examinerId - Examiner's ID
 * @param {number} projectId - Project ID
 * @param {Object} feedbackData - Updated feedback data {feedback, grade}
 * @returns {Promise<Object>} - Update response
 */
export const updateExaminationFeedback = async (
  examinerId,
  projectId,
  feedbackData
) => {
  try {
    const response = await api.put(
      `/api/examiners/${examinerId}/examination-feedback/${projectId}`,
      feedbackData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get examiner profile
 * @param {number} examinerId - Examiner's ID
 * @returns {Promise<Object>} - Examiner profile data
 */
export const getExaminerProfile = async (examinerId) => {
  try {
    const response = await api.get(`/api/examiners/${examinerId}/profile`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get previous evaluations
 * @param {number} examinerId - Examiner's ID
 * @returns {Promise<Object>} - List of previous evaluations
 */
export const getPreviousEvaluations = async (examinerId) => {
  try {
    const response = await api.get(`/api/examiners/${examinerId}/evaluations`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update project status
 * @param {number} examinerId - Examiner's ID
 * @param {number} projectId - Project ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Update response
 */
export const updateProjectStatus = async (examinerId, projectId, status) => {
  try {
    const response = await api.put(
      `/api/examiners/${examinerId}/projects/${projectId}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get evaluation statistics
 * @param {number} examinerId - Examiner's ID
 * @returns {Promise<Object>} - Statistics data
 */
export const getEvaluationStatistics = async (examinerId) => {
  try {
    const response = await api.get(`/api/examiners/${examinerId}/statistics`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Schedule examination
 * @param {number} examinerId - Examiner's ID
 * @param {number} projectId - Project ID
 * @param {Object} scheduleData - Schedule data {examination_date, venue}
 * @returns {Promise<Object>} - Schedule response
 */
export const scheduleExamination = async (
  examinerId,
  projectId,
  scheduleData
) => {
  try {
    const response = await api.post(
      `/api/examiners/${examinerId}/schedule-examination/${projectId}`,
      scheduleData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get scheduled examinations
 * @param {number} examinerId - Examiner's ID
 * @returns {Promise<Object>} - List of scheduled examinations
 */
export const getScheduledExaminations = async (examinerId) => {
  try {
    const response = await api.get(
      `/api/examiners/${examinerId}/scheduled-examinations`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Request extension for evaluation
 * @param {number} examinerId - Examiner's ID
 * @param {number} projectId - Project ID
 * @param {Object} extensionData - Extension data {reason, requested_days}
 * @returns {Promise<Object>} - Extension response
 */
export const requestExtension = async (
  examinerId,
  projectId,
  extensionData
) => {
  try {
    const response = await api.post(
      `/api/examiners/${examinerId}/request-extension/${projectId}`,
      extensionData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
