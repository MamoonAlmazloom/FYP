// models/moderatorModel.js
import pool from "../db.js";

/**
 * Get moderator profile
 * @param {number} moderatorId - The ID of the moderator
 * @returns {Promise<Object>} - Moderator profile data
 */
const getModeratorProfile = async (moderatorId) => {
  try {
    const [rows] = await pool.query(
      `SELECT user_id, name, email, role
       FROM user 
       WHERE user_id = ? AND role = 'Moderator'`,
      [moderatorId]
    );

    if (rows.length === 0) {
      throw new Error("Moderator not found");
    }

    return rows[0];
  } catch (error) {
    console.error("Error in getModeratorProfile:", error);
    throw error;
  }
};

/**
 * Get pending proposals for moderation
 * @param {number} moderatorId - The ID of the moderator
 * @returns {Promise<Array>} - Array of pending proposals
 */
const getPendingProposals = async (moderatorId) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.proposal_id, p.title, p.description, p.objectives,
              p.methodology, p.expected_outcomes, p.timeline,
              p.created_at, p.updated_at,
              u.name as student_name, u.user_id as student_id,
              sv.name as supervisor_name, sp.supervisor_id,
              ps.status_name as status
       FROM proposal p
       JOIN user u ON p.submitted_by = u.user_id
       JOIN proposal_status ps ON p.status_id = ps.status_id
       LEFT JOIN supervisor_proposal svp ON p.proposal_id = svp.proposal_id
       LEFT JOIN user sv ON svp.supervisor_id = sv.user_id
       LEFT JOIN supervisor_project sp ON p.project_id = sp.project_id
       WHERE ps.status_name = 'Pending'
       ORDER BY p.created_at ASC`
    );

    return rows;
  } catch (error) {
    console.error("Error in getPendingProposals:", error);
    throw error;
  }
};

/**
 * Get proposal details by ID
 * @param {number} proposalId - The ID of the proposal
 * @returns {Promise<Object>} - Proposal details
 */
const getProposalDetails = async (proposalId) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.proposal_id, p.title, p.description, p.objectives,
              p.methodology, p.expected_outcomes, p.timeline,
              p.created_at, p.updated_at,
              u.name as student_name, u.user_id as student_id, u.email as student_email,
              sv.name as supervisor_name, sp.supervisor_id,
              ps.status_name as status
       FROM proposal p
       JOIN user u ON p.submitted_by = u.user_id
       JOIN proposal_status ps ON p.status_id = ps.status_id
       LEFT JOIN supervisor_proposal svp ON p.proposal_id = svp.proposal_id
       LEFT JOIN user sv ON svp.supervisor_id = sv.user_id
       LEFT JOIN supervisor_project sp ON p.project_id = sp.project_id
       WHERE p.proposal_id = ?`,
      [proposalId]
    );

    if (rows.length === 0) {
      throw new Error("Proposal not found");
    }

    return rows[0];
  } catch (error) {
    console.error("Error in getProposalDetails:", error);
    throw error;
  }
};

/**
 * Review proposal (approve or reject)
 * @param {number} moderatorId - The ID of the moderator
 * @param {number} proposalId - The ID of the proposal
 * @param {string} decision - 'Approved' or 'Rejected'
 * @param {string} feedback - Optional feedback
 * @returns {Promise<boolean>} - Success status
 */
const reviewProposal = async (
  moderatorId,
  proposalId,
  decision,
  feedback = ""
) => {
  try {
    // Start transaction
    await pool.query("START TRANSACTION");

    // Get the status ID for the decision
    const [statusRows] = await pool.query(
      `SELECT status_id FROM proposal_status WHERE status_name = ?`,
      [decision]
    );

    if (statusRows.length === 0) {
      throw new Error(`Invalid status: ${decision}`);
    }

    const statusId = statusRows[0].status_id;

    // Update proposal status
    const [updateResult] = await pool.query(
      `UPDATE proposal 
       SET status_id = ?, updated_at = NOW()
       WHERE proposal_id = ?`,
      [statusId, proposalId]
    );

    // Add feedback if provided
    if (feedback) {
      await pool.query(
        `INSERT INTO proposal_feedback (proposal_id, reviewer_id, reviewer_type, comments, created_at)
         VALUES (?, ?, 'Moderator', ?, NOW())`,
        [proposalId, moderatorId, feedback]
      );
    }

    // Commit transaction
    await pool.query("COMMIT");

    return updateResult.affectedRows > 0;
  } catch (error) {
    // Rollback on error
    await pool.query("ROLLBACK");
    console.error("Error in reviewProposal:", error);
    throw error;
  }
};

/**
 * Get all previous (completed) projects for moderator dashboard
 * @returns {Promise<Array>} - Array of previous projects
 */
const getPreviousProjects = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT p.project_id as id, p.title, p.proposal_description as description,
              u.name as student_name, p.proposal_id,
              supervisor.name as supervisor_name,
              examiner.name as examiner_name,
              ea.status as examination_status
       FROM proposal p
       JOIN user u ON p.submitted_by = u.user_id
       JOIN examiner_assignment ea ON p.project_id = ea.project_id
       LEFT JOIN user supervisor ON p.submitted_to = supervisor.user_id
       LEFT JOIN user examiner ON ea.examiner_id = examiner.user_id
       WHERE ea.status = 'Evaluated'
       ORDER BY p.project_id DESC`
    );
    return rows;
  } catch (error) {
    console.error("Error in getPreviousProjects:", error);
    throw error;
  }
};

export default {
  getModeratorProfile,
  getPendingProposals,
  getProposalDetails,
  reviewProposal,
  getPreviousProjects,
};
