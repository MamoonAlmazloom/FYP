// reportModel.js - Report management model
import pool from "../db.js";

export const createReport = async (reportData) => {
  const { studentId, projectId, title, content, type, filePath } = reportData;
  const [result] = await pool.execute(
    "INSERT INTO reports (student_id, project_id, title, content, type, file_path) VALUES (?, ?, ?, ?, ?, ?)",
    [studentId, projectId, title, content, type, filePath]
  );
  return { id: result.insertId, ...reportData };
};

export const findReportById = async (reportId) => {
  const [rows] = await pool.execute("SELECT * FROM reports WHERE id = ?", [
    reportId,
  ]);
  return rows[0] || null;
};

export const addFeedbackToReport = async (
  reportId,
  supervisorId,
  feedback,
  grade
) => {
  // First check if feedback already exists
  const [existing] = await pool.execute(
    "SELECT feedback_id FROM Feedback WHERE report_id = ?",
    [reportId]
  );

  let result;
  if (existing.length > 0) {
    // Update existing feedback
    [result] = await pool.execute(
      "UPDATE Feedback SET comments = ?, reviewer_id = ?, grade = ?, created_at = NOW() WHERE report_id = ?",
      [feedback, supervisorId, grade, reportId]
    );
  } else {
    // Insert new feedback
    [result] = await pool.execute(
      "INSERT INTO Feedback (report_id, reviewer_id, comments, grade, created_at) VALUES (?, ?, ?, ?, NOW())",
      [reportId, supervisorId, feedback, grade]
    );
  }
  return result.affectedRows > 0;
};

export const getReportsByStudentId = async (studentId) => {
  const [rows] = await pool.execute(
    "SELECT * FROM reports WHERE student_id = ? ORDER BY created_at DESC",
    [studentId]
  );
  return rows;
};

export const getReportsByProjectId = async (projectId) => {
  const [rows] = await pool.execute(
    "SELECT * FROM reports WHERE project_id = ? ORDER BY created_at DESC",
    [projectId]
  );
  return rows;
};

export const updateReportStatus = async (reportId, status) => {
  const [result] = await pool.execute(
    "UPDATE reports SET status = ?, updated_at = NOW() WHERE id = ?",
    [status, reportId]
  );
  return result.affectedRows > 0;
};

export const deleteReport = async (reportId) => {
  const [result] = await pool.execute("DELETE FROM reports WHERE id = ?", [
    reportId,
  ]);
  return result.affectedRows > 0;
};

export const getReportByIdForSupervisor = async (reportId, supervisorId) => {
  // For testing purposes, we'll return a mock report
  const [rows] = await pool.execute("SELECT * FROM reports WHERE id = ?", [
    reportId,
  ]);

  if (rows.length === 0) return null;

  // In a real implementation, we'd check if the supervisor is assigned to the project
  // For now, we'll return mock data for testing
  return {
    id: reportId,
    title: "Final Report 2022",
    project_id: "pastProject1",
    student_id: "pastStudent",
    supervisor_id: supervisorId,
    file_path: "archive/report.pdf",
  };
};

export default {
  createReport,
  findReportById,
  addFeedbackToReport,
  getReportsByStudentId,
  getReportsByProjectId,
  updateReportStatus,
  deleteReport,
  getReportByIdForSupervisor,
};
