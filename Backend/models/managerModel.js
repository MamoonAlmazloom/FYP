// models/managerModel.js
import pool from "../db.js";

/**
 * Get all users with their roles
 * @returns {Promise<Array>} - Array of users with roles
 */
const getAllUsers = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        u.user_id,
        u.name,
        u.email,
        IFNULL(u.is_active, 1) as is_active,
        GROUP_CONCAT(r.role_name) AS roles,
        GROUP_CONCAT(r.role_id) AS role_ids
       FROM user u
       LEFT JOIN user_roles ur ON u.user_id = ur.user_id
       LEFT JOIN role r ON ur.role_id = r.role_id
       GROUP BY u.user_id, u.name, u.email, u.is_active
       ORDER BY u.name`
    );

    const processedUsers = rows.map((row) => ({
      user_id: row.user_id,
      name: row.name,
      email: row.email,
      is_active: Boolean(row.is_active),
      roles: row.roles ? row.roles.split(",") : [],
      role_ids: row.role_ids ? row.role_ids.split(",").map(Number) : [],
    }));

    return processedUsers;
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw error;
  }
};

/**
 * Update user eligibility (active/inactive)
 * @param {number} userId - The ID of the user
 * @param {boolean} status - The new status
 * @returns {Promise<boolean>} - True if updated successfully
 */
const updateUserEligibility = async (userId, status) => {
  try {
    const [result] = await pool.query(
      `UPDATE user SET is_active = ? WHERE user_id = ?`,
      [status, userId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in updateUserEligibility:", error);
    throw error;
  }
};

/**
 * Get all approved projects with examiner assignment information
 * @returns {Promise<Array>} - Array of approved projects
 */
const getApprovedProjects = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT p.project_id, p.title, p.description, 
              u.name as student_name, u.user_id as student_id,
              pr.proposal_id,              (SELECT name FROM user WHERE user_id = (
                  SELECT supervisor_id FROM supervisor_project
                  WHERE project_id = p.project_id
                  LIMIT 1
              )) as supervisor_name,
              ea.examiner_id,
              ex.name as examiner_name,
              ea.status as assignment_status,
              CASE 
                WHEN ea.examiner_id IS NOT NULL THEN 'Assigned'
                ELSE 'Unassigned'
              END as current_status
       FROM project p
       JOIN proposal pr ON p.project_id = pr.project_id
       JOIN user u ON pr.submitted_by = u.user_id
       JOIN proposal_status ps ON pr.status_id = ps.status_id
       LEFT JOIN examiner_assignment ea ON p.project_id = ea.project_id
       LEFT JOIN user ex ON ea.examiner_id = ex.user_id
       WHERE ps.status_name = 'Approved'
       ORDER BY p.project_id DESC`
    );

    return rows;
  } catch (error) {
    console.error("Error in getApprovedProjects:", error);
    throw error;
  }
};

/**
 * Get all examiners
 * @returns {Promise<Array>} - Array of examiners
 */
