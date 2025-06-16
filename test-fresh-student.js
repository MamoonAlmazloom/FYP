// Test with a fresh student ID
const API_BASE = "http://localhost:5000/api";

async function testFreshStudent() {
  const studentId = 4; // Using student ID 4

  console.log(`=== Testing Fresh Student ${studentId} ===`);

  // Check active project status
  const activeResponse = await fetch(
    `${API_BASE}/students/${studentId}/active-project`
  );
  const activeData = await activeResponse.json();
  console.log("Has Active Project:", activeData.hasActiveProject);

  if (!activeData.hasActiveProject) {
    // Get available projects
    const projectsResponse = await fetch(
      `${API_BASE}/students/${studentId}/available-projects`
    );
    const projectsData = await projectsResponse.json();
    console.log("Available projects:", projectsData.projects?.length || 0);

    if (projectsData.projects && projectsData.projects.length > 0) {
      const firstProject = projectsData.projects[0];
      console.log(`\nSelecting first project: ${firstProject.title}`);

      // Select first project
      const selectResponse = await fetch(
        `${API_BASE}/students/${studentId}/select-project`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ project_id: firstProject.project_id }),
        }
      );

      const selectData = await selectResponse.json();
      console.log(
        "First selection result:",
        selectData.success ? "SUCCESS" : "FAILED"
      );
      if (selectData.error) console.log("Error:", selectData.error);

      // Check active project status again
      const newActiveResponse = await fetch(
        `${API_BASE}/students/${studentId}/active-project`
      );
      const newActiveData = await newActiveResponse.json();
      console.log("\nAfter first selection:");
      console.log("Has Active Project:", newActiveData.hasActiveProject);
      if (newActiveData.activeProject) {
        console.log("Active Project:", newActiveData.activeProject.title);
      }

      // Try to select second project (should fail now)
      if (projectsData.projects.length > 1) {
        const secondProject = projectsData.projects[1];
        console.log(
          `\nTrying to select second project: ${secondProject.title}`
        );

        const secondSelectResponse = await fetch(
          `${API_BASE}/students/${studentId}/select-project`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ project_id: secondProject.project_id }),
          }
        );

        const secondSelectData = await secondSelectResponse.json();
        console.log(
          "Second selection result:",
          secondSelectData.success ? "SUCCESS" : "FAILED"
        );
        if (secondSelectData.error)
          console.log("Error:", secondSelectData.error);
      }
    }
  } else {
    console.log(
      "Student already has active project:",
      activeData.activeProject?.title
    );
  }
}

testFreshStudent();
