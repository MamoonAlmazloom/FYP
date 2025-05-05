// models/feedbackModel.js
import pool from "../db.js";

/**
 * Get feedback for a specific proposal
 * @param {number} proposalId - The ID of the proposal
 * @returns {Promise<Array>} - Array of feedback
 */
const getFeedbackByProposal = async (proposalId) => {
  try {
    const [rows] = await pool.query(
      `SELECT f.feedback_id, f.comments, f.reviewer_id, u.name AS reviewer_name
       FROM Feedback f
       JOIN User u ON f.reviewer_id = u.user_id
       WHERE f.proposal_id = ?
       ORDER BY f.feedback_id DESC`,
      [proposalId]
    );
    return rows;
  } catch (error) {
    console.error("Error in getFeedbackByProposal:", error);
    throw error;
  }
};

/**
 * Add feedback to a proposal
 * @param {number} proposalId - The ID of the proposal
 * @param {number} reviewerId - The ID of the reviewer
 * @param {string} comments - Feedback comments
 * @returns {Promise<number>} - The ID of the created feedback
 */
const addFeedback = async (proposalId, reviewerId, comments) => {
  try {
    // Verify the proposal exists
    const [proposalExists] = await pool.query(
      `SELECT proposal_id FROM Proposal WHERE proposal_id = ?`,
      [proposalId]
    );

    if (proposalExists.length === 0) {
      throw new Error("Proposal not found");
    }

    // Add feedback
    const [result] = await pool.query(
      `INSERT INTO Feedback (proposal_id, reviewer_id, comments)
       VALUES (?, ?, ?)`,
      [proposalId, reviewerId, comments]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in addFeedback:", error);
    throw error;
  }
};

/**
 * Get feedback for a student's proposals
 * @param {number} studentId - The ID of the student
 * @returns {Promise<Array>} - Array of feedback
 */
const getFeedbackForStudent = async (studentId) => {
  try {
    const [rows] = await pool.query(
      `SELECT f.feedback_id, f.comments, f.reviewer_id, 
              u.name AS reviewer_name, p.proposal_id,
              pr.title AS project_title
       FROM Feedback f
       JOIN Proposal p ON f.proposal_id = p.proposal_id
       JOIN Project pr ON p.project_id = pr.project_id
       JOIN User u ON f.reviewer_id = u.user_id
       WHERE p.submitted_by = ?
       ORDER BY f.feedback_id DESC`,
      [studentId]
    );
    return rows;
  } catch (error) {
    console.error("Error in getFeedbackForStudent:", error);
    throw error;
  }
};

export default {
  getFeedbackByProposal,
  addFeedback,
  getFeedbackForStudent,
};
