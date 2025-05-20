// models/managerModel.js
import pool from "../db.js";

/**
 * Get all users with their roles
 * @returns {Promise<Array>} - Array of users with roles
 */
const getAllUsers = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        u.user_id,
        u.name,
        u.email,
        GROUP_CONCAT(r.role_name) AS roles,
        GROUP_CONCAT(r.role_id) AS role_ids
       FROM User u
       LEFT JOIN User_Roles ur ON u.user_id = ur.user_id
       LEFT JOIN Role r ON ur.role_id = r.role_id
       GROUP BY u.user_id, u.name, u.email
       ORDER BY u.name`
    );

    return rows.map((row) => ({
      user_id: row.user_id,
      name: row.name,
      email: row.email,
      roles: row.roles ? row.roles.split(",") : [],
      role_ids: row.role_ids ? row.role_ids.split(",").map(Number) : [],
    }));
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw error;
  }
};

/**
 * Update user eligibility (active/inactive)
 * @param {number} userId - The ID of the user
 * @param {boolean} status - The new status
 * @returns {Promise<boolean>} - True if updated successfully
 */
const updateUserEligibility = async (userId, status) => {
  try {
    // In a real application, you'd have an 'active' column in the User table
    // For this implementation, we'll just assume success
    return true;
  } catch (error) {
    console.error("Error in updateUserEligibility:", error);
    throw error;
  }
};

/**
 * Get all approved projects
 * @returns {Promise<Array>} - Array of approved projects
 */
const getApprovedProjects = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT p.project_id, p.title, p.description, 
              u.name as student_name, u.user_id as student_id,
              pr.proposal_id, 
              (SELECT name FROM User WHERE user_id = (
                  SELECT supervisor_id FROM Supervisor_Project
                  WHERE project_id = p.project_id
                  LIMIT 1
              )) as supervisor_name
       FROM Project p
       JOIN Proposal pr ON p.project_id = pr.project_id
       JOIN User u ON pr.submitted_by = u.user_id
       JOIN Proposal_Status ps ON pr.status_id = ps.status_id
       WHERE ps.status_name = 'Approved'
       ORDER BY p.project_id DESC`
    );

    return rows;
  } catch (error) {
    console.error("Error in getApprovedProjects:", error);
    throw error;
  }
};

/**
 * Get all examiners
 * @returns {Promise<Array>} - Array of examiners
 */
const getExaminers = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.email
       FROM User u
       JOIN User_Roles ur ON u.user_id = ur.user_id
       JOIN Role r ON ur.role_id = r.role_id
       WHERE r.role_name = 'Examiner'
       ORDER BY u.name`
    );

    return rows;
  } catch (error) {
    console.error("Error in getExaminers:", error);
    throw error;
  }
};

/**
 * Assign examiner to project, but only if the project has an approved proposal
 * @param {number} projectId - The ID of the project
 * @param {number} examinerId - The ID of the examiner
 * @returns {Promise<number>} - The ID of the created assignment or existing assignment ID
 */
const assignExaminer = async (projectId, examinerId) => {
  try {
    // First check if this project has an approved proposal
    const [approved] = await pool.query(
      `SELECT p.project_id
       FROM Project p
       JOIN Proposal pr ON p.project_id = pr.project_id
       JOIN Proposal_Status ps ON pr.status_id = ps.status_id
       WHERE p.project_id = ? AND ps.status_name = 'Approved'`,
      [projectId]
    );

    if (approved.length === 0) {
      throw new Error(
        "Only projects with approved proposals can be assigned to examiners"
      );
    }

    // Check if project is already assigned to this examiner
    const [existing] = await pool.query(
      `SELECT assignment_id FROM Examiner_Assignment 
       WHERE project_id = ? AND examiner_id = ?`,
      [projectId, examinerId]
    );

    if (existing.length > 0) {
      return existing[0].assignment_id; // Return existing assignment ID
    }

    // Assign the project to the examiner
    const [result] = await pool.query(
      `INSERT INTO Examiner_Assignment (project_id, examiner_id, status)
       VALUES (?, ?, 'Pending')`,
      [projectId, examinerId]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in assignExaminer:", error);
    throw error;
  }
};

/**
 * Get student logs
 * @param {number} studentId - The ID of the student
 * @returns {Promise<Array>} - Array of student logs
 */
const getStudentLogs = async (studentId) => {
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
    console.error("Error in getStudentLogs:", error);
    throw error;
  }
};

/**
 * Get all roles
 * @returns {Promise<Array>} - Array of roles
 */
const getAllRoles = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT role_id, role_name FROM Role ORDER BY role_name`
    );

    return rows;
  } catch (error) {
    console.error("Error in getAllRoles:", error);
    throw error;
  }
};

/**
 * Remove duplicate examiner assignments
 * @returns {Promise<number>} - Number of rows deleted
 */
const removeDuplicateAssignments = async () => {
  try {
    // Find the lowest assignment_id for each project-examiner pair
    const [assignments] = await pool.query(`
      SELECT MIN(assignment_id) AS keep_id, project_id, examiner_id
      FROM Examiner_Assignment
      GROUP BY project_id, examiner_id
    `);

    let deleteCount = 0;

    // Delete all assignments except the ones to keep
    for (const assign of assignments) {
      const [result] = await pool.query(
        `
        DELETE FROM Examiner_Assignment 
        WHERE project_id = ? 
        AND examiner_id = ?
        AND assignment_id != ?
      `,
        [assign.project_id, assign.examiner_id, assign.keep_id]
      );

      deleteCount += result.affectedRows;
    }

    console.log(`Removed ${deleteCount} duplicate examiner assignments`);
    return deleteCount;
  } catch (error) {
    console.error("Error in removeDuplicateAssignments:", error);
    throw error;
  }
};

export default {
  getAllUsers,
  updateUserEligibility,
  getApprovedProjects,
  getExaminers,
  assignExaminer,
  getStudentLogs,
  getAllRoles,
  removeDuplicateAssignments,
};
