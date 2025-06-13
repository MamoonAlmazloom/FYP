/* eslint-disable no-useless-catch */
import api from "./clientAPI";

/**
 * Login user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Login response with user data and token
 */
export const login = async (email, password) => {
  try {
    const data = {
      email: email,
      password: password,
    };
    const response = await api.post("/api/auth/login", data);

    // Store token and user data in localStorage for persistence
    if (response.data.success && response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Set authorization header for future requests
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user by clearing stored data
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  delete api.defaults.headers.common["Authorization"];
};

/**
 * Get current user from localStorage
 * @returns {Object|null} - Current user data or null
 */
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

/**
 * Get stored token
 * @returns {string|null} - JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has valid token
 */
export const isAuthenticated = () => {
  const token = getToken();
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * Initialize auth by setting token in axios headers if it exists
 */
export const initializeAuth = () => {
  const token = getToken();
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

/**
 * Get user's primary role (first role in the roles array)
 * @param {Object} user - User object
 * @returns {string|null} - Primary role name or null
 */
export const getUserPrimaryRole = (user) => {
  if (
    !user ||
    !user.roles ||
    !Array.isArray(user.roles) ||
    user.roles.length === 0
  ) {
    return null;
  }
  return user.roles[0];
};

/**
 * Check if user has a specific role
 * @param {Object} user - User object
 * @param {string} role - Role to check
 * @returns {boolean} - True if user has the role
 */
export const hasRole = (user, role) => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false;
  }
  return user.roles.includes(role);
};

/**
 * Get the appropriate dashboard route based on user's primary role
 * @param {Object} user - User object
 * @returns {string} - Route path for the user's dashboard
 */
export const getDashboardRoute = (user) => {
  const primaryRole = getUserPrimaryRole(user);

  switch (primaryRole) {
    case "Manager":
      return "/manager/dashboard";
    case "Supervisor":
    case "SV": // Handle both naming conventions
      return "/supervisor/dashboard";
    case "Moderator":
      return "/moderator/dashboard";
    case "Examiner":
      return "/examiner/dashboard";
    case "Student":
      // For students, we need to check their project status
      // This will be handled separately in the routing logic
      return null; // Will be determined by project status
    default:
      return "/login"; // Fallback to login if role is unknown
  }
};

/**
 * Determine student routing based on project status
 * @param {number} studentId - Student's ID
 * @returns {Promise<string>} - Route path for the student
 */
export const getStudentRoute = async (studentId) => {
  try {
    // Check if student has any approved proposals (active projects)
    const response = await api.get(`/api/students/${studentId}/projects`);

    if (
      response.data.success &&
      response.data.projects &&
      response.data.projects.length > 0
    ) {
      // Student has active project(s) - redirect to project work
      return "/student/project-work";
    } else {
      // Student has no active projects - redirect to choose path
      return "/student/choose-path";
    }
  } catch (error) {
    console.error("Error checking student project status:", error);
    // Default to choose path if there's an error
    return "/student/choose-path";
  }
};
