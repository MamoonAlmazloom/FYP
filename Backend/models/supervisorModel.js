// models/supervisorModel.js
import pool from "../db.js";

/**
 * Get students under supervision
 * @param {number} supervisorId - The ID of the supervisor
 * @param {boolean} activeOnly - Filter only active students
 * @returns {Promise<Array>} - Array of students
 */
const getStudentsBySupervisor = async (supervisorId, activeOnly) => {
  try {
    let query = `
      SELECT DISTINCT u.user_id, u.name, u.email
      FROM User u
      JOIN User_Roles ur ON u.user_id = ur.user_id
      JOIN Role r ON ur.role_id = r.role_id
      JOIN Proposal p ON u.user_id = p.submitted_by
      JOIN Supervisor_Project sp ON p.project_id = sp.project_id
      WHERE sp.supervisor_id = ? AND r.role_name = 'Student'
    `;

    if (activeOnly) {
      query += ` AND p.status_id = (SELECT status_id FROM Proposal_Status WHERE status_name = 'Approved')`;
    }

    const [rows] = await pool.query(query, [supervisorId]);
    return rows;
  } catch (error) {
    console.error("Error in getStudentsBySupervisor:", error);
    throw error;
  }
};

/**
 * Get proposals for a supervisor
 * @param {number} supervisorId - The ID of the supervisor
 * @returns {Promise<Array>} - Array of proposals
 */
const getProposalsBySupervisor = async (supervisorId) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.proposal_id, p.title, p.proposal_description, ps.status_name,
              u.name as student_name, u.user_id as student_id
       FROM Proposal p
       JOIN Proposal_Status ps ON p.status_id = ps.status_id
       JOIN User u ON p.submitted_by = u.user_id
       WHERE p.submitted_to = ?
       ORDER BY p.proposal_id DESC`,
      [supervisorId]
    );
    return rows;
  } catch (error) {
    console.error("Error in getProposalsBySupervisor:", error);
    throw error;
  }
};

/**
 * Provide feedback on a proposal
 * @param {number} proposalId - The ID of the proposal
 * @param {number} supervisorId - The ID of the supervisor
 * @param {string} comments - The feedback comments
 * @returns {Promise<number>} - The ID of the created feedback
 */
const provideFeedback = async (proposalId, supervisorId, comments) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO Feedback (proposal_id, reviewer_id, comments)
       VALUES (?, ?, ?)`,
      [proposalId, supervisorId, comments]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error in provideFeedback:", error);
    throw error;
  }
};

/**
 * Get student projects
 * @param {number} studentId - The ID of the student
 * @returns {Promise<Array>} - Array of projects
 */
const getStudentProjects = async (studentId) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.project_id, p.title, p.description,
              ps.status_name
       FROM Project p
       JOIN Proposal pr ON p.project_id = pr.project_id
       JOIN Proposal_Status ps ON pr.status_id = ps.status_id
       WHERE pr.submitted_by = ?`,
      [studentId]
    );
    return rows;
  } catch (error) {
    console.error("Error in getStudentProjects:", error);
    throw error;
  }
};

/**
 * Get student logs
 * @param {number} studentId - The ID of the student
 * @param {string} startDate - Optional start date for filtering (YYYY-MM-DD)
 * @param {string} endDate - Optional end date for filtering (YYYY-MM-DD)
 * @returns {Promise<Array>} - Array of logs
 */
const getStudentLogs = async (studentId, startDate, endDate) => {
  try {
    let query = `
      SELECT pl.log_id, pl.project_id, pl.submission_date, pl.details,
             p.title as project_title
      FROM Progress_Log pl
      JOIN Project p ON pl.project_id = p.project_id
      WHERE pl.student_id = ?
    `;

    const params = [studentId];

    if (startDate) {
      query += ` AND pl.submission_date >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND pl.submission_date <= ?`;
      params.push(endDate);
    }

    query += ` ORDER BY pl.submission_date DESC`;

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error("Error in getStudentLogs:", error);
    throw error;
  }
};

/**
 * Provide feedback on a log
 * @param {number} logId - The ID of the log
 * @param {number} supervisorId - The ID of the supervisor
 * @param {string} comments - The feedback comments
 * @returns {Promise<number>} - The ID of the created feedback
 */
const provideFeedbackOnLog = async (logId, supervisorId, comments) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO Feedback (log_id, reviewer_id, comments)
       VALUES (?, ?, ?)`,
      [logId, supervisorId, comments]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error in provideFeedbackOnLog:", error);
    throw error;
  }
};

