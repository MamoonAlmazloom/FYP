// Add this to your studentController.js for debugging
/**
 * Debug available projects - temporary endpoint
 */
const debugAvailableProjects = async (req, res, next) => {
  try {
    console.log("=== DEBUGGING AVAILABLE PROJECTS ===");
    
    // Step 1: Check if Project table has any data
    const [projectCount] = await pool.query(`SELECT COUNT(*) as count FROM Project`);
    console.log("1. Total projects in Project table:", projectCount[0].count);
    
    // Step 2: Check all projects
    const [allProjects] = await pool.query(`SELECT project_id, title FROM Project LIMIT 5`);
    console.log("2. Sample projects:", allProjects);
    
    // Step 3: Check Supervisor_Project relationships
    const [supervisorProjects] = await pool.query(`SELECT COUNT(*) as count FROM Supervisor_Project`);
    console.log("3. Supervisor-Project relationships:", supervisorProjects[0].count);
    
    // Step 4: Check proposal statuses
    const [statuses] = await pool.query(`SELECT * FROM Proposal_Status`);
    console.log("4. Available proposal statuses:", statuses);
    
    // Step 5: Check if 'Approved' status exists
    const [approvedStatus] = await pool.query(`SELECT status_id FROM Proposal_Status WHERE status_name = 'Approved'`);
    console.log("5. Approved status found:", approvedStatus.length > 0);
    
    if (approvedStatus.length > 0) {
      // Step 6: Check approved proposals
      const [approvedProposals] = await pool.query(`
        SELECT project_id FROM Proposal WHERE status_id = ?`, 
        [approvedStatus[0].status_id]
      );
      console.log("6. Projects with approved proposals:", approvedProposals.map(p => p.project_id));
    }
    
    // Step 7: Projects with supervisors (without filtering)
    const [projectsWithSupervisors] = await pool.query(`
      SELECT p.project_id, p.title, u.name as supervisor_name 
      FROM Project p
      JOIN Supervisor_Project sp ON p.project_id = sp.project_id
      JOIN User u ON sp.supervisor_id = u.user_id
    `);
    console.log("7. Projects with supervisors:", projectsWithSupervisors.length);
    
    console.log("=== END DEBUG ===");
    
    res.json({
      success: true,
      debug: {
        totalProjects: projectCount[0].count,
        supervisorRelationships: supervisorProjects[0].count,
        projectsWithSupervisors: projectsWithSupervisors.length,
        statuses: statuses,
        approvedStatusExists: approvedStatus.length > 0
      }
    });
    
  } catch (err) {
    next(err);
  }
};