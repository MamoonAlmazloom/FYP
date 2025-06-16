// Test project selection with active project blocking
const API_BASE = "http://localhost:5000/api";

async function testProjectSelection() {
  try {
    // Test student ID 3 (who doesn't have active project)
    console.log("=== Testing Project Selection ===");

    // First, check available projects
    const projectsResponse = await fetch(
      `${API_BASE}/students/3/available-projects`
    );
    const projectsData = await projectsResponse.json();
    console.log("Available projects:", projectsData.projects?.length || 0);

    if (projectsData.projects && projectsData.projects.length > 0) {
      const firstProject = projectsData.projects[0];
      console.log(`\nTrying to select project: ${firstProject.title}`);

      // Try to select the first available project
      const selectResponse = await fetch(
        `${API_BASE}/students/3/select-project`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_id: firstProject.project_id,
          }),
        }
      );

      const selectData = await selectResponse.json();
      console.log(
        "Selection result:",
        selectData.success ? "SUCCESS" : "FAILED"
      );
      if (selectData.error) {
        console.log("Error:", selectData.error);
      }

      // Now check if student has active project
      const activeResponse = await fetch(
        `${API_BASE}/students/3/active-project`
      );
      const activeData = await activeResponse.json();
      console.log("\nAfter selection:");
      console.log("Has Active Project:", activeData.hasActiveProject);
      if (activeData.activeProject) {
        console.log("Active Project:", activeData.activeProject.title);
      }

      // Try to select another project (should fail)
      if (projectsData.projects.length > 1) {
        console.log("\n=== Testing Second Project Selection (Should Fail) ===");
        const secondProject = projectsData.projects[1];
        console.log(`Trying to select second project: ${secondProject.title}`);

        const secondSelectResponse = await fetch(
          `${API_BASE}/students/3/select-project`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              project_id: secondProject.project_id,
            }),
          }
        );

        const secondSelectData = await secondSelectResponse.json();
        console.log(
          "Second selection result:",
          secondSelectData.success ? "SUCCESS" : "FAILED"
        );
        if (secondSelectData.error) {
          console.log("Error:", secondSelectData.error);
        }
      }
    } else {
      console.log("No available projects to test with");
    }
  } catch (error) {
    console.error("Test error:", error);
  }
}

testProjectSelection();
