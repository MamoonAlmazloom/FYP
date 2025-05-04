// models/projectModel.js
const db = require("../db");

exports.getApprovedProjects = async () => {
  const [rows] = await db.query(
    `SELECT pr.project_id, pr.title, pr.description
     FROM Project pr
     JOIN Proposal p ON pr.project_id = p.project_id
     JOIN Proposal_Status ps ON p.status_id = ps.status_id
     WHERE ps.status_name = 'Approved'`
  );
  return rows;
};

exports.selectProject = async (studentId, projectId) => {
  // Optionally record selection in a separate table or update Proposal
  // Here we just create a new Proposal in Approved state:
  const [result] = await db.query(
    `INSERT INTO Proposal (project_id, submitted_by, status_id)
     VALUES (?, ?, (SELECT status_id FROM Proposal_Status WHERE status_name='Approved'))`,
    [projectId, studentId]
  );
  return result.insertId;
};
