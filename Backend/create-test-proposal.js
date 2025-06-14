import pool from "./db.js";
import proposalModel from "./models/proposalModel.js";

async function createTestProposalForModerator() {
  try {
    console.log(
      "Creating a test proposal that goes through the full workflow..."
    );

    // Create a new proposal
    const proposalId = await proposalModel.createProposal(
      1, // student ID (nabil@example.com has user_id 1)
      "Test Proposal for Moderator Review",
      "This proposal will be approved by supervisor to test moderator workflow.",
      "Application",
      "Software Engineering, Testing",
      "A comprehensive test of the proposal workflow system",
      8 // supervisor ID (sarah.johnson@example.com has user_id 8)
    );

    console.log(`Created proposal with ID: ${proposalId}`);

    // Simulate supervisor approval
    console.log("Simulating supervisor approval...");
    await proposalModel.updateProposalStatus(proposalId, "Supervisor_Approved");

    // Verify the status
    const approvedProposal = await proposalModel.getProposalWithStatus(
      proposalId
    );
    console.log(
      `Proposal ${proposalId} status: ${approvedProposal.status_name}`
    );

    // Check what moderator would see
    console.log("\nChecking what moderator sees:");
    const [proposals] = await pool.query(
      `SELECT p.proposal_id, p.title, p.submitted_by, p.submitted_to,
              u.name AS submitter_name,
              sv.name AS supervisor_name
       FROM Proposal p
       JOIN Proposal_Status ps ON p.status_id = ps.status_id
       JOIN User u ON p.submitted_by = u.user_id
       LEFT JOIN User sv ON p.submitted_to = sv.user_id
       WHERE ps.status_name = 'Supervisor_Approved'
       ORDER BY p.proposal_id DESC`
    );

    if (proposals.length > 0) {
      console.log(
        `Found ${proposals.length} proposals pending moderator review:`
      );
      proposals.forEach((p) => {
        console.log(`  - ID: ${p.proposal_id}, Title: ${p.title}`);
        console.log(
          `    Submitted by: ${p.submitter_name}, Supervisor: ${p.supervisor_name}`
        );
      });
    } else {
      console.log("No proposals found for moderator review");
    }

    console.log(
      `\nYou can now test the moderator endpoint with proposal ID: ${proposalId}`
    );
    console.log(`Try: GET /api/moderators/9/pending-proposals`);
    console.log(`Then: POST /api/moderators/9/review-proposal/${proposalId}`);

    await pool.end();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createTestProposalForModerator();
