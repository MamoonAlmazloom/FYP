// routes/studentRoutes.js
import express from "express";
import studentController from "../controllers/studentController.js";

const router = express.Router();

// Proposal routes
router.get("/:studentId/proposals", studentController.listProposals);
router.post("/:studentId/proposals", studentController.submitProposal);
router.get(
  "/:studentId/proposals/:proposalId",
  studentController.getProposalStatus
);
router.put(
  "/:studentId/proposals/:proposalId",
  studentController.updateProposal
);
router.get(
  "/:studentId/proposals/:proposalId/status",
  studentController.getProposalStatus
);

// Student profile route
router.get("/:studentId", studentController.getStudentProfile);

// Progress log routes
router.get("/:studentId/progress-logs", studentController.getProgressLogs);
router.post("/:studentId/progress-logs", studentController.submitProgressLog);

// Progress report routes
router.get(
  "/:studentId/progress-reports",
  studentController.getProgressReports
);
router.post(
  "/:studentId/progress-reports",
  studentController.submitProgressReport
);

// Available projects routes
router.get(
  "/:studentId/available-projects",
  studentController.getAvailableProjects
);
router.post("/:studentId/select-project", studentController.selectProject);

// Feedback routes
router.get("/:studentId/feedback", studentController.getFeedback);

// Student projects routes
router.get("/:studentId/projects", studentController.getStudentProjects);

// Active project status route
router.get("/:studentId/active-project", studentController.getActiveProject);

export default router;
