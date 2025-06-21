// controllers/managerController.js
import authModel from "../models/authModel.js";
import managerModel from "../models/managerModel.js";
import notificationModel from "../models/notificationModel.js";

// Get all users implementation
const getUsers = async (req, res, next) => {
  try {
    const users = await managerModel.getAllUsers();
    res.status(200).json({ success: true, users });
  } catch (err) {
    next(err);
  }
};
/**
 * Update user eligibility
 */
const updateUserEligibility = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { status } = req.body;

    if (status === undefined) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }

    const updated = await managerModel.updateUserEligibility(userId, status);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `User eligibility updated to ${status ? "active" : "inactive"}`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Register a new user
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, roles } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !roles ||
      !Array.isArray(roles) ||
      roles.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Name, email, password, and at least one role are required",
      });
    }

    // Check if email already exists
    const existingUser = await authModel.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Email already in use",
      });
    }

    const userId = await authModel.createUser(name, email, password, roles);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId,
    });
  } catch (err) {
    if (err.message && err.message.includes("not found")) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }
    next(err);
  }
};

/**
 * Get approved projects
 */
const getApprovedProjects = async (req, res, next) => {
  try {
    const projects = await managerModel.getApprovedProjects();
    res.status(200).json({ success: true, projects });
  } catch (err) {
    next(err);
  }
};

/**
 * Assign examiner to project
 */
const assignExaminer = async (req, res, next) => {
  try {
    const { examiner_id, project_id } = req.body;

    if (!examiner_id || !project_id) {
      return res.status(400).json({
        success: false,
        error: "Examiner ID and Project ID are required",
      });
    }

    const assignmentId = await managerModel.assignExaminer(
      project_id,
      examiner_id
    );

    res.status(200).json({
      success: true,
      message: "Examiner assigned successfully",
      assignmentId,
    });
  } catch (err) {
    if (
      err.message &&
      err.message.includes("Only projects with approved proposals")
    ) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    } else if (err.message && err.message.includes("already assigned")) {
      return res.status(409).json({
        success: false,
        error: err.message,
      });
    }
    next(err);
  }
};

/**
 * Get student logs
 */
const getStudentLogs = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const logs = await managerModel.getStudentLogs(studentId);

    res.status(200).json({ success: true, logs });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all roles
 */
const getRoles = async (req, res, next) => {
  try {
    const roles = await managerModel.getAllRoles();
    res.status(200).json({ success: true, roles });
  } catch (err) {
    next(err);
  }
};

/**
 * Get examiners
 */
const getExaminers = async (req, res, next) => {
  try {
    const examiners = await managerModel.getExaminers();
    res.status(200).json({ success: true, examiners });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all previous (completed) projects
 */
const getPreviousProjects = async (req, res, next) => {
  try {
    const projects = await managerModel.getPreviousProjects();
    res.status(200).json({ success: true, projects });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all archived projects with optional filtering
 */
const getArchivedProjects = async (req, res, next) => {
  try {
    const filters = {
      academic_year: req.query.academic_year,
      semester: req.query.semester,
      student_name: req.query.student_name,
      supervisor_name: req.query.supervisor_name,
      examiner_name: req.query.examiner_name,
      min_grade: req.query.min_grade ? parseFloat(req.query.min_grade) : null,
      max_grade: req.query.max_grade ? parseFloat(req.query.max_grade) : null,
    };

    // Remove null/undefined filters
    Object.keys(filters).forEach((key) => {
      if (
        filters[key] === null ||
        filters[key] === undefined ||
        filters[key] === ""
      ) {
        delete filters[key];
      }
    });

    const projects = await managerModel.getArchivedProjects(filters);
    res.status(200).json({
      success: true,
      projects,
      count: projects.length,
      filters_applied: filters,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get archived project details by ID
 */
const getArchivedProjectById = async (req, res, next) => {
  try {
    const archiveId = req.params.archiveId;
    const project = await managerModel.getArchivedProjectById(archiveId);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Archived project not found",
      });
    }

    res.status(200).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

/**
 * Get archive statistics
 */
const getArchiveStatistics = async (req, res, next) => {
  try {
    const statistics = await managerModel.getArchiveStatistics();
    res.status(200).json({ success: true, statistics });
  } catch (err) {
    next(err);
  }
};

/**
 * Search archived projects
 */
const searchArchivedProjects = async (req, res, next) => {
  try {
    const { q, type = "all" } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const validTypes = ["title", "student", "supervisor", "all"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Invalid search type. Must be one of: " + validTypes.join(", "),
      });
    }

    const projects = await managerModel.searchArchivedProjects(q.trim(), type);
    res.status(200).json({
      success: true,
      projects,
      search_query: q.trim(),
      search_type: type,
      results_count: projects.length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get projects by academic year and semester
 */
const getProjectsByAcademicPeriod = async (req, res, next) => {
  try {
    const { academic_year, semester } = req.params;

    if (!academic_year || !semester) {
      return res.status(400).json({
        success: false,
        error: "Academic year and semester are required",
      });
    }

    const projects = await managerModel.getProjectsByAcademicPeriod(
      academic_year,
      semester
    );
    res.status(200).json({
      success: true,
      projects,
      academic_year,
      semester,
      count: projects.length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get available academic periods
 */
const getAvailableAcademicPeriods = async (req, res, next) => {
  try {
    const periods = await managerModel.getAvailableAcademicPeriods();
    res.status(200).json({ success: true, periods });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a user
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    // Check if user exists first
    const users = await managerModel.getAllUsers();
    const userExists = users.find((user) => user.user_id == userId);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Prevent deletion of the current manager
    if (userId == req.user.id) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete your own account",
      });
    }

    // Try to delete the user
    const deleted = await managerModel.deleteUser(userId);

    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: "Failed to delete user - no rows affected",
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${userExists.name} has been deleted successfully`,
    });
  } catch (err) {
    console.error("Error in deleteUser controller:", err);

    // Handle specific database errors
    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        success: false,
        error:
          "Cannot delete user: User has associated data that prevents deletion",
      });
    }

    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        success: false,
        error: "Cannot delete user: Referenced data not found",
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      error: "Internal server error while deleting user",
      details: err.message,
    });
  }
};

export default {
  getUsers,
  updateUserEligibility,
  registerUser,
  getApprovedProjects,
  assignExaminer,
  getStudentLogs,
  getRoles,
  getExaminers,
  getPreviousProjects,
  getArchivedProjects,
  getArchivedProjectById,
  getArchiveStatistics,
  searchArchivedProjects,
  getProjectsByAcademicPeriod,
  getAvailableAcademicPeriods,
  deleteUser,
};
