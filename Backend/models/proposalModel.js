// models/proposalModel.js - Add these functions
import pool from "../db.js";

/**
 * Update proposal status
 * @param {number} proposalId - The ID of the proposal
 * @param {string} statusName - The name of the status
 * @returns {Promise<boolean>} - True if updated successfully
 */
const updateProposalStatus = async (proposalId, statusName) => {
  try {
    // Get status ID from status name
    const [statusRows] = await pool.query(
      `SELECT status_id FROM Proposal_Status WHERE status_name = ?`,
      [statusName]
    );

    if (statusRows.length === 0) {
      throw new Error(`Invalid status: ${statusName}`);
    }

    const statusId = statusRows[0].status_id;

    // Update proposal status
    const [result] = await pool.query(
      `UPDATE Proposal SET status_id = ? WHERE proposal_id = ?`,
      [statusId, proposalId]
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in updateProposalStatus:", error);
    throw error;
  }
};

/**
 * Get proposal by ID with detailed status information
 * @param {number} proposalId - The ID of the proposal
 * @returns {Promise<Object>} - Proposal details
 */
const getProposalWithStatus = async (proposalId) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.proposal_id, p.title, p.proposal_description, 
              p.type, p.specialization, p.outcome,
              p.submitted_by, p.submitted_to, p.project_id,
              ps.status_name,
              submitter.name AS submitter_name,
              CASE 
                WHEN p.submitted_to IS NOT NULL THEN reviewer.name
                ELSE NULL
              END AS reviewer_name,
              examiner.name AS examiner_name,
              ea.status AS examiner_assignment_status
       FROM Proposal p
       JOIN Proposal_Status ps ON p.status_id = ps.status_id
       JOIN User submitter ON p.submitted_by = submitter.user_id
       LEFT JOIN User reviewer ON p.submitted_to = reviewer.user_id
       LEFT JOIN Project proj ON p.project_id = proj.project_id
       LEFT JOIN Examiner_Assignment ea ON proj.project_id = ea.project_id
       LEFT JOIN User examiner ON ea.examiner_id = examiner.user_id
       WHERE p.proposal_id = ?`,
      [proposalId]
    );

    if (rows.length === 0) {
      return null;
    }

    // Get feedback for this proposal
    const [feedbackRows] = await pool.query(
      `SELECT f.feedback_id, f.comments, f.created_at, 
              u.name AS reviewer_name, u.user_id AS reviewer_id
       FROM Feedback f
       JOIN User u ON f.reviewer_id = u.user_id
       WHERE f.proposal_id = ?
       ORDER BY f.created_at DESC`,
      [proposalId]
    );

    const proposal = rows[0];
    proposal.feedback = feedbackRows;

    return proposal;
  } catch (error) {
    console.error("Error in getProposalWithStatus:", error);
    throw error;
  }
};

/**
 * Create project from approved proposal
 * @param {number} proposalId - The ID of the approved proposal
 * @returns {Promise<number>} - The ID of the created project
 */
const createProjectFromProposal = async (proposalId) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Get proposal details
    const [proposalRows] = await connection.query(
      `SELECT p.*, ps.status_name
       FROM Proposal p
       JOIN Proposal_Status ps ON p.status_id = ps.status_id
       WHERE p.proposal_id = ?`,
      [proposalId]
    );

    if (proposalRows.length === 0) {
      throw new Error("Proposal not found");
    }

    const proposal = proposalRows[0];

    // Check if proposal is already approved and has a project
    if (proposal.project_id) {
      return proposal.project_id;
    }

    // Create project
    const [projectResult] = await connection.query(
      `INSERT INTO Project (title, description)
       VALUES (?, ?)`,
      [proposal.title, proposal.proposal_description]
    );

    const projectId = projectResult.insertId;

    // Update proposal with project ID
    await connection.query(
      `UPDATE Proposal SET project_id = ? WHERE proposal_id = ?`,
      [projectId, proposalId]
    );

    // If submitted by a supervisor, link to Supervisor_Project
    const [userRoles] = await connection.query(
      `SELECT r.role_name
       FROM User_Roles ur
       JOIN Role r ON ur.role_id = r.role_id
       WHERE ur.user_id = ?`,
      [proposal.submitted_by]
    );

    const isSupervisor = userRoles.some(
      (role) => role.role_name === "Supervisor"
    );

    if (isSupervisor) {
      await connection.query(
        `INSERT INTO Supervisor_Project (supervisor_id, project_id)
         VALUES (?, ?)`,
        [proposal.submitted_by, projectId]
      );
    } else if (proposal.submitted_to) {
      // If submitted by a student and approved by a supervisor
      await connection.query(
        `INSERT INTO Supervisor_Project (supervisor_id, project_id)
         VALUES (?, ?)`,
        [proposal.submitted_to, projectId]
      );
    }

    await connection.commit();
    return projectId;
  } catch (error) {
    await connection.rollback();
    console.error("Error in createProjectFromProposal:", error);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Get proposals by student ID
 * @param {number} studentId - The ID of the student
 * @returns {Promise<Array>} - Array of proposals
 */
const getProposalsByStudent = async (studentId) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.proposal_id, p.title, p.proposal_description, 
              p.type, p.specialization, p.outcome,
              p.submitted_by, p.submitted_to, p.project_id,
              ps.status_name,
              CASE 
                WHEN p.submitted_to IS NOT NULL THEN reviewer.name
                ELSE NULL
              END AS reviewer_name
       FROM Proposal p
       JOIN Proposal_Status ps ON p.status_id = ps.status_id
       LEFT JOIN User reviewer ON p.submitted_to = reviewer.user_id
       WHERE p.submitted_by = ?
       ORDER BY p.proposal_id DESC`,
      [studentId]
    );

    // Get feedback for each proposal
    for (let i = 0; i < rows.length; i++) {
      const [feedbackRows] = await pool.query(
        `SELECT f.feedback_id, f.comments, f.created_at, 
                u.name AS reviewer_name, u.user_id AS reviewer_id
         FROM Feedback f
         JOIN User u ON f.reviewer_id = u.user_id
         WHERE f.proposal_id = ?
         ORDER BY f.created_at DESC`,
        [rows[i].proposal_id]
      );
      rows[i].feedback = feedbackRows;
    }

    return rows;
  } catch (error) {
    console.error("Error in getProposalsByStudent:", error);
    throw error;
  }
};

