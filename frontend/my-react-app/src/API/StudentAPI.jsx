import api from "./clientAPI";

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Set up request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Get student profile by ID
 * @param {number} studentId - Student's ID
 * @returns {Promise<Object>} - Student profile data
 */
export const getStudentProfile = async (studentId) => {
  try {
    console.log("StudentAPI: Fetching profile for student ID:", studentId);
    const response = await api.get(`/api/students/${studentId}`);
    console.log("StudentAPI: Profile response:", response.data);
    return response.data;
  } catch (error) {
    console.error("StudentAPI: Error fetching profile:", error);
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
    console.log("StudentAPI: Fetching projects for student ID:", studentId);
    const response = await api.get(`/api/students/${studentId}/projects`);
    console.log("StudentAPI: Projects response:", response.data);
    return response.data;
  } catch (error) {
    console.error("StudentAPI: Error fetching projects:", error);
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
    console.log("StudentAPI: Fetching proposals for student ID:", studentId);
    const response = await api.get(`/api/students/${studentId}/proposals`);
    console.log("StudentAPI: Proposals response:", response.data);
    return response.data;
  } catch (error) {
    console.error("StudentAPI: Error fetching proposals:", error);
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
    console.log("StudentAPI: Selecting project", { studentId, projectId });

    // Validate inputs
    if (!studentId || !projectId) {
      throw new Error("Student ID and Project ID are required");
    }

    const response = await api.post(
      `/api/students/${studentId}/select-project`,
      {
        project_id: projectId,
      }
    );

    console.log("StudentAPI: Raw response:", response);
    console.log("StudentAPI: Response data:", response.data);

    // Ensure we have a valid response structure
    if (!response.data) {
      return {
        success: false,
        error: "Invalid response from server",
      };
    }

    // If the response doesn't have a success field, assume it's successful if we get a 200 status
    if (response.status === 200 && response.data.success === undefined) {
      return {
        success: true,
        message: response.data.message || "Project selected successfully",
        proposalId: response.data.proposalId,
      };
    }

    return response.data;
  } catch (error) {
    console.error("StudentAPI: Error selecting project:", error);
    console.error("StudentAPI: Error details:", {
      message: error.message,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Return a consistent error response structure
    if (error.response && error.response.data) {
      return {
        success: false,
        error:
          error.response.data.error ||
          error.response.data.message ||
          "Failed to select project",
      };
    } else {
      return {
        success: false,
        error:
          error.message || "Network error occurred while selecting project",
      };
    }
  }
};

/**
 * Get progress logs for a student
 * @param {number} studentId - Student's ID
 * @returns {Promise<Object>} - Progress logs
 */
export const getProgressLogs = async (studentId) => {
  try {
    console.log(`Fetching progress logs for student ${studentId}`);
    const response = await api.get(`/api/students/${studentId}/progress-logs`);

    console.log("Raw logs received:", response.data.logs);

    // Process logs to ensure feedback is accessible if it exists
    if (response.data.success && response.data.logs) {
      // Check for duplicates
      const logIds = new Set();
      response.data.logs = response.data.logs
        .filter((log) => {
          // Keep only unique log_ids
          if (logIds.has(log.log_id)) {
            console.log(`Filtered out duplicate log with ID: ${log.log_id}`);
            return false;
          }
          logIds.add(log.log_id);
          return true;
        })
        .map((log) => {
          // Map supervisorFeedback to feedback property if it exists
          if (log.supervisorFeedback && !log.feedback) {
            return { ...log, feedback: log.supervisorFeedback };
          }
          return log;
        });

      console.log("After deduplication:", response.data.logs.length, "logs");
    }

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
    console.log("URL for fetching reports:", url);
    const response = await api.get(url);

    console.log("Raw reports received:", response);

    // Process reports to ensure feedback is accessible if it exists
    if (response.data.success && response.data.reports) {
      // Check for duplicates
      const reportIds = new Set();
      response.data.reports = response.data.reports
        .filter((report) => {
          // Keep only unique report_ids
          if (reportIds.has(report.report_id)) {
            console.log(
              `Filtered out duplicate report with ID: ${report.report_id}`
            );
            return false;
          }
          reportIds.add(report.report_id);
          return true;
        })
        .map((report) => {
          // Map supervisorFeedback to feedback property if it exists
          if (report.supervisorFeedback && !report.feedback) {
            return { ...report, feedback: report.supervisorFeedback };
          }
          return report;
        });

      console.log(
        "After deduplication:",
        response.data.reports.length,
        "reports"
      );
    }

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

/**
 * Get student's active project details
 * @param {number} studentId - Student's ID
 * @returns {Promise<Object>} - Active project information
 */
export const getActiveProject = async (studentId) => {
  try {
    const response = await api.get(`/api/students/${studentId}/active-project`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
