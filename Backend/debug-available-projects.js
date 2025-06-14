// Debug version of getAvailableProjects with step-by-step checks
const debugAvailableProjects = async () => {
  try {
    console.log("=== DEBUGGING AVAILABLE PROJECTS ===");
    
    // Step 1: Check if Project table has any data
    const [projectCount] = await pool.query(`SELECT COUNT(*) as count FROM Project`);
    console.log("1. Total projects in Project table:", projectCount[0].count);
    
    // Step 2: Check if Supervisor_Project table has any data
    const [supervisorProjectCount] = await pool.query(`SELECT COUNT(*) as count FROM Supervisor_Project`);
    console.log("2. Total supervisor-project relationships:", supervisorProjectCount[0].count);
    
    // Step 3: Check if Proposal_Status table has 'Approved' status
    const [approvedStatus] = await pool.query(`SELECT * FROM Proposal_Status WHERE status_name = 'Approved'`);
    console.log("3. Approved status exists:", approvedStatus.length > 0 ? "YES" : "NO");
    if (approvedStatus.length > 0) {
      console.log("   Approved status_id:", approvedStatus[0].status_id);
    }
    
    // Step 4: Check projects with supervisor relationships (without the NOT IN clause)
    const [projectsWithSupervisors] = await pool.query(`
      SELECT p.project_id, p.title, p.description, u.name as supervisor_name 
      FROM Project p
      JOIN Supervisor_Project sp ON p.project_id = sp.project_id
      JOIN User u ON sp.supervisor_id = u.user_id
    `);
    console.log("4. Projects with supervisor relationships:", projectsWithSupervisors.length);
    console.log("   Projects:", projectsWithSupervisors.map(p => ({id: p.project_id, title: p.title})));
    
    // Step 5: Check approved proposals
    const [approvedProposals] = await pool.query(`
      SELECT project_id FROM Proposal WHERE status_id = (
        SELECT status_id FROM Proposal_Status WHERE status_name = 'Approved'
      )
    `);
    console.log("5. Projects with approved proposals:", approvedProposals.length);
    console.log("   Approved project IDs:", approvedProposals.map(p => p.project_id));
    
    // Step 6: Final query with detailed logging
    const [availableProjects] = await pool.query(`
      SELECT p.project_id, p.title, p.description, u.name as supervisor_name 
      FROM Project p
      JOIN Supervisor_Project sp ON p.project_id = sp.project_id
      JOIN User u ON sp.supervisor_id = u.user_id
      WHERE p.project_id NOT IN (
        SELECT project_id FROM Proposal WHERE status_id = (
          SELECT status_id FROM Proposal_Status WHERE status_name = 'Approved'
        )
      )
    `);
    console.log("6. Final available projects:", availableProjects.length);
    
    console.log("=== END DEBUG ===");
    return availableProjects;
    
  } catch (error) {
    console.error("Error in debugAvailableProjects:", error);
    throw error;
  }
};

// Alternative query that handles potential NULL values better
const getAvailableProjectsFixed = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT p.project_id, p.title, p.description, u.name as supervisor_name 
      FROM Project p
      JOIN Supervisor_Project sp ON p.project_id = sp.project_id
      JOIN User u ON sp.supervisor_id = u.user_id
      WHERE NOT EXISTS (
        SELECT 1 FROM Proposal pr 
        WHERE pr.project_id = p.project_id 
        AND pr.status_id = (
          SELECT status_id FROM Proposal_Status WHERE status_name = 'Approved'
        )
      )
    `);
    return rows;
  } catch (error) {
    console.error("Error in getAvailableProjectsFixed:", error);
    throw error;
  }
};

// Query to check what statuses exist in Proposal_Status
const checkProposalStatuses = async () => {
  try {
    const [statuses] = await pool.query(`SELECT * FROM Proposal_Status`);
    console.log("Available proposal statuses:", statuses);
    return statuses;
  } catch (error) {
    console.error("Error checking proposal statuses:", error);
    throw error;
  }
};

export { debugAvailableProjects, getAvailableProjectsFixed, checkProposalStatuses };
