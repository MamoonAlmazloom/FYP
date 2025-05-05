// models/proposalModel.js
import pool from "../db.js";

/**
 * Get all proposals for a specific student
 * @param {number} studentId - The ID of the student
 * @returns {Promise<Array>} - Array of proposals
 */
const getProposalsByStudent = async (studentId) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.proposal_id, pr.title, ps.status_name 
       FROM Proposal p
       JOIN Project pr ON p.project_id = pr.project_id
       JOIN Proposal_Status ps ON p.status_id = ps.status_id
       WHERE p.submitted_by = ?`,
      [studentId]
    );
    return rows;
  } catch (error) {
    console.error("Error in getProposalsByStudent:", error);
    throw error;
  }
};

/**
 * Create a new proposal
 * @param {number} studentId - The ID of the student submitting the proposal
 * @param {number} projectId - The ID of the project
 * @returns {Promise<number>} - The ID of the created proposal
 */
const createProposal = async (studentId, projectId) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO Proposal (project_id, submitted_by, status_id)
       VALUES (?, ?, (SELECT status_id FROM Proposal_Status WHERE status_name='Pending'))`,
      [projectId, studentId]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error in createProposal:", error);
    throw error;
  }
};

/**
 * Update an existing proposal
 * @param {number} proposalId - The ID of the proposal to update
 * @param {number} projectId - The new project ID
 * @returns {Promise<boolean>} - True if updated successfully
 */
const updateProposal = async (proposalId, projectId) => {
  try {
    const [result] = await pool.query(
      `UPDATE Proposal
       SET project_id = ?, status_id = (SELECT status_id FROM Proposal_Status WHERE status_name='Pending')
       WHERE proposal_id = ?`,
      [projectId, proposalId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in updateProposal:", error);
    throw error;
  }
};

export default {
  getProposalsByStudent,
  createProposal,
  updateProposal,
};
