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
  const [result] = await pool.execute(
    "UPDATE progress_logs SET feedback = ?, is_signed = ?, reviewer_id = ?, updated_at = NOW() WHERE id = ?",
    [feedback, is_signed, supervisorId, logId]
  );
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
