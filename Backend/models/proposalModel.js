// models/proposalModel.js - Updated
import pool from "../db.js";

/**
 * Get all proposals for a specific student
 * @param {number} studentId - The ID of the student
 * @returns {Promise<Array>} - Array of proposals
 */
const getProposalsByStudent = async (studentId) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.proposal_id, p.status_id, 
              p.title, p.proposal_description, 
              ps.status_name 
       FROM Proposal p
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
 * @param {string} title - The title of the proposal
 * @param {string} description - The description of the proposal
 * @returns {Promise<number>} - The ID of the created proposal
 */
const createProposal = async (studentId, title, description) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO Proposal (submitted_by, status_id, title, proposal_description)
       VALUES (?, (SELECT status_id FROM Proposal_Status WHERE status_name='Pending'), ?, ?)`,
      [studentId, title, description]
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
 * @param {string} title - The updated title
 * @param {string} description - The updated description
 * @returns {Promise<boolean>} - True if updated successfully
 */
const updateProposal = async (proposalId, title, description) => {
  try {
    console.log("Updating proposal with ID:", proposalId);
    console.log("New title:", title);

    console.log("New description:", description);
    const [result] = await pool.query(
      `UPDATE Proposal
       SET title = ?, proposal_description = ?, 
           status_id = (SELECT status_id FROM Proposal_Status WHERE status_name='Pending')
       WHERE proposal_id = ?`,
      [title, description, proposalId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in updateProposal:", error);
    throw error;
  }
};

/**
 * Get a specific proposal by ID
 * @param {number} proposalId - The ID of the proposal
 * @returns {Promise<Object>} - Proposal details
 */
const getProposalById = async (proposalId) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.proposal_id, p.status_id, 
              p.title, p.proposal_description, p.submitted_by,
              ps.status_name 
       FROM Proposal p
       JOIN Proposal_Status ps ON p.status_id = ps.status_id
       WHERE p.proposal_id = ?`,
      [proposalId]
    );
    return rows[0];
  } catch (error) {
    console.error("Error in getProposalById:", error);
    throw error;
  }
};

export default {
  getProposalsByStudent,
  createProposal,
  updateProposal,
  getProposalById,
};
