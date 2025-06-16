// Test script to verify supervisor API and active project checks
const API_BASE = "http://localhost:5000/api";

// Test getting all supervisors
async function testGetSupervisors() {
  try {
    const response = await fetch(`${API_BASE}/supervisors`);
    const data = await response.json();
    console.log("=== Get All Supervisors ===");
    console.log("Success:", data.success);
    console.log("Supervisors count:", data.supervisors?.length || 0);
    console.log("Sample supervisor:", data.supervisors?.[0]);
    return data;
  } catch (error) {
    console.error("Error fetching supervisors:", error);
  }
}

// Test checking active project for a student
async function testActiveProject(studentId) {
  try {
    const response = await fetch(
      `${API_BASE}/students/${studentId}/active-project`
    );
    const data = await response.json();
    console.log(`=== Active Project Check for Student ${studentId} ===`);
    console.log("Success:", data.success);
    console.log("Has Active Project:", data.hasActiveProject);
    if (data.activeProject) {
      console.log("Active Project:", data.activeProject.title);
    }
    return data;
  } catch (error) {
    console.error("Error checking active project:", error);
  }
}

// Test submitting a proposal with active project check
async function testSubmitProposal(studentId, proposalData) {
  try {
    const response = await fetch(
      `${API_BASE}/students/${studentId}/proposals`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proposalData),
      }
    );
    const data = await response.json();
    console.log(`=== Submit Proposal Test for Student ${studentId} ===`);
    console.log("Success:", data.success);
    console.log("Error:", data.error);
    return data;
  } catch (error) {
    console.error("Error submitting proposal:", error);
  }
}

// Run tests
async function runTests() {
  console.log("Starting API tests...\n");

  // Test 1: Get supervisors
  await testGetSupervisors();
  console.log("\n");

  // Test 2: Check active project for student ID 1
  await testActiveProject(1);
  console.log("\n");

  // Test 3: Try to submit a proposal (should fail if student has active project)
  const sampleProposal = {
    title: "Test Proposal",
    description:
      "This is a test proposal description that is longer than 50 characters to meet validation requirements.",
    type: "Research",
    specialization: "AI/ML",
    outcome: "Expected test outcome",
    submitted_to: 2, // Assuming supervisor ID 2 exists
  };

  await testSubmitProposal(1, sampleProposal);
  console.log("\n");

  // Test 4: Check active project for student ID 3 (assuming they don't have active project)
  await testActiveProject(3);
}

// Run the tests
runTests();
