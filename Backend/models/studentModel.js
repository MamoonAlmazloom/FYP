// models/studentModel.js - Fixed version
import pool from "../db.js";

/**
 * Get a student by ID
 * @param {number} studentId - The ID of the student
 * @returns {Promise<Object>} - Student data
 */
const getStudentById = async (studentId) => {
  try {
    // Updated query to use User_Roles junction table instead of expecting role_id in User table
    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.email 
       FROM User u
       JOIN User_Roles ur ON u.user_id = ur.user_id
       JOIN Role r ON ur.role_id = r.role_id
       WHERE u.user_id = ? AND r.role_name = 'Student'`,
      [studentId]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error in getStudentById:", error);
    throw error;
  }
};

/**
 * Get all progress logs for a student
 * @param {number} studentId - The ID of the student
 * @returns {Promise<Array>} - Array of progress logs
 */
const getProgressLogs = async (studentId) => {
  try {
    const [rows] = await pool.query(
      `SELECT pl.log_id, pl.project_id, pl.submission_date, pl.details, 
              p.title as project_title 
       FROM Progress_Log pl
       JOIN Project p ON pl.project_id = p.project_id
       WHERE pl.student_id = ?
       ORDER BY pl.submission_date DESC`,
      [studentId]
    );
    return rows;
  } catch (error) {
    console.error("Error in getProgressLogs:", error);
    throw error;
  }
};

/**
 * Create a new progress log
 * @param {number} studentId - The ID of the student
 * @param {number} projectId - The ID of the project
 * @param {string} details - The log details
 * @returns {Promise<number>} - The ID of the created log
 */
const createProgressLog = async (studentId, projectId, details) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO Progress_Log (student_id, project_id, submission_date, details)
       VALUES (?, ?, CURDATE(), ?)`,
      [studentId, projectId, details]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error in createProgressLog:", error);
    throw error;
  }
};

/**
 * Get all progress reports for a student
 * @param {number} studentId - The ID of the student
 * @returns {Promise<Array>} - Array of progress reports
 */
/**
 * Get progress reports for a student
 * @param {number} studentId - The ID of the student
 * @param {string} startDate - Optional start date for filtering (YYYY-MM-DD)
 * @param {string} endDate - Optional end date for filtering (YYYY-MM-DD)
 * @returns {Promise<Array>} - Array of progress reports
 */
const getProgressReports = async (studentId, startDate, endDate) => {
  try {
    let query = `
      SELECT pr.report_id, pr.project_id, pr.submission_date, pr.title, pr.details, 
             p.title as project_title 
      FROM Progress_Report pr
      JOIN Project p ON pr.project_id = p.project_id
      WHERE pr.student_id = ?
    `;

    const params = [studentId];

    if (startDate) {
      query += ` AND pr.submission_date >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND pr.submission_date <= ?`;
      params.push(endDate);
    }

    query += ` ORDER BY pr.submission_date DESC`;

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error("Error in getProgressReports:", error);
    throw error;
  }
};

/**
 * Create a new progress report
 * @param {number} studentId - The ID of the student
 * @param {number} projectId - The ID of the project
 * @param {string} title - Report title
 * @param {string} details - The report details
 * @returns {Promise<number>} - The ID of the created report
 */
const createProgressReport = async (studentId, projectId, title, details) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO Progress_Report (student_id, project_id, submission_date, title, details)
       VALUES (?, ?, CURDATE(), ?, ?)`,
      [studentId, projectId, title, details]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error in createProgressReport:", error);
    throw error;
  }
};

/**
 * Get available projects for selection
 * @returns {Promise<Array>} - Array of available projects
 */
const getAvailableProjects = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT p.project_id, p.title, p.description, u.name as supervisor_name, sp.supervisor_id
       FROM Project p
       JOIN Supervisor_Project sp ON p.project_id = sp.project_id
       JOIN User u ON sp.supervisor_id = u.user_id
       WHERE p.project_id NOT IN (
         SELECT DISTINCT pr.project_id 
         FROM Proposal pr
         JOIN User_Roles ur ON pr.submitted_by = ur.user_id
         JOIN Role r ON ur.role_id = r.role_id
         WHERE pr.status_id = (
           SELECT status_id FROM Proposal_Status WHERE status_name = 'Approved'
         )
         AND r.role_name = 'Student'
         AND pr.project_id IS NOT NULL
       )`
    );
    return rows;
  } catch (error) {
    console.error("Error in getAvailableProjects:", error);
    throw error;
  }
};

/**
 * Select a project from available projects
 * @param {number} studentId - The ID of the student
 * @param {number} projectId - The ID of the project
 * @returns {Promise<number>} - The proposal ID if selection was successful, null otherwise
 */
