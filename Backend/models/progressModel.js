// models/progressModel.js
const db = require("../db");

exports.getProgressLogs = async (studentId) => {
  const [rows] = await db.query(
    `SELECT pl.log_id, pr.title AS project_title, pl.submission_date
     FROM Progress_Log pl
     JOIN Project pr ON pl.project_id = pr.project_id
     WHERE pl.student_id = ?`,
    [studentId]
  );
  return rows;
};

exports.createProgressLog = async (studentId, projectId, date) => {
  const [result] = await db.query(
    `INSERT INTO Progress_Log (project_id, student_id, submission_date)
     VALUES (?, ?, ?)`,
    [projectId, studentId, date]
  );
  return result.insertId;
};