/**
 * Get student reports
 * @param {number} studentId - The ID of the student
 * @param {string} startDate - Optional start date for filtering (YYYY-MM-DD)
 * @param {string} endDate - Optional end date for filtering (YYYY-MM-DD)
 * @returns {Promise<Array>} - Array of reports
 */
const getStudentReports = async (studentId, startDate, endDate) => {
  try {
    let query = `
      SELECT pr.report_id, pr.project_id, pr.submission_date, pr.title,
             pr.details, p.title as project_title
      FROM Progress_Report pr
      JOIN Project p ON pr.project_id = p.project_id
      WHERE pr.student_id = ?
    `;

    const params = [studentId];

    if (startDate) {
      query += ` AND pr.submission_date >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND pr.submission_date <= ?`;
      params.push(endDate);
    }

    query += ` ORDER BY pr.submission_date DESC`;

    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error("Error in getStudentReports:", error);
    throw error;
  }
};

/**
 * Provide feedback on a report
 * @param {number} reportId - The ID of the report
 * @param {number} supervisorId - The ID of the supervisor
 * @param {string} comments - The feedback comments
 * @returns {Promise<number>} - The ID of the created feedback
 */
const provideFeedbackOnReport = async (reportId, supervisorId, comments) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO Feedback (report_id, reviewer_id, comments)
       VALUES (?, ?, ?)`,
      [reportId, supervisorId, comments]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error in provideFeedbackOnReport:", error);
    throw error;
  }
};

/**
 * Get previous projects
 * @param {number} supervisorId - The ID of the supervisor
 * @returns {Promise<Array>} - Array of previous projects
 */
const getPreviousProjects = async (supervisorId) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.project_id, p.title, p.description,
              u.name as student_name, pr.proposal_id
       FROM Project p
       JOIN Supervisor_Project sp ON p.project_id = sp.project_id
       JOIN Proposal pr ON p.project_id = pr.project_id
       JOIN User u ON pr.submitted_by = u.user_id
       JOIN Proposal_Status ps ON pr.status_id = ps.status_id
       WHERE sp.supervisor_id = ? AND ps.status_name = 'Approved'
       ORDER BY p.project_id DESC`,
      [supervisorId]
    );
    return rows;
  } catch (error) {
    console.error("Error in getPreviousProjects:", error);
    throw error;
  }
};

/**
 * Get project by ID
 * @param {number} projectId - The ID of the project
 * @returns {Promise<Object>} - Project details
 */
