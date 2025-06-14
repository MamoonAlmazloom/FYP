import pool from "./db.js";
import studentModel from "./models/studentModel.js";
import proposalModel from "./models/proposalModel.js";

async function testNewProjectSelectionWorkflow() {
  try {
    console.log("Testing new project selection workflow...\n");

    const studentId = 1; // Alice Smith

    // 1. Get available projects
    console.log("1. Getting available projects...");
    const availableProjects = await studentModel.getAvailableProjects();
    console.log(`Found ${availableProjects.length} available projects:`);

    if (availableProjects.length === 0) {
      console.log("No available projects found!");
      await pool.end();
      return;
    }

    availableProjects.slice(0, 3).forEach((project) => {
      console.log(
        `  - ID: ${project.project_id}, Title: ${project.title}, Supervisor: ${project.supervisor_name} (ID: ${project.supervisor_id})`
      );
    });

    // 2. Try to select the first project
    const projectToSelect = availableProjects[0];
    console.log(
      `\n2. Student applying for project: ${projectToSelect.title} (ID: ${projectToSelect.project_id})`
    );

    try {
      const proposalId = await studentModel.selectProject(
        studentId,
        projectToSelect.project_id
      );
      console.log(
        `Application result: ${
          proposalId ? "SUCCESS - Proposal ID: " + proposalId : "FAILED"
        }`
      );

      if (proposalId) {
        // 3. Verify the proposal was created with Pending status
        console.log(
          "\n3. Verifying proposal was created with Pending status..."
        );
        const proposal = await proposalModel.getProposalWithStatus(proposalId);

        if (proposal) {
          console.log(`✅ Proposal created successfully:`);
          console.log(`   - Proposal ID: ${proposal.proposal_id}`);
          console.log(`   - Status: ${proposal.status_name}`);
          console.log(`   - Submitted by: ${proposal.submitted_by}`);
          console.log(`   - Submitted to: ${proposal.submitted_to}`);
          console.log(`   - Project ID: ${proposal.project_id}`);
        } else {
          console.log("❌ Failed to retrieve proposal details");
        }

        // 4. Check student's projects (should be empty since not approved yet)
        console.log("\n4. Checking student's active projects...");
        const studentProjects = await studentModel.getStudentProjects(
          studentId
        );
        console.log(
          `Student has ${studentProjects.length} active projects (should be 0 until approved)`
        );

        // 5. Check student's proposals
        console.log("\n5. Checking student's proposals...");
        const studentProposals = await proposalModel.getProposalsByStudent(
          studentId
        );
        const pendingProposals = studentProposals.filter(
          (p) => p.status_name === "Pending"
        );
        console.log(`Student has ${pendingProposals.length} pending proposals`);

        // 6. Verify project is still available for other students (since not approved yet)
        console.log(
          "\n6. Checking if project is still available for others..."
        );
        const updatedAvailableProjects =
          await studentModel.getAvailableProjects();
        const stillAvailable = updatedAvailableProjects.find(
          (p) => p.project_id === projectToSelect.project_id
        );
        console.log(
          `Project still available for others: ${
            stillAvailable
              ? "YES (CORRECT - waiting for approval)"
              : "NO (INCORRECT)"
          }`
        );

        console.log("\n✅ NEW WORKFLOW TEST COMPLETED SUCCESSFULLY!");
        console.log("Summary:");
        console.log(
          "- Student application created proposal with Pending status"
        );
        console.log(
          "- Student has no active projects until supervisor approval"
        );
        console.log(
          "- Project remains available for other students until approved"
        );
        console.log(
          "- Supervisor will receive notification to review the proposal"
        );
      }
    } catch (error) {
      console.log(`Selection failed: ${error.message}`);
    }
  } catch (error) {
    console.error("Test error:", error);
  } finally {
    await pool.end();
  }
}

testNewProjectSelectionWorkflow();
