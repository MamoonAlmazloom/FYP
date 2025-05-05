// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "fyp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connection established successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error connecting to database:', err);
  });   

export default pool;
