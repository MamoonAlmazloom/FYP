// API/ExaminerAPI.jsx
import axios from "axios";

// Set the base URL for the API
const BASE_URL = "http://localhost:5000/api";

// Set up axios defaults
axios.defaults.baseURL = BASE_URL;

// Add auth token to all requests
const addAuthToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

const ExaminerAPI = {
  // Get all assigned projects for an examiner
  getAssignedProjects: async (examinerId) => {
    try {
      addAuthToken();
      const response = await axios.get(`/examiners/${examinerId}/projects`);
      return response.data;
    } catch (error) {
      console.error("Error fetching assigned projects:", error);
      throw error;
    }
  },

  // Get specific project details
  getProjectDetails: async (examinerId, projectId) => {
    try {
      addAuthToken();
      const response = await axios.get(
        `/examiners/${examinerId}/projects/${projectId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching project details:", error);
      throw error;
    }
  },

  // Update project evaluation status
  updateProjectStatus: async (examinerId, projectId, status) => {
    try {
      addAuthToken();
      const response = await axios.put(
        `/examiners/${examinerId}/projects/${projectId}/status`,
        {
          status,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating project status:", error);
      throw error;
    }
  },
};

export default ExaminerAPI;
