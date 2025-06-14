import pool from "./db.js";
import proposalModel from "./models/proposalModel.js";

async function testSupervisorApproval() {
  try {
    console.log("Testing supervisor approval workflow...");

    // First, let's create a test proposal
    console.log("\n1. Creating a test proposal...");
    const testProposalId = await proposalModel.createProposal(
      1, // student ID
      "Test Proposal for Workflow",
      "This is a test proposal to verify the supervisor approval workflow.",
      "Research",
      "Software Engineering",
      "A working prototype that demonstrates the concept",
      8 // supervisor ID
    );
    console.log(`Created test proposal with ID: ${testProposalId}`);

    // Check initial status
    const initialProposal = await proposalModel.getProposalWithStatus(
      testProposalId
    );
    console.log(`Initial status: ${initialProposal.status_name}`);

    // Now simulate supervisor approval
    console.log("\n2. Simulating supervisor approval...");
    await proposalModel.updateProposalStatus(
      testProposalId,
      "Supervisor_Approved"
    );

    // Check updated status
    const approvedProposal = await proposalModel.getProposalWithStatus(
      testProposalId
    );
    console.log(`Updated status: ${approvedProposal.status_name}`);

    // Now check if moderator can see it
    console.log("\n3. Checking if moderator can see pending proposals...");
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

    console.log("Supervisor_Approved proposals found:", proposals.length);
    if (proposals.length > 0) {
      console.log("Recent Supervisor_Approved proposals:");
      proposals.forEach((p) => {
        console.log(
          `  - ID: ${p.proposal_id}, Title: ${p.title}, By: ${p.submitter_name}`
        );
      });
    }

    await pool.end();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testSupervisorApproval();
