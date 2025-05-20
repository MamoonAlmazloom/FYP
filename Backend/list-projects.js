// A simple script to list all projects in the database
import pool from "./db.js";

async function listProjects() {
  try {
    console.log("Fetching all projects...");
    const [projectRows] = await pool.query("SELECT * FROM Project");
    console.log("\nAvailable Projects:");
    console.table(projectRows);

    console.log("\nFetching all proposals...");
    const [proposalRows] = await pool.query(`
      SELECT p.proposal_id, p.title, p.project_id, ps.status_name, u.name as submitted_by_name
      FROM Proposal p
      JOIN Proposal_Status ps ON p.status_id = ps.status_id
      JOIN User u ON p.submitted_by = u.user_id
      ORDER BY p.proposal_id DESC LIMIT 10`);
    console.log("\nRecent Proposals:");
    console.table(proposalRows);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    pool.end();
  }
}

listProjects();
