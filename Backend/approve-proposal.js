// A script to approve a proposal and create a project
import pool from "./db.js";
import proposalModel from "./models/proposalModel.js";

async function approveProposal(proposalId) {
  try {
    console.log(`Approving proposal ${proposalId}...`);

    // First, update proposal status to Approved
    await proposalModel.updateProposalStatus(proposalId, "Approved");
    console.log("Proposal status updated to Approved");

    // Then create a project from this proposal
    const projectId = await proposalModel.createProjectFromProposal(proposalId);
    console.log(`Project created with ID: ${projectId}`);

    // Verify that the proposal has been updated with the project_id
    const [proposalRows] = await pool.query(
      `SELECT p.proposal_id, p.title, p.project_id, ps.status_name 
       FROM Proposal p
       JOIN Proposal_Status ps ON p.status_id = ps.status_id
       WHERE p.proposal_id = ?`,
      [proposalId]
    );

    console.log("Updated proposal:", proposalRows[0]);

    return projectId;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    pool.end();
  }
}

// Provide the proposal ID as a command line argument
const proposalId = process.argv[2] || 19; // Default to 19 if not specified
approveProposal(proposalId);
