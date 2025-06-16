// routes/supervisorRoutes.js
import express from "express";
import supervisorController from "../controllers/supervisorController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Apply auth middleware to all supervisor routes (except the public getAllSupervisors)
// Public route for getting all supervisors (no auth needed)
router.get("/", supervisorController.getAllSupervisors);

// Apply auth middleware to all other supervisor routes
router.use(auth.verifyToken, auth.checkUserActive, auth.hasRole("Supervisor"));

// Get current students enrolled under the supervisor
router.get("/:supervisorId/students", supervisorController.getStudents);

// Review proposed titles
router.get(
  "/:supervisorId/proposals",
  supervisorController.viewProjectProposals
);

// Get supervisor's own proposals
router.get(
  "/:supervisorId/my-proposals",
  supervisorController.getSupervisorOwnProposals
);

// Get the selected proposed title details
router.get(
  "/:supervisorId/proposals/:proposalId",
  supervisorController.getProposalDetails
);

// Submit proposal decision (approve, request modification, reject)
router.post(
  "/:supervisorId/proposal-decision/:proposalId",
  supervisorController.submitProposalDecision
);

// Get student details
router.get(
  "/:supervisorId/students/:studentId",
  supervisorController.getStudentDetails
);

// Get student logs
router.get(
  "/:supervisorId/students/:studentId/logs",
  supervisorController.getStudentLogs
);

// Provide feedback on logs
router.post(
  "/:supervisorId/feedback/log/:logId",
  supervisorController.provideFeedbackOnLog
);

// Get student reports
router.get(
  "/:supervisorId/students/:studentId/reports",
  supervisorController.getStudentReports
);

// Provide feedback on reports
router.post(
  "/:supervisorId/feedback/report/:reportId",
  supervisorController.provideFeedbackOnReport
);

// View previous projects archive
router.get(
  "/:supervisorId/previous-projects",
  supervisorController.getPreviousProjects
);

// Get project archive details
router.get(
  "/:supervisorId/previous-projects/:projectId",
  supervisorController.getProjectDetails
);

// Propose a new project
router.post(
  "/:supervisorId/propose-project",
  supervisorController.proposeProject
);

// Get proposal
router.get(
  "/:supervisorId/my-proposals/:proposalId",
  supervisorController.getSupervisorProposal
);

// Update proposal
router.put(
  "/:supervisorId/my-proposals/:proposalId",
  supervisorController.updateProposal
);

// Review student proposal
router.post(
  "/:supervisorId/review-proposal/:proposalId",
  supervisorController.reviewStudentProposal
);

export default router;
