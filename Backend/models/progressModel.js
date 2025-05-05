// models/progressModel.js
import pool from "../db.js";

/**
 * Get all progress logs for a student
 * @param {number} studentId - The ID of the student
 * @returns {Promise<Array>} - Array of progress logs
 */
const getProgressLogs = async (studentId) => {
  try {
    const [rows] = await pool.query(
      `SELECT pl.log_id, pr.title AS project_title, pl.submission_date
       FROM Progress_Log pl
       JOIN Project pr ON pl.project_id = pr.project_id
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
 * @param {Date} date - Submission date
 * @returns {Promise<number>} - The ID of the created log
 */
const createProgressLog = async (studentId, projectId, date) => {
  try {
    // Verify the project exists and is assigned to the student
    const [projectAssigned] = await pool.query(
      `SELECT 1
       FROM Proposal
       WHERE project_id = ? AND submitted_by = ? AND 
             status_id = (SELECT status_id FROM Proposal_Status WHERE status_name = 'Approved')
       LIMIT 1`,
      [projectId, studentId]
    );

    if (projectAssigned.length === 0) {
      throw new Error(
        "Project is not assigned to this student or not approved"
      );
    }

    // Create the progress log
    const [result] = await pool.query(
      `INSERT INTO Progress_Log (project_id, student_id, submission_date)
       VALUES (?, ?, ?)`,
      [projectId, studentId, date]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in createProgressLog:", error);
    throw error;
  }
};

/**
 * Get details of a specific progress log
 * @param {number} logId - The ID of the progress log
 * @returns {Promise<Object>} - Progress log details
 */
const getProgressLogById = async (logId) => {
  try {
    const [rows] = await pool.query(
      `SELECT pl.log_id, pl.project_id, pr.title AS project_title, 
              pl.student_id, u.name AS student_name, pl.submission_date
       FROM Progress_Log pl
       JOIN Project pr ON pl.project_id = pr.project_id
       JOIN User u ON pl.student_id = u.user_id
       WHERE pl.log_id = ?`,
      [logId]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error in getProgressLogById:", error);
    throw error;
  }
};

export default {
  getProgressLogs,
  createProgressLog,
  getProgressLogById,
};
