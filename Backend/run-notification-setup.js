// This is a temporary script to execute the SQL setup for notifications
import fs from "fs";
import pool from "./db.js";

async function executeSqlFile() {
  try {
    console.log("Reading SQL file...");
    const sqlContent = fs.readFileSync("./notifications-setup.sql", "utf8");

    // Split the SQL commands by semicolon
    const sqlCommands = sqlContent
      .split(";")
      .map((command) => command.trim())
      .filter((command) => command.length > 0);

    console.log(`Found ${sqlCommands.length} SQL commands to execute`);

    for (let i = 0; i < sqlCommands.length; i++) {
      const command = sqlCommands[i];
      console.log(`Executing command ${i + 1}/${sqlCommands.length}`);
      console.log(command);

      try {
        await pool.query(command);
        console.log("Command executed successfully");
      } catch (error) {
        console.error(`Error executing command: ${error.message}`);
      }
    }

    console.log("SQL setup completed");
    process.exit(0);
  } catch (error) {
    console.error("Failed to run SQL setup:", error);
    process.exit(1);
  }
}

executeSqlFile();