const getExaminers = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.email
       FROM user u
       JOIN user_roles ur ON u.user_id = ur.user_id
       JOIN role r ON ur.role_id = r.role_id
       WHERE r.role_name = 'Examiner'
       ORDER BY u.name`
    );

    return rows;
  } catch (error) {
    console.error("Error in getExaminers:", error);
    throw error;
  }
};

/**
 * Assign examiner to project, but only if the project has an approved proposal
 * @param {number} projectId - The ID of the project
 * @param {number} examinerId - The ID of the examiner
 * @returns {Promise<number>} - The ID of the created assignment or existing assignment ID
 */
const assignExaminer = async (projectId, examinerId) => {
  try {
    // First check if this project has an approved proposal and get project details
    const [approved] = await pool.query(
      `SELECT p.project_id, p.title, pr.submitted_by as student_id, 
              u1.name as student_name, u2.name as examiner_name
       FROM project p
       JOIN proposal pr ON p.project_id = pr.project_id
       JOIN proposal_status ps ON pr.status_id = ps.status_id
       JOIN user u1 ON pr.submitted_by = u1.user_id
       JOIN user u2 ON u2.user_id = ?
       WHERE p.project_id = ? AND ps.status_name = 'Approved'`,
      [examinerId, projectId]
    );

    if (approved.length === 0) {
      throw new Error(
        "Only projects with approved proposals can be assigned to examiners"
      );
    }

    const projectData = approved[0]; // Check if project is already assigned to this examiner
    const [existing] = await pool.query(
      `SELECT assignment_id FROM examiner_assignment 
       WHERE project_id = ? AND examiner_id = ?`,
      [projectId, examinerId]
    );

    if (existing.length > 0) {
      return existing[0].assignment_id; // Return existing assignment ID
    }

    // Start transaction for multiple operations
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      // 1. Assign the project to the examiner with status 'Assigned'
      const [result] = await connection.query(
        `INSERT INTO examiner_assignment (project_id, examiner_id, status)
         VALUES (?, ?, 'Assigned')`,
        [projectId, examinerId]
      );

      const assignmentId = result.insertId; // 2. Create notifications for student and examiner
      // First ensure Event_Type exists
      await connection.query(
        `INSERT IGNORE INTO event_type (event_name) VALUES ('Examiner Assignment')`
      );

      // Get event type ID
      const [eventType] = await connection.query(
        `SELECT event_type_id FROM event_type WHERE event_name = 'Examiner Assignment'`
      );
      const eventTypeId = eventType[0].event_type_id;

      // Send notification to student
      const studentMessage = `Your project "${projectData.title}" has been assigned to examiner ${projectData.examiner_name} for evaluation.`;
      await connection.query(
        `INSERT INTO notification (user_id, event_type_id, message, timestamp, is_read)
         VALUES (?, ?, ?, NOW(), 0)`,
        [projectData.student_id, eventTypeId, studentMessage]
      );

      // Send notification to examiner
      const examinerMessage = `You have been assigned to evaluate the project "${projectData.title}" by student ${projectData.student_name}.`;
      await connection.query(
        `INSERT INTO notification (user_id, event_type_id, message, timestamp, is_read)
         VALUES (?, ?, ?, NOW(), 0)`,
        [examinerId, eventTypeId, examinerMessage]
      );

      await connection.commit();
      connection.release();

      return assignmentId;
    } catch (transactionError) {
      await connection.rollback();
      connection.release();
      throw transactionError;
    }
  } catch (error) {
    console.error("Error in assignExaminer:", error);
    throw error;
  }
};

/**
 * Get student logs
 * @param {number} studentId - The ID of the student
 * @returns {Promise<Array>} - Array of student logs
 */
const getStudentLogs = async (studentId) => {
  try {
    const [rows] = await pool.query(
      `SELECT pl.log_id, pl.project_id, pl.submission_date, pl.details,
              p.title as project_title
       FROM progress_log pl
       JOIN project p ON pl.project_id = p.project_id
       WHERE pl.student_id = ?
       ORDER BY pl.submission_date DESC`,
      [studentId]
    );

    return rows;
  } catch (error) {
    console.error("Error in getStudentLogs:", error);
    throw error;
  }
};

/**
 * Get all roles
 * @returns {Promise<Array>} - Array of roles
 */
const getAllRoles = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT role_id, role_name FROM role ORDER BY role_name`
    );
    return rows;
  } catch (error) {
    console.error("Error in getAllRoles:", error);
    throw error;
  }
};

/**
 * Remove duplicate examiner assignments
 * @returns {Promise<number>} - Number of rows deleted
 */
const removeDuplicateAssignments = async () => {
  try {
    // Find the lowest assignment_id for each project-examiner pair
    const [assignments] = await pool.query(`
      SELECT MIN(assignment_id) AS keep_id, project_id, examiner_id
      FROM examiner_assignment
      GROUP BY project_id, examiner_id
    `);

    let deleteCount = 0;

    // Delete all assignments except the ones to keep
    for (const assign of assignments) {
      const [result] = await pool.query(
        `
        DELETE FROM examiner_assignment 
        WHERE project_id = ? 
        AND examiner_id = ?
        AND assignment_id != ?
      `,
        [assign.project_id, assign.examiner_id, assign.keep_id]
      );

      deleteCount += result.affectedRows;
    }

    console.log(`Removed ${deleteCount} duplicate examiner assignments`);
    return deleteCount;
  } catch (error) {
    console.error("Error in removeDuplicateAssignments:", error);
    throw error;
  }
};

/**
 * Get all previous (evaluated) projects for manager dashboard
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

/**
 * Delete a user and all associated data
 * @param {number} userId - The ID of the user to delete
 * @returns {Promise<boolean>} - True if deleted successfully
 */
