import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost", // or your MySQL host
  user: "root", // your MySQL user
  password: "root",
  database: "fyp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
