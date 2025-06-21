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
    // Get regular projects
    const [projectRows] = await pool.query(
      `SELECT p.project_id, p.title, p.description, u.name as supervisor_name, 
              sp.supervisor_id, 'project' as source_type,
              NULL as type, NULL as specialization, NULL as outcome
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

    // Get approved supervisor proposals
    const [proposalRows] = await pool.query(
      `SELECT p.proposal_id as project_id, p.title, p.proposal_description as description,
              u.name as supervisor_name, p.submitted_by as supervisor_id,
              'supervisor_proposal' as source_type, p.type, p.specialization, p.outcome
       FROM Proposal p
       JOIN Proposal_Status ps ON p.status_id = ps.status_id
       JOIN User u ON p.submitted_by = u.user_id
       WHERE ps.status_name = 'Approved'
         AND p.submitted_to IS NULL  -- Supervisor-created proposals
         AND p.proposal_id NOT IN (
           -- Exclude proposals already selected by students
           SELECT DISTINCT pr2.project_id
           FROM Proposal pr2
           JOIN User_Roles ur ON pr2.submitted_by = ur.user_id
           JOIN Role r ON ur.role_id = r.role_id
           WHERE r.role_name = 'Student'
             AND pr2.status_id IN (
               SELECT status_id FROM Proposal_Status 
               WHERE status_name IN ('Pending', 'Approved', 'Supervisor_Approved')
             )
             AND pr2.project_id IS NOT NULL
         )
       ORDER BY p.proposal_id DESC`
    );

    // Combine both sources
    const allProjects = [...projectRows, ...proposalRows];

    // Deduplicate by title and supervisor combination to avoid showing
    // the same project from both regular projects and supervisor proposals
    const uniqueProjects = [];
    const seen = new Set();

    allProjects.forEach((project) => {
      // Create a unique key using title and supervisor_id
      const uniqueKey = `${project.title.trim().toLowerCase()}-${
        project.supervisor_id
      }`;

      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        uniqueProjects.push(project);
      }
    });

    return uniqueProjects;
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
    // First, check if this is a regular project or an approved supervisor proposal
    // Try to find it as a regular project first
    const [regularProject] = await pool.query(
      `SELECT p.project_id, p.title, p.description, sp.supervisor_id, 'project' as source_type
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

    // If not found as regular project, try to find it as an approved supervisor proposal
    let project = null;
    let sourceType = null;

    if (regularProject.length > 0) {
      project = regularProject[0];
      sourceType = "project";
    } else {
      // Check if it's an approved supervisor proposal
      const [supervisorProposal] = await pool.query(
        `SELECT p.proposal_id as project_id, p.title, p.proposal_description as description,
                p.submitted_by as supervisor_id, 'supervisor_proposal' as source_type,
                p.type, p.specialization, p.outcome
         FROM Proposal p
         JOIN Proposal_Status ps ON p.status_id = ps.status_id
         WHERE p.proposal_id = ?
           AND ps.status_name = 'Approved'
           AND p.submitted_to IS NULL  -- Supervisor-created proposals
           AND p.proposal_id NOT IN (
             -- Exclude proposals already selected by students
             SELECT DISTINCT pr2.project_id
             FROM Proposal pr2
             JOIN User_Roles ur ON pr2.submitted_by = ur.user_id
             JOIN Role r ON ur.role_id = r.role_id
             WHERE r.role_name = 'Student'
               AND pr2.status_id IN (
                 SELECT status_id FROM Proposal_Status 
                 WHERE status_name IN ('Pending', 'Approved', 'Supervisor_Approved')
               )
               AND pr2.project_id IS NOT NULL
           )`,
        [projectId]
      );

      if (supervisorProposal.length > 0) {
        project = supervisorProposal[0];
        sourceType = "supervisor_proposal";
      }
    }

    if (!project) {
      throw new Error("Project is not available for selection");
    }

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
    // For supervisor proposals, we reference the original proposal as project_id
    // For regular projects, we use the project_id as usual
    const [result] = await pool.query(
      `INSERT INTO Proposal (project_id, submitted_by, submitted_to, status_id, title, proposal_description, type, specialization, outcome)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sourceType === "supervisor_proposal" ? null : projectId, // project_id is null for supervisor proposals
        studentId,
        supervisorId,
        statusId,
        project.title,
        project.description || project.proposal_description,
        project.type || "Application",
        project.specialization || "General",
        project.outcome || "Project completion",
      ]
    );

    // If this was a supervisor proposal, we need to link it back to the original proposal
    if (sourceType === "supervisor_proposal") {
      // Update the student's proposal to reference the original supervisor proposal
      await pool.query(
        `UPDATE Proposal SET project_id = ? WHERE proposal_id = ?`,
        [projectId, result.insertId]
      );
    }

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

/**
 * Check if student has any active projects (approved or pending proposals)
 * @param {number} studentId - The ID of the student
 * @returns {Promise<boolean>} - True if student has active project, false otherwise
 */
const hasActiveProject = async (studentId) => {
  try {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count
       FROM Proposal p
       WHERE p.submitted_by = ?
       AND p.status_id IN (
         SELECT status_id FROM Proposal_Status 
         WHERE status_name IN ('Approved', 'Pending')
       )`,
      [studentId]
    );
    return rows[0].count > 0;
  } catch (error) {
    console.error("Error in hasActiveProject:", error);
    throw error;
  }
};

/**
 * Get student's active project details (approved or latest pending)
 * @param {number} studentId - The ID of the student
 * @returns {Promise<Object|null>} - Active project details or null if none
 */
const getActiveProject = async (studentId) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.proposal_id, p.project_id, p.title, p.proposal_description, 
              p.type, p.specialization, p.outcome, ps.status_name,
              u.name as supervisor_name
       FROM Proposal p
       JOIN Proposal_Status ps ON p.status_id = ps.status_id
       LEFT JOIN User u ON p.submitted_to = u.user_id
       WHERE p.submitted_by = ?
       AND p.status_id IN (
         SELECT status_id FROM Proposal_Status 
         WHERE status_name IN ('Approved', 'Pending')
       )
       ORDER BY p.proposal_id DESC
       LIMIT 1`,
      [studentId]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error in getActiveProject:", error);
    throw error;
  }
};

/**
 * Get approved supervisor proposals available for student selection
 * @returns {Promise<Array>} - Array of approved supervisor proposals
 */
const getApprovedSupervisorProposals = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT p.proposal_id, p.title, p.proposal_description as description,
              p.type, p.specialization, p.outcome,
              u.name as supervisor_name, p.submitted_by as supervisor_id
       FROM Proposal p
       JOIN Proposal_Status ps ON p.status_id = ps.status_id
       JOIN User u ON p.submitted_by = u.user_id
       WHERE ps.status_name = 'Approved'
         AND p.submitted_to IS NULL  -- Supervisor-created proposals
         AND p.proposal_id NOT IN (
           -- Exclude proposals already selected by students
           SELECT DISTINCT pr.proposal_id
           FROM Proposal pr2
           JOIN User_Roles ur ON pr2.submitted_by = ur.user_id
           JOIN Role r ON ur.role_id = r.role_id
           WHERE pr2.proposal_id = p.proposal_id
             AND r.role_name = 'Student'
             AND pr2.status_id = (
               SELECT status_id FROM Proposal_Status WHERE status_name = 'Approved'
             )
         )
       ORDER BY p.proposal_id DESC`
    );
    return rows;
  } catch (error) {
    console.error("Error in getApprovedSupervisorProposals:", error);
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
  hasActiveProject,
  getActiveProject,
  getApprovedSupervisorProposals,
};