const deleteUser = async (userId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    console.log(`Starting deletion process for user ID: ${userId}`);

    // Delete in the correct order to avoid foreign key constraint violations

    // 1. Delete user roles first (foreign key constraint)
    console.log("Deleting user_roles...");
    const [userRolesResult] = await connection.query(
      `DELETE FROM user_roles WHERE user_id = ?`,
      [userId]
    );
    console.log(`Deleted ${userRolesResult.affectedRows} user_roles records`);

    // 2. Delete user notifications
    console.log("Deleting notifications...");
    const [notificationResult] = await connection.query(
      `DELETE FROM notification WHERE user_id = ?`,
      [userId]
    );
    console.log(
      `Deleted ${notificationResult.affectedRows} notification records`
    );

    // 3. Delete examiner assignments where user is examiner
    console.log("Deleting examiner_assignment...");
    const [examinerResult] = await connection.query(
      `DELETE FROM examiner_assignment WHERE examiner_id = ?`,
      [userId]
    );
    console.log(
      `Deleted ${examinerResult.affectedRows} examiner_assignment records`
    ); // 4. Delete feedback given by this user as reviewer
    console.log("Deleting feedback by user as reviewer...");
    const [feedbackByUserResult] = await connection.query(
      `DELETE FROM feedback WHERE reviewer_id = ?`,
      [userId]
    );
    console.log(
      `Deleted ${feedbackByUserResult.affectedRows} feedback records where user was reviewer`
    );

    // 4b. Delete feedback on proposals submitted by this user (before deleting proposals)
    console.log("Deleting feedback on proposals by this user...");
    const [feedbackOnProposalsResult] = await connection.query(
      `DELETE FROM feedback WHERE proposal_id IN (SELECT proposal_id FROM proposal WHERE submitted_by = ?)`,
      [userId]
    );
    console.log(
      `Deleted ${feedbackOnProposalsResult.affectedRows} feedback records on user's proposals`
    );

    // 5. Delete progress logs submitted by this user (if student)
    console.log("Deleting progress_log...");
    const [progressLogResult] = await connection.query(
      `DELETE FROM progress_log WHERE student_id = ?`,
      [userId]
    );
    console.log(
      `Deleted ${progressLogResult.affectedRows} progress_log records`
    );

    // 6. Delete progress reports submitted by this user (if student)
    console.log("Deleting progress_report...");
    const [progressReportResult] = await connection.query(
      `DELETE FROM progress_report WHERE student_id = ?`,
      [userId]
    );
    console.log(
      `Deleted ${progressReportResult.affectedRows} progress_report records`
    ); // 7. Handle proposals - delete proposals submitted by this user, update proposals submitted to this user
    console.log("Handling proposals...");
    // Delete proposals where this user was the submitter (since submitted_by cannot be NULL)
    const [proposalDeleteResult] = await connection.query(
      `DELETE FROM proposal WHERE submitted_by = ?`,
      [userId]
    );
    console.log(
      `Deleted ${proposalDeleteResult.affectedRows} proposal records where user was submitter`
    );
    // Update proposals where this user was the target (submitted_to can be NULL)
    const [proposalToResult] = await connection.query(
      `UPDATE proposal SET submitted_to = NULL WHERE submitted_to = ?`,
      [userId]
    );
    console.log(
      `Updated ${proposalToResult.affectedRows} proposal.submitted_to records`
    );

    // 8. Delete supervisor-project relationships
    console.log("Deleting supervisor_project...");
    const [supervisorProjectResult] = await connection.query(
      `DELETE FROM supervisor_project WHERE supervisor_id = ?`,
      [userId]
    );
    console.log(
      `Deleted ${supervisorProjectResult.affectedRows} supervisor_project records`
    );

    // 9. Finally delete the user
    console.log("Deleting user...");
    const [result] = await connection.query(
      `DELETE FROM user WHERE user_id = ?`,
      [userId]
    );
    console.log(`Deleted ${result.affectedRows} user records`);

    await connection.commit();
    console.log(`Successfully deleted user ${userId}`);
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error("Error in deleteUser:", error);
    console.error("Error code:", error.code);
    console.error("Error sqlState:", error.sqlState);
    console.error("Error sqlMessage:", error.sqlMessage);
    throw error;
  } finally {
    connection.release();
  }
};

export default {
  getAllUsers,
  updateUserEligibility,
  getApprovedProjects,
  getExaminers,
  assignExaminer,
  getStudentLogs,
  getAllRoles,
  removeDuplicateAssignments,
  getPreviousProjects,
  deleteUser,
};
