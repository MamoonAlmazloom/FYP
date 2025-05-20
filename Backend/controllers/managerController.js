// controllers/managerController.js
import authModel from "../models/authModel.js";
import managerModel from "../models/managerModel.js";

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
      message: `User eligibility updated to ${status ? 'active' : 'inactive'}`,
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
    
    if (!name || !email || !password || !roles || !Array.isArray(roles) || roles.length === 0) {
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
    
    const assignmentId = await managerModel.assignExaminer(project_id, examiner_id);
    
    res.status(200).json({
      success: true,
      message: "Examiner assigned successfully",
      assignmentId,
    });
  } catch (err) {
    if (err.message && err.message.includes("Only projects with approved proposals")) {
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

export default {
  getUsers,
  updateUserEligibility,
  registerUser,
  getApprovedProjects,
  assignExaminer,
  getStudentLogs,
  getRoles,
  getExaminers,
};