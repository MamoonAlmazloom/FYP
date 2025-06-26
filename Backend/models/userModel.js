// userModel.js - User management model
import pool from "../db.js";

export const findUserById = async (userId) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [
    userId,
  ]);
  return rows[0] || null;
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0] || null;
};

export const createUser = async (userData) => {
  const { name, email, password, role } = userData;
  const [result] = await pool.execute(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role]
  );
  return { id: result.insertId, ...userData };
};

export const updateUserEligibility = async (userId, eligibilityData) => {
  const [result] = await pool.execute(
    "UPDATE users SET eligible = ?, updated_at = NOW() WHERE id = ?",
    [eligibilityData.eligible, userId]
  );
  return result.affectedRows > 0;
};

export const updateUserPassword = async (userId, hashedPassword) => {
  const [result] = await pool.execute(
    "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
    [hashedPassword, userId]
  );
  return result.affectedRows > 0;
};

export default {
  findUserById,
  findUserByEmail,
  createUser,
  updateUserEligibility,
  updateUserPassword,
};
