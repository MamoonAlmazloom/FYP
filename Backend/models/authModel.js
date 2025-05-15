// models/authModel.js
import pool from "../db.js";
import bcrypt from "bcrypt";

/**
 * Find a user by their email
 * @param {string} email - User's email
 * @returns {Promise<Object|null>} - User data or null if not found
 */
const findUserByEmail = async (email) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.email, u.password
       FROM User u
       WHERE u.email = ?`,
      [email]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0];
  } catch (error) {
    console.error("Error in findUserByEmail:", error);
    throw error;
  }
};

/**
 * Get user roles
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of role names
 */
const getUserRoles = async (userId) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.role_name
       FROM User_Roles ur
       JOIN Role r ON ur.role_id = r.role_id
       WHERE ur.user_id = ?`,
      [userId]
    );
    
    return rows.map(row => row.role_name);
  } catch (error) {
    console.error("Error in getUserRoles:", error);
    throw error;
  }
};

/**
 * Create a new user
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} password - User's password (will be hashed)
 * @param {Array} roles - Array of role names
 * @returns {Promise<number>} - ID of the created user
 */
const createUser = async (name, email, password, roles) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const [userResult] = await connection.query(
      `INSERT INTO User (name, email, password)
       VALUES (?, ?, ?)`,
      [name, email, hashedPassword]
    );
    
    const userId = userResult.insertId;
    
    // Assign roles
    for (const roleName of roles) {
      const [roleResult] = await connection.query(
        `SELECT role_id FROM Role WHERE role_name = ?`,
        [roleName]
      );
      
      if (roleResult.length === 0) {
        throw new Error(`Role '${roleName}' not found`);
      }
      
      const roleId = roleResult[0].role_id;
      
      await connection.query(
        `INSERT INTO User_Roles (user_id, role_id)
         VALUES (?, ?)`,
        [userId, roleId]
      );
    }
    
    await connection.commit();
    return userId;
  } catch (error) {
    await connection.rollback();
    console.error("Error in createUser:", error);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Initialize admin user if it doesn't exist
 */
const initializeAdmin = async () => {
  try {
    // Check if admin exists
    const admin = await findUserByEmail("admin@gmail.com");
    
    if (admin) {
      console.log("Admin user already exists");
      return;
    }
    
    // Check if Manager role exists
    const [managerRoleResult] = await pool.query(
      `SELECT role_id FROM Role WHERE role_name = 'Manager'`
    );
    
    if (managerRoleResult.length === 0) {
      // Create the Manager role
      await pool.query(
        `INSERT INTO Role (role_name) VALUES ('Manager')`
      );
      console.log("Created Manager role");
    }
    
    // Create admin user
    const userId = await createUser(
      "Admin",
      "admin@gmail.com",
      "admin", // This will be hashed in the createUser function
      ["Manager"]
    );
    
    console.log(`Created admin user with ID: ${userId}`);
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
};

export default {
  findUserByEmail,
  getUserRoles,
  createUser,
  initializeAdmin,
};