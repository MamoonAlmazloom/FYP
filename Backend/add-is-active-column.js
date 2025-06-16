// add-is-active-column.js
import pool from "./db.js";

async function addIsActiveColumn() {
  try {
    console.log("Adding is_active column to User table...");
    await pool.query(
      "ALTER TABLE User ADD COLUMN is_active BOOLEAN DEFAULT TRUE"
    );
    console.log("✅ is_active column added successfully");

    // Update all existing users to be active by default
    const [result] = await pool.query(
      "UPDATE User SET is_active = TRUE WHERE is_active IS NULL"
    );
    console.log(`✅ Updated ${result.affectedRows} users to active status`);
  } catch (error) {
    if (error.code === "ER_DUP_FIELDNAME") {
      console.log("⚠️  is_active column already exists");
    } else {
      console.error("❌ Error adding column:", error);
    }
  } finally {
    process.exit(0);
  }
}

addIsActiveColumn();
