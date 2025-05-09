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
 * @param {string} type - The type of the proposal
 * @param {string} specialization - The specialization of the proposal
 * @param {string} outcome - The outcome of the proposal
 * @param {number} submitted_to - The ID of the student to whom the proposal is submitted
 * @returns {Promise<number>} - The ID of the created proposal
 */
const createProposal = async (studentId, title, description, type, specialization, outcome, submitted_to) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO Proposal (
        project_id,
        submitted_by,
        submitted_to,
        status_id,
        title,
        proposal_description,
        type,
        specialization,
        outcome
      )
      VALUES (
        NULL,
        ?,
        ?,
        (SELECT status_id FROM Proposal_Status WHERE status_name='Pending'),
        ?,
        ?,
        ?,
        ?,
        ?
      )`,
      [studentId, submitted_to, title, description, type, specialization, outcome]
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
 * @param {string} type - The updated type
 * @param {string} specialization - The updated specialization
 * @param {string} outcome - The updated outcome
 * @returns {Promise<boolean>} - True if updated successfully
 */
const updateProposal = async (proposalId, title, description, type, specialization, outcome) => {
  try {
    const [result] = await pool.query(
      `UPDATE Proposal
       SET title = ?,
           proposal_description = ?,
           type = ?,
           specialization = ?,
           outcome = ?,
           status_id = (SELECT status_id FROM Proposal_Status WHERE status_name='Pending')
       WHERE proposal_id = ?`,
      [title, description, type, specialization, outcome, proposalId]
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
/**
 * Update only the status of a proposal
 * @param {number} proposalId
 * @param {number} statusId
 * @returns {Promise<boolean>}
 */
const updateProposalStatus = async (proposalId, statusId) => {
  try {
    const [result] = await pool.query(
      `UPDATE Proposal
         SET status_id = ?
       WHERE proposal_id = ?`,
      [statusId, proposalId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in updateProposalStatus:", error);
    throw error;
  }
};


export default {
  getProposalsByStudent,
  createProposal,
  updateProposal,
  getProposalById,
  updateProposalStatus,
};
