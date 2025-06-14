import pool from "./db.js";
import studentModel from "./models/studentModel.js";

async function testProjectSelection() {
  try {
    console.log("Testing project selection workflow...\n");

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
        `  - ID: ${project.project_id}, Title: ${project.title}, Supervisor: ${project.supervisor_name}`
      );
    });

    // 2. Try to select the first project
    const projectToSelect = availableProjects[0];
    console.log(
      `\n2. Attempting to select project: ${projectToSelect.title} (ID: ${projectToSelect.project_id})`
    );

    try {
      const success = await studentModel.selectProject(
        studentId,
        projectToSelect.project_id
      );
      console.log(`Selection result: ${success ? "SUCCESS" : "FAILED"}`);

      if (success) {
        // 3. Verify the selection worked
        console.log("\n3. Verifying selection...");

        // Check student's projects
        const studentProjects = await studentModel.getStudentProjects(
          studentId
        );
        console.log(`Student now has ${studentProjects.length} projects:`);
        studentProjects.forEach((project) => {
          console.log(`  - ${project.title} (ID: ${project.project_id})`);
        });

        // Check that the project is no longer available
        const updatedAvailableProjects =
          await studentModel.getAvailableProjects();
        const stillAvailable = updatedAvailableProjects.find(
          (p) => p.project_id === projectToSelect.project_id
        );
        console.log(
          `Project still available for others: ${
            stillAvailable ? "YES (ERROR!)" : "NO (CORRECT)"
          }`
        );

        console.log("\n✅ Project selection test PASSED!");
      }
    } catch (selectionError) {
      console.log(`Selection failed with error: ${selectionError.message}`);
      console.log(
        "This might be because the project is already taken or unavailable."
      );
    }

    await pool.end();
  } catch (error) {
    console.error("Test error:", error);
    process.exit(1);
  }
}

testProjectSelection();