const getProjectById = async (projectId) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.project_id, p.title, p.description,
              u.name as student_name, u.user_id as student_id,
              ps.status_name
       FROM Project p
       JOIN Proposal pr ON p.project_id = pr.project_id
       JOIN User u ON pr.submitted_by = u.user_id
       JOIN Proposal_Status ps ON pr.status_id = ps.status_id
       WHERE p.project_id = ?`,
      [projectId]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error in getProjectById:", error);
    throw error;
  }
};

/**
 * Create a new project
 * @param {number} supervisorId - The ID of the supervisor
 * @param {string} title - The project title
 * @param {string} description - The project description
 * @returns {Promise<number>} - The ID of the created project
 */
const createProject = async (supervisorId, title, description) => {
  try {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Create project
      const [projectResult] = await connection.query(
        `INSERT INTO Project (title, description)
         VALUES (?, ?)`,
        [title, description]
      );

      const projectId = projectResult.insertId;

      // Associate supervisor with project
      await connection.query(
        `INSERT INTO Supervisor_Project (supervisor_id, project_id)
         VALUES (?, ?)`,
        [supervisorId, projectId]
      );

      // Create proposal with Approved status
      const [statusResult] = await connection.query(
        `SELECT status_id FROM Proposal_Status WHERE status_name = 'Approved'`
      );

      const statusId = statusResult[0].status_id;

      await connection.query(
        `INSERT INTO Proposal (project_id, submitted_by, status_id, title, proposal_description)
         VALUES (?, ?, ?, ?, ?)`,
        [projectId, supervisorId, statusId, title, description]
      );

      await connection.commit();
      return projectId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error in createProject:", error);
    throw error;
  }
};

/**
 * Get supervisor's proposal
 * @param {number} supervisorId - The ID of the supervisor
 * @param {number} proposalId - The ID of the proposal
 * @returns {Promise<Object>} - Proposal details
 */
const getSupervisorProposal = async (supervisorId, proposalId) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         p.proposal_id,
         p.project_id,
         p.submitted_by,
         p.submitted_to,
         p.title,
         p.proposal_description,
         p.type,
         p.specialization,
         p.outcome,
         ps.status_name,
         u.name as submitted_by_name
       FROM Proposal p
       JOIN Proposal_Status ps ON p.status_id = ps.status_id
       LEFT JOIN User u ON p.submitted_by = u.user_id
       LEFT JOIN Supervisor_Project sp ON p.project_id = sp.project_id
       WHERE p.proposal_id = ?
         AND (
           p.submitted_by = ? -- proposals submitted by this supervisor
           OR (p.project_id IS NOT NULL AND sp.supervisor_id = ?) -- proposals for projects this supervisor supervises
         )`,
      [proposalId, supervisorId, supervisorId]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error in getSupervisorProposal:", error);
    throw error;
  }
};

/**
 * Create a new proposal
 * @param {number} supervisorId - The ID of the supervisor
 * @param {string} title - The proposal title
 * @param {string} description - The proposal description
 * @param {string} type - The proposal type
 * @param {string} specialization - The proposal specialization
 * @param {string} outcome - The proposal outcome
 * @returns {Promise<number>} - The ID of the created proposal
 */
const createProposal = async (supervisorId, title, description, type, specialization, outcome) => {
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
        NULL,
        (SELECT status_id FROM Proposal_Status WHERE status_name='Pending'),
        ?,
        ?,
        ?,
        ?,
        ?
      )`,
      [supervisorId, title, description, type, specialization, outcome]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error in createProposal:", error);
    throw error;
  }
};

const approveProposal = async (proposalId, supervisorId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Get proposal details
    const [proposalRows] = await connection.query(
      `SELECT title, proposal_description FROM Proposal WHERE proposal_id = ?`,
      [proposalId]
    );
    if (proposalRows.length === 0) throw new Error("Proposal not found");
    const { title, proposal_description } = proposalRows[0];

    // Create project
    const [projectResult] = await connection.query(
      `INSERT INTO Project (title, description) VALUES (?, ?)`,
      [title, proposal_description]
    );
    const projectId = projectResult.insertId;

    // Update proposal
    await connection.query(
      `UPDATE Proposal SET project_id = ?, status_id = (SELECT status_id FROM Proposal_Status WHERE status_name='Approved') WHERE proposal_id = ?`,
      [projectId, proposalId]
    );

    // Link supervisor to project
    await connection.query(
      `INSERT INTO Supervisor_Project (supervisor_id, project_id) VALUES (?, ?)`,
      [supervisorId, projectId]
    );

    await connection.commit();
    return projectId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export default {
  getStudentsBySupervisor,
  getProposalsBySupervisor,
  provideFeedback,
  getStudentProjects,
  getStudentLogs,
  provideFeedbackOnLog,
  getStudentReports,
  provideFeedbackOnReport,
  getPreviousProjects,
  getProjectById,
  createProject,
  getSupervisorProposal,
  createProposal,
  approveProposal,
};
