// models/examinerModel.js
import pool from "../db.js";

/**
 * Get all projects assigned to an examiner
 * @param {number} examinerId - The ID of the examiner
 * @returns {Promise<Array>} - Array of assigned projects
 */
const getAssignedProjects = async (examinerId) => {
  try {
    // Get only projects that are both assigned to this examiner and have approved proposals
    const [rows] = await pool.query(
      `SELECT DISTINCT ea.assignment_id, p.project_id, p.title, p.description,
              u.name as student_name, u.user_id as student_id,
              ea.status, ps.status_name as proposal_status
       FROM Examiner_Assignment ea
       JOIN Project p ON ea.project_id = p.project_id
       JOIN Proposal pr ON p.project_id = pr.project_id
       JOIN User u ON pr.submitted_by = u.user_id
       JOIN Proposal_Status ps ON pr.status_id = ps.status_id
       WHERE ea.examiner_id = ?
       AND ps.status_name = 'Approved'
       ORDER BY ea.assignment_id DESC`,
      [examinerId]
    );

    console.log(
      `Found ${rows.length} assigned projects with approved proposals for examiner ID ${examinerId}`
    );
    return rows;
  } catch (error) {
    console.error("Error in getAssignedProjects:", error);
    throw error;
  }
};

/**
 * Get project by ID, but only if assigned to this examiner
 * @param {number} projectId - The ID of the project
 * @param {number} examinerId - The ID of the examiner
 * @returns {Promise<Object>} - Project details
 */
const getProjectById = async (projectId, examinerId) => {
  try {
    // Only return project details if this project is assigned to this examiner
    const [rows] = await pool.query(
      `SELECT p.project_id, p.title, p.description,
              u.name as student_name, u.user_id as student_id,
              u2.name as supervisor_name, sp.supervisor_id,
              ps.status_name as proposal_status
       FROM Project p
       JOIN Proposal pr ON p.project_id = pr.project_id
       JOIN User u ON pr.submitted_by = u.user_id
       JOIN Proposal_Status ps ON pr.status_id = ps.status_id
       LEFT JOIN Supervisor_Project sp ON p.project_id = sp.project_id
       LEFT JOIN User u2 ON sp.supervisor_id = u2.user_id
       JOIN Examiner_Assignment ea ON p.project_id = ea.project_id
       WHERE p.project_id = ? 
       AND ea.examiner_id = ?
       AND ps.status_name = 'Approved'`,
      [projectId, examinerId]
    );

    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    console.error("Error in getProjectById:", error);
    throw error;
  }
};

/**
 * Get project submission, but only if project is assigned to this examiner
 * @param {number} projectId - The ID of the project
 * @param {number} examinerId - The ID of the examiner
 * @returns {Promise<Object>} - Submission details
 */
const getProjectSubmission = async (projectId, examinerId) => {
  try {
    // First check if this project is assigned to the examiner
    const [assigned] = await pool.query(
      `SELECT * FROM Examiner_Assignment 
       WHERE examiner_id = ? AND project_id = ?`,
      [examinerId, projectId]
    );

    if (assigned.length === 0) {
      return null; // Not assigned to this examiner
    }

    // Then get the submission
    const [rows] = await pool.query(
      `SELECT ps.submission_id, ps.project_id, ps.submission_date,
              ps.submission_file, ps.comments, ps.status
       FROM Project_Submission ps
       WHERE ps.project_id = ?
       ORDER BY ps.submission_date DESC
       LIMIT 1`,
      [projectId]
    );

    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    console.error("Error in getProjectSubmission:", error);
    throw error;
  }
};

/**
 * Create evaluation for a project, only if assigned to this examiner
 * @param {number} examinerId - The ID of the examiner
 * @param {number} projectId - The ID of the project
 * @param {string} feedback - Evaluation feedback
 * @param {number} grade - Evaluation grade
 * @returns {Promise<number>} - ID of the created evaluation
 */
