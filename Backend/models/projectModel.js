// projectModel.js - Project management model
import pool from "../db.js";

export const createProject = async (projectData) => {
  const { title, description, supervisorId, requirements } = projectData;
  const [result] = await pool.execute(
    "INSERT INTO projects (title, description, supervisor_id, requirements) VALUES (?, ?, ?, ?)",
    [title, description, supervisorId, requirements]
  );
  return { id: result.insertId, ...projectData };
};

export const findProjectById = async (projectId) => {
  const [rows] = await pool.execute("SELECT * FROM projects WHERE id = ?", [
    projectId,
  ]);
  return rows[0] || null;
};

export const getAvailableProjects = async () => {
  const [rows] = await pool.execute(
    'SELECT * FROM projects WHERE status = "available"'
  );
  return rows;
};

export const assignProjectToStudent = async (projectId, studentId) => {
  const [result] = await pool.execute(
    'UPDATE projects SET student_id = ?, status = "assigned", updated_at = NOW() WHERE id = ?',
    [studentId, projectId]
  );
  return result.affectedRows > 0;
};

export const getProjectsByStatus = async (status) => {
  const [rows] = await pool.execute("SELECT * FROM projects WHERE status = ?", [
    status,
  ]);
  return rows;
};

export const updateProjectStatus = async (projectId, status) => {
  const [result] = await pool.execute(
    "UPDATE projects SET status = ?, updated_at = NOW() WHERE id = ?",
    [status, projectId]
  );
  return result.affectedRows > 0;
};

export const getProjectsByStudent = async (studentId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM projects WHERE student_id = ? AND status IN ("assigned", "active", "in_progress")',
    [studentId]
  );
  return rows;
};

export const getAllProjects = async () => {
  const [rows] = await pool.execute("SELECT * FROM projects");
  return rows;
};

export const getProjectsBySupervisor = async (criteria) => {
  const { supervisor_id, status } = criteria;
  if (status) {
    const [rows] = await pool.execute(
      "SELECT * FROM projects WHERE supervisor_id = ? AND status = ?",
      [supervisor_id, status]
    );
    return rows;
  } else {
    const [rows] = await pool.execute(
      "SELECT * FROM projects WHERE supervisor_id = ?",
      [supervisor_id]
    );
    return rows;
  }
};

export const assignExaminerToProject = async (projectId, examinerId) => {
  const [result] = await pool.execute(
    "UPDATE projects SET examiner_id = ?, updated_at = NOW() WHERE id = ?",
    [examinerId, projectId]
  );
  return result.affectedRows > 0;
};

export const assignModeratorToProject = async (projectId, moderatorId) => {
  const [result] = await pool.execute(
    "UPDATE projects SET moderator_id = ?, updated_at = NOW() WHERE id = ?",
    [moderatorId, projectId]
  );
  return result.affectedRows > 0;
};

export default {
  createProject,
  findProjectById,
  getAvailableProjects,
  assignProjectToStudent,
  getProjectsByStatus,
  updateProjectStatus,
  getProjectsByStudent,
  getAllProjects,
  getProjectsBySupervisor,
  assignExaminerToProject,
  assignModeratorToProject,
};
