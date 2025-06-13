/* eslint-disable */
import {
  getCurrentUser,
  getUserPrimaryRole,
  hasRole,
  getDashboardRoute,
  getStudentRoute,
} from "../API/authAPI";

/**
 * Handle user routing based on role and project status
 * @param {Function} navigate - React Router navigate function
 * @param {Object} user - User object from login response
 * @returns {Promise<void>}
 */
export const handleUserRouting = async (navigate, user) => {
  try {
    console.log("handleUserRouting called with user:", user);

    // Use the passed user data directly instead of getting from storage
    const primaryRole = user?.roles?.[0];

    console.log(
      "Routing user with role:",
      primaryRole,
      "Full user data:",
      user
    );

    switch (primaryRole) {
      case "Manager":
        console.log("Redirecting to Manager dashboard");
        navigate("/manager/dashboard");
        break;

      case "Supervisor":
      case "SV": // Handle both naming conventions
        console.log("Redirecting to Supervisor dashboard");
        navigate("/supervisor/dashboard");
        break;

      case "Moderator":
        console.log("Redirecting to Moderator dashboard");
        navigate("/moderator/dashboard");
        break;

      case "Examiner":
        console.log("Redirecting to Examiner dashboard");
        navigate("/examiner/dashboard");
        break;

      case "Student":
        console.log("Redirecting Student - checking project status");
        // For students, check their project status
        const studentRoute = await getStudentRoute(user.id);
        console.log("Student route determined:", studentRoute);
        navigate(studentRoute);
        break;

      default:
        console.warn("Unknown role:", primaryRole, "Redirecting to login");
        navigate("/login");
        break;
    }
  } catch (error) {
    console.error("Error in user routing:", error);
    // Fallback to login on error
    navigate("/login");
  }
};

/**
 * Get user display info for UI components
 * @param {Object} user - User object
 * @returns {Object} - Display information
 */
export const getUserDisplayInfo = (user) => {
  if (!user) return null;

  return {
    name: user.name || "Unknown User",
    email: user.email || "",
    primaryRole: getUserPrimaryRole(user),
    allRoles: user.roles || [],
    initials: getInitials(user.name || "UU"),
  };
};

/**
 * Get user initials from name
 * @param {string} name - User's name
 * @returns {string} - User initials
 */
const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Check if current user can access a specific feature
 * @param {string} feature - Feature name
 * @param {Object} user - User object (optional, will get current user if not provided)
 * @returns {boolean} - True if user can access feature
 */
export const canAccessFeature = (feature, user = null) => {
  const currentUser = user || getCurrentUser();
  if (!currentUser) return false;

  const userRole = getUserPrimaryRole(currentUser);

  // Define feature access matrix
  const featureAccess = {
    "manage-users": ["Manager"],
    "register-user": ["Manager"],
    "assign-examiners": ["Manager"],
    "approve-proposals": ["Supervisor", "Moderator"],
    "view-all-projects": ["Manager", "Supervisor", "Moderator"],
    "submit-proposals": ["Student"],
    "submit-progress": ["Student"],
    "manage-deadlines": ["Manager"],
    "send-notifications": ["Manager", "Supervisor"],
    "examine-projects": ["Examiner"],
  };

  const allowedRoles = featureAccess[feature] || [];
  return allowedRoles.includes(userRole);
};

/**
 * Get navigation items based on user role
 * @param {Object} user - User object
 * @returns {Array} - Array of navigation items
 */
export const getNavigationItems = (user) => {
  if (!user) return [];

  const role = getUserPrimaryRole(user);

  const navigationMap = {
    Manager: [
      { name: "Dashboard", path: "/manager/dashboard", icon: "dashboard" },
      { name: "Manage Users", path: "/manager/manage-users", icon: "users" },
      {
        name: "Register User",
        path: "/manager/register-user",
        icon: "user-plus",
      },
      {
        name: "User Eligibility",
        path: "/manager/manage-user-eligibility",
        icon: "shield-check",
      },
      {
        name: "Assign Examiners",
        path: "/manager/assign-examiners",
        icon: "user-check",
      },
      {
        name: "Project Logs",
        path: "/manager/approved-projects-logs",
        icon: "file-text",
      },
      {
        name: "Previous Projects",
        path: "/manager/previous-projects",
        icon: "archive",
      },
    ],
    Supervisor: [
      { name: "Dashboard", path: "/supervisor/dashboard", icon: "dashboard" },
      { name: "My Students", path: "/supervisor/my-students", icon: "users" },
      {
        name: "Propose Project",
        path: "/supervisor/propose-project",
        icon: "plus-circle",
      },
      {
        name: "Proposed Titles",
        path: "/supervisor/proposed-titles",
        icon: "list",
      },
      {
        name: "Previous Projects",
        path: "/supervisor/previous-projects",
        icon: "archive",
      },
    ],
    Student: [
      { name: "Dashboard", path: "/student/project-work", icon: "dashboard" },
      { name: "My Project", path: "/student/project-work", icon: "briefcase" },
      { name: "Progress Logs", path: "/student/select-log", icon: "file-text" },
      {
        name: "Progress Reports",
        path: "/student/select-report",
        icon: "file-text",
      },
      { name: "View Proposal", path: "/student/view-proposal", icon: "eye" },
    ],
    Moderator: [
      { name: "Dashboard", path: "/moderator/dashboard", icon: "dashboard" },
      {
        name: "Proposed Titles",
        path: "/moderator/proposed-titles",
        icon: "list",
      },
      {
        name: "Previous Projects",
        path: "/moderator/previous-projects",
        icon: "archive",
      },
    ],
    Examiner: [
      { name: "Dashboard", path: "/examiner/dashboard", icon: "dashboard" },
    ],
  };

  return navigationMap[role] || [];
};