const selectProject = async (studentId, projectId) => {
  try {
    // First check if the project is available and get supervisor info
    const [available] = await pool.query(
      `SELECT p.project_id, p.title, p.description, sp.supervisor_id
       FROM Project p
       JOIN Supervisor_Project sp ON p.project_id = sp.project_id
       WHERE p.project_id = ? 
       AND p.project_id NOT IN (
         SELECT DISTINCT pr.project_id 
         FROM Proposal pr
         JOIN User_Roles ur ON pr.submitted_by = ur.user_id
         JOIN Role r ON ur.role_id = r.role_id
         WHERE pr.status_id = (
           SELECT status_id FROM Proposal_Status WHERE status_name = 'Approved'
         )
         AND r.role_name = 'Student'
         AND pr.project_id IS NOT NULL
       )`,
      [projectId]
    );

    if (available.length === 0) {
      throw new Error("Project is not available for selection");
    }

    const project = available[0];
    const supervisorId = project.supervisor_id;

    // Create a proposal with Pending status for the selected project
    const [statusResult] = await pool.query(
      `SELECT status_id FROM Proposal_Status WHERE status_name = 'Pending'`
    );

    if (statusResult.length === 0) {
      throw new Error("Proposal status not found");
    }

    const statusId = statusResult[0].status_id;

    // Insert the proposal with Pending status and supervisor ID
    const [result] = await pool.query(
      `INSERT INTO Proposal (project_id, submitted_by, submitted_to, status_id, title, proposal_description, type, specialization, outcome)
       VALUES (?, ?, ?, ?, ?, ?, 'Application', 'General', 'Project completion')`,
      [
        projectId,
        studentId,
        supervisorId,
        statusId,
        project.title,
        project.description,
      ]
    );

    return result.insertId; // Return the proposal ID instead of boolean
  } catch (error) {
    console.error("Error in selectProject:", error);
    throw error;
  }
};

/**
 * Get feedback for a student
 * @param {number} studentId - The ID of the student
 * @param {string} feedbackType - Type of feedback (proposal, log, report)
 * @param {number} itemId - The ID of the item receiving feedback
 * @returns {Promise<Array>} - Array of feedback
 */
const getFeedback = async (studentId, feedbackType, itemId) => {
  try {
    let query = "";
    let params = [];

    switch (feedbackType) {
      case "proposal":
        query = `
          SELECT f.feedback_id, f.comments, f.created_at, u.name as reviewer_name
          FROM Feedback f
          JOIN User u ON f.reviewer_id = u.user_id
          JOIN Proposal p ON f.proposal_id = p.proposal_id
          WHERE p.submitted_by = ? AND p.proposal_id = ?
          ORDER BY f.created_at DESC
        `;
        params = [studentId, itemId];
        break;

      case "log":
        query = `
          SELECT f.feedback_id, f.comments, f.created_at, u.name as reviewer_name
          FROM Feedback f
          JOIN User u ON f.reviewer_id = u.user_id
          JOIN Progress_Log pl ON f.log_id = pl.log_id
          WHERE pl.student_id = ? AND pl.log_id = ?
          ORDER BY f.created_at DESC
        `;
        params = [studentId, itemId];
        break;

      case "report":
        query = `
          SELECT f.feedback_id, f.comments, f.created_at, u.name as reviewer_name
          FROM Feedback f
          JOIN User u ON f.reviewer_id = u.user_id
          JOIN Progress_Report pr ON f.report_id = pr.report_id
          WHERE pr.student_id = ? AND pr.report_id = ?
          ORDER BY f.created_at DESC
        `;
        params = [studentId, itemId];
        break;

      default:
        throw new Error("Invalid feedback type");
    }

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error("Error in getFeedback:", error);
    throw error;
  }
};

/**
 * Get projects for a student
 * @param {number} studentId - The student's ID
 * @returns {Promise<Array>} - Array of student's projects
 */
const getStudentProjects = async (studentId) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.project_id, p.title, p.description, 
              u.name as supervisor_name
       FROM Project p
       JOIN Proposal prop ON p.project_id = prop.project_id
       JOIN Supervisor_Project sp ON p.project_id = sp.project_id
       JOIN User u ON sp.supervisor_id = u.user_id
       WHERE prop.submitted_by = ? 
       AND prop.status_id = (SELECT status_id FROM Proposal_Status WHERE status_name = 'Approved')`,
      [studentId]
    );
    return rows;
  } catch (error) {
    console.error("Error in getStudentProjects:", error);
    throw error;
  }
};

export default {
  getStudentById,
  getProgressLogs,
  createProgressLog,
  getProgressReports,
  createProgressReport,
  getAvailableProjects,
  selectProject,
  getFeedback,
  getStudentProjects,
};