const createEvaluation = async (examinerId, projectId, feedback, grade) => {
  try {
    // Check if this project is assigned to the examiner
    const [assigned] = await pool.query(
      `SELECT * FROM Examiner_Assignment 
       WHERE examiner_id = ? AND project_id = ?`,
      [examinerId, projectId]
    );

    if (assigned.length === 0) {
      throw new Error("You can only evaluate projects assigned to you");
    }

    const [result] = await pool.query(
      `INSERT INTO Project_Evaluation (project_id, examiner_id, feedback, grade, evaluation_date)
       VALUES (?, ?, ?, ?, NOW())`,
      [projectId, examinerId, feedback, grade]
    );

    // Update the examiner assignment status
    await pool.query(
      `UPDATE Examiner_Assignment 
       SET status = 'Completed' 
       WHERE project_id = ? AND examiner_id = ?`,
      [projectId, examinerId]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in createEvaluation:", error);
    throw error;
  }
};

/**
 * Update evaluation for a project
 * @param {number} examinerId - The ID of the examiner
 * @param {number} projectId - The ID of the project
 * @param {string} feedback - Updated evaluation feedback
 * @param {number} grade - Updated evaluation grade
 * @returns {Promise<boolean>} - Success indicator
 */
const updateEvaluation = async (examinerId, projectId, feedback, grade) => {
  try {
    const [result] = await pool.query(
      `UPDATE Project_Evaluation 
       SET feedback = ?, grade = ?, evaluation_date = NOW()
       WHERE project_id = ? AND examiner_id = ?`,
      [feedback, grade, projectId, examinerId]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in updateEvaluation:", error);
    throw error;
  }
};

/**
 * Get examiner profile
 * @param {number} examinerId - The ID of the examiner
 * @returns {Promise<Object>} - Examiner profile
 */
const getExaminerProfile = async (examinerId) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.email, 
              (SELECT COUNT(*) FROM Examiner_Assignment WHERE examiner_id = ?) as assigned_projects,
              (SELECT COUNT(*) FROM Project_Evaluation WHERE examiner_id = ?) as completed_evaluations
       FROM User u
       WHERE u.user_id = ?`,
      [examinerId, examinerId, examinerId]
    );

    if (rows.length === 0) return null;
    return rows[0];
  } catch (error) {
    console.error("Error in getExaminerProfile:", error);
    throw error;
  }
};

/**
 * Get evaluations by examiner
 * @param {number} examinerId - The ID of the examiner
 * @returns {Promise<Array>} - Array of evaluations
 */
const getEvaluationsByExaminer = async (examinerId) => {
  try {
    const [rows] = await pool.query(
      `SELECT pe.evaluation_id, pe.project_id, p.title, 
              u.name as student_name, pe.grade, pe.feedback, 
              pe.evaluation_date
       FROM Project_Evaluation pe
       JOIN Project p ON pe.project_id = p.project_id
       JOIN Proposal pr ON p.project_id = pr.project_id
       JOIN User u ON pr.submitted_by = u.user_id
       WHERE pe.examiner_id = ?
       ORDER BY pe.evaluation_date DESC`,
      [examinerId]
    );

    return rows;
  } catch (error) {
    console.error("Error in getEvaluationsByExaminer:", error);
    throw error;
  }
};

/**
 * Get evaluation statistics
 * @param {number} examinerId - The ID of the examiner
 * @returns {Promise<Object>} - Evaluation statistics
 */
const getEvaluationStatistics = async (examinerId) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        COUNT(*) as total_evaluations,
        AVG(grade) as average_grade,
        MAX(grade) as highest_grade,
        MIN(grade) as lowest_grade,
        (SELECT COUNT(*) FROM Examiner_Assignment WHERE examiner_id = ? AND status = 'Pending') as pending_evaluations
       FROM Project_Evaluation
       WHERE examiner_id = ?`,
      [examinerId, examinerId]
    );

    return rows[0];
  } catch (error) {
    console.error("Error in getEvaluationStatistics:", error);
    throw error;
  }
};

/**
 * Schedule examination
 * @param {number} examinerId - The ID of the examiner
 * @param {number} projectId - The ID of the project
 * @param {string} examinationDate - The examination date
 * @param {string} venue - The examination venue
 * @returns {Promise<number>} - ID of the created schedule
 */
const scheduleExamination = async (
  examinerId,
  projectId,
  examinationDate,
  venue
) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO Examination_Schedule (project_id, examiner_id, examination_date, venue)
       VALUES (?, ?, ?, ?)`,
      [projectId, examinerId, examinationDate, venue]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in scheduleExamination:", error);
    throw error;
  }
};

/**
 * Get scheduled examinations
 * @param {number} examinerId - The ID of the examiner
 * @returns {Promise<Array>} - Array of scheduled examinations
 */
const getScheduledExaminations = async (examinerId) => {
  try {
    const [rows] = await pool.query(
      `SELECT es.schedule_id, es.project_id, p.title,
              u.name as student_name, es.examination_date, es.venue
       FROM Examination_Schedule es
       JOIN Project p ON es.project_id = p.project_id
       JOIN Proposal pr ON p.project_id = pr.project_id
       JOIN User u ON pr.submitted_by = u.user_id
       WHERE es.examiner_id = ?
       ORDER BY es.examination_date ASC`,
      [examinerId]
    );

    return rows;
  } catch (error) {
    console.error("Error in getScheduledExaminations:", error);
    throw error;
  }
};

/**
 * Request extension for evaluation
 * @param {number} examinerId - The ID of the examiner
 * @param {number} projectId - The ID of the project
 * @param {string} reason - The reason for extension
 * @param {number} requestedDays - The number of days requested
 * @returns {Promise<number>} - ID of the created request
 */
const requestExtension = async (
  examinerId,
  projectId,
  reason,
  requestedDays
) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO Extension_Request (examiner_id, project_id, reason, requested_days, status, request_date)
       VALUES (?, ?, ?, ?, 'Pending', NOW())`,
      [examinerId, projectId, reason, requestedDays]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in requestExtension:", error);
    throw error;
  }
};

/**
 * Update project examination status
 * @param {number} examinerId - The ID of the examiner
 * @param {number} projectId - The ID of the project
 * @param {string} status - The new status
 * @returns {Promise<boolean>} - True if updated successfully
 */
const updateProjectStatus = async (examinerId, projectId, status) => {
  try {
    // First verify that this project is assigned to this examiner
    const [assigned] = await pool.query(
      `SELECT assignment_id FROM Examiner_Assignment 
       WHERE examiner_id = ? AND project_id = ?`,
      [examinerId, projectId]
    );
    if (assigned.length === 0) {
      return false; // Project not assigned to this examiner
    }

    // Update the assignment status
    const [result] = await pool.query(
      `UPDATE Examiner_Assignment 
       SET status = ? 
       WHERE examiner_id = ? AND project_id = ?`,
      [status, examinerId, projectId]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in updateProjectStatus:", error);
    throw error;
  }
};

export default {
  getAssignedProjects,
  getProjectById,
  getProjectSubmission,
  createEvaluation,
  updateEvaluation,
  getExaminerProfile,
  getEvaluationsByExaminer,
  getEvaluationStatistics,
  scheduleExamination,
  getScheduledExaminations,
  requestExtension,
  updateProjectStatus,
};
