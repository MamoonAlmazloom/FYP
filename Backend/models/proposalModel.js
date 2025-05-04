// models/proposalModel.js
const db = require("../db");

const getProposalsByStudent = async (studentId) => {
  const [rows] = await db.query(
    `SELECT p.proposal_id, pr.title, ps.status_name 
     FROM Proposal p
     JOIN Project pr ON p.project_id = pr.project_id
     JOIN Proposal_Status ps ON p.status_id = ps.status_id
     WHERE p.submitted_by = ?`,
    [studentId]
  );
  return rows;
};

const createProposal = async (studentId, projectId) => {
  const [result] = await db.query(
    `INSERT INTO Proposal (project_id, submitted_by, status_id)
     VALUES (?, ?, (SELECT status_id FROM Proposal_Status WHERE status_name='Pending'))`,
    [projectId, studentId]
  );
  return result.insertId;
};

const updateProposal = async (proposalId, projectId) => {
  const [result] = await db.query(
    `UPDATE Proposal
     SET project_id = ?, status_id = (SELECT status_id FROM Proposal_Status WHERE status_name='Pending')
     WHERE proposal_id = ?`,
    [projectId, proposalId]
  );
  return result.affectedRows;
};

export default {
  getProposalsByStudent,
  createProposal,
  updateProposal,
}
