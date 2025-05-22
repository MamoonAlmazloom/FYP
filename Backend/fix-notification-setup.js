// Fixed script to execute the SQL setup for notifications
import pool from "./db.js";

async function executeSqlSetup() {
  try {
    console.log("Starting notification setup...");

    // Check if Event_Type table exists and create if not
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Event_Type (
          event_type_id INT PRIMARY KEY AUTO_INCREMENT,
          event_name VARCHAR(255) NOT NULL
      )
    `);
    console.log("Event_Type table verified");

    // Check if Notification table exists
    const [notificationTables] = await pool.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'Notification'
    `);

    if (notificationTables.length > 0) {
      // Check if is_read column exists
      const [columns] = await pool.query(`
        SELECT COLUMN_NAME 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'Notification' 
        AND COLUMN_NAME = 'is_read'
      `);

      if (columns.length === 0) {
        // Add is_read column if it doesn't exist
        await pool.query(`
          ALTER TABLE Notification 
          ADD COLUMN is_read TINYINT(1) NOT NULL DEFAULT 0
        `);
        console.log("Added is_read column to Notification table");
      } else {
        console.log("is_read column already exists");
      }
    } else {
      // Create Notification table if it doesn't exist
      await pool.query(`
        CREATE TABLE Notification (
            notification_id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT,
            event_type_id INT,
            message TEXT,
            timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            is_read TINYINT(1) NOT NULL DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES User(user_id),
            FOREIGN KEY (event_type_id) REFERENCES Event_Type(event_type_id)
        )
      `);
      console.log("Created Notification table");
    }

    // Create initial event types if they don't exist
    await pool.query(`
      INSERT IGNORE INTO Event_Type (event_name) VALUES
      ('proposal_submitted'),
      ('proposal_approved'),
      ('proposal_rejected'),
      ('proposal_needs_modification'),
      ('proposal_modified'),
      ('feedback_received'),
      ('upcoming_deadline'),
      ('log_submitted'),
      ('report_submitted'),
      ('examiner_assigned'),
      ('grade_submitted')
    `);
    console.log("Event types created");

    console.log("Notification setup completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error setting up notifications:", error);
    process.exit(1);
  }
}

executeSqlSetup();
