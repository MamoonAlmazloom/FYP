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

// Set up response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Manager API functions
const ManagerAPI = {
  // Get all users
  getAllUsers: async (managerId) => {
    try {
      const response = await api.get(`/api/managers/${managerId}/users`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Update user eligibility
  updateUserEligibility: async (managerId, userId, status) => {
    try {
      const response = await api.put(
        `/api/managers/${managerId}/user-eligibility/${userId}`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user eligibility:", error);
      throw error;
    }
  },

  // Register a new user
  registerUser: async (managerId, userData) => {
    try {
      const response = await api.post(
        `/api/managers/${managerId}/register-user`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  // Get approved projects
  getApprovedProjects: async (managerId) => {
    try {
      const response = await api.get(
        `/api/managers/${managerId}/approved-projects`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching approved projects:", error);
      throw error;
    }
  },
  // Assign examiner to project
  assignExaminer: async (managerId, examinerData) => {
    try {
      console.log("Assigning examiner:", { managerId, examinerData });
      const response = await api.post(
        `/api/managers/${managerId}/assign-examiner`,
        examinerData
      );
      console.log("Assignment response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error assigning examiner:", error);
      console.error("Error details:", error.response?.data);
      throw error;
    }
  },

  // Get student logs
  getStudentLogs: async (managerId, studentId) => {
    try {
      const response = await api.get(
        `/api/managers/${managerId}/student-logs/${studentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching student logs:", error);
      throw error;
    }
  },

  // Get all roles
  getRoles: async (managerId) => {
    try {
      const response = await api.get(`/api/managers/${managerId}/roles`);
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },

  // Get all examiners
  getExaminers: async (managerId) => {
    try {
      const response = await api.get(`/api/managers/${managerId}/examiners`);
      return response.data;
    } catch (error) {
      console.error("Error fetching examiners:", error);
      throw error;
    }
  },

  // Get previous (completed) projects
  getPreviousProjects: async (managerId) => {
    try {
      const response = await api.get(
        `/api/managers/${managerId}/previous-projects`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching previous projects:", error);
      throw error;
    }
  },
};

export default ManagerAPI;
