// models/projectModel.js
import pool from "../db.js";

/**
 * Get all approved projects
 * @returns {Promise<Array>} - Array of approved projects
 */
const getApprovedProjects = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT pr.project_id, pr.title, pr.description
       FROM Project pr
       JOIN Proposal p ON pr.project_id = p.project_id
       JOIN Proposal_Status ps ON p.status_id = ps.status_id
       WHERE ps.status_name = 'Approved'`
    );
    return rows;
  } catch (error) {
    console.error("Error in getApprovedProjects:", error);
    throw error;
  }
};

/**
 * Select an approved project
 * @param {number} studentId - The ID of the student
 * @param {number} projectId - The ID of the project to select
 * @returns {Promise<number>} - The ID of the created proposal
 */
const selectProject = async (studentId, projectId) => {
  try {
    // First check if the project exists
    const [projectExists] = await pool.query(
      `SELECT project_id FROM Project WHERE project_id = ?`,
      [projectId]
    );

    if (projectExists.length === 0) {
      throw new Error("Project not found");
    }

    // Create a proposal with Approved status
    const [result] = await pool.query(
      `INSERT INTO Proposal (project_id, submitted_by, status_id)
       VALUES (?, ?, (SELECT status_id FROM Proposal_Status WHERE status_name='Approved'))`,
      [projectId, studentId]
    );

    return result.insertId;
  } catch (error) {
    console.error("Error in selectProject:", error);
    throw error;
  }
};

/**
 * Get project details
 * @param {number} projectId - The ID of the project
 * @returns {Promise<Object>} - Project details
 */
const getProjectById = async (projectId) => {
  try {
    const [rows] = await pool.query(
      `SELECT project_id, title, description
       FROM Project
       WHERE project_id = ?`,
      [projectId]
    );

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error in getProjectById:", error);
    throw error;
  }
};

export default {
  getApprovedProjects,
  selectProject,
  getProjectById,
};