/**
 * Create a new proposal
 * @param {number} studentId - The ID of the student submitting the proposal
 * @param {string} title - The proposal title
 * @param {string} description - The proposal description
 * @param {string} type - The proposal type (Research, Application, Both)
 * @param {string} specialization - The proposal specialization
 * @param {string} outcome - The proposal outcome
 * @param {number} submitted_to - The ID of the supervisor to review the proposal
 * @returns {Promise<number>} - The ID of the created proposal
 */
const createProposal = async (
  studentId,
  title,
  description,
  type,
  specialization,
  outcome,
  submitted_to
) => {
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
      [
        studentId,
        submitted_to,
        title,
        description,
        type,
        specialization,
        outcome,
      ]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error in createProposal:", error);
    throw error;
  }
};

/**
 * Update a proposal
 * @param {number} proposalId - The ID of the proposal
 * @param {string} title - The proposal title
 * @param {string} description - The proposal description
 * @param {string} type - The proposal type
 * @param {string} specialization - The proposal specialization
 * @param {string} outcome - The proposal outcome
 * @returns {Promise<boolean>} - True if updated successfully
 */
const updateProposal = async (
  proposalId,
  title,
  description,
  type,
  specialization,
  outcome
) => {
  try {
    const [result] = await pool.query(
      `UPDATE Proposal SET 
        title = ?,
        proposal_description = ?,
        type = ?,
        specialization = ?,
        outcome = ?
       WHERE proposal_id = ?`,
      [title, description, type, specialization, outcome, proposalId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in updateProposal:", error);
    throw error;
  }
};

// Add these to the export
export default {
  // ... existing exports
  updateProposalStatus,
  getProposalWithStatus,
  createProjectFromProposal,
  createProposal,
  updateProposal,
  getProposalById: getProposalWithStatus, // Alias for backward compatibility
  getProposalsByStudent,
};
