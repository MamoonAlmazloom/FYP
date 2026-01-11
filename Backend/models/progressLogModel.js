// progressLogModel.js - Progress log management model
import pool from "../db.js";

export const createLog = async (logData) => {
  const { studentId, projectId, title, content, type } = logData;
  const [result] = await pool.execute(
    "INSERT INTO progress_logs (student_id, project_id, title, content, type) VALUES (?, ?, ?, ?, ?)",
    [studentId, projectId, title, content, type]
  );
  return { id: result.insertId, ...logData };
};

export const findLogById = async (logId) => {
  const [rows] = await pool.execute(
    "SELECT * FROM progress_logs WHERE id = ?",
    [logId]
  );
  return rows[0] || null;
};

export const addFeedbackToLog = async (
  logId,
  supervisorId,
  feedback,
  is_signed
) => {
  // First check if feedback already exists
  const [existing] = await pool.execute(
    "SELECT feedback_id FROM Feedback WHERE log_id = ?",
    [logId]
  );

  let result;
  if (existing.length > 0) {
    // Update existing feedback
    [result] = await pool.execute(
      "UPDATE Feedback SET comments = ?, reviewer_id = ?, created_at = NOW() WHERE log_id = ?",
      [feedback, supervisorId, logId]
    );
  } else {
    // Insert new feedback
    [result] = await pool.execute(
      "INSERT INTO Feedback (log_id, reviewer_id, comments, created_at) VALUES (?, ?, ?, NOW())",
      [logId, supervisorId, feedback]
    );
  }
  return result.affectedRows > 0;
};

export const getLogsByStudentId = async (studentId) => {
  const [rows] = await pool.execute(
    "SELECT * FROM progress_logs WHERE student_id = ? ORDER BY created_at DESC",
    [studentId]
  );
  return rows;
};

export const getLogsByProjectId = async (projectId) => {
  const [rows] = await pool.execute(
    "SELECT * FROM progress_logs WHERE project_id = ? ORDER BY created_at DESC",
    [projectId]
  );
  return rows;
};

export const updateLogStatus = async (logId, status) => {
  const [result] = await pool.execute(
    "UPDATE progress_logs SET status = ?, updated_at = NOW() WHERE id = ?",
    [status, logId]
  );
  return result.affectedRows > 0;
};

export default {
  createLog,
  findLogById,
  addFeedbackToLog,
  getLogsByStudentId,
  getLogsByProjectId,
  updateLogStatus,
};
