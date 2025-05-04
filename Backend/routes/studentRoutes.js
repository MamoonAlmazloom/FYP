// routes/studentRoutes.js
import express from "express";
import studentCtrl from "../controllers/studentController.js";
const router = express.Router();

// GET   /students/:studentId/proposals
router.get("/:studentId/proposals", studentCtrl.listProposals);

// POST  /students/:studentId/proposals
router.post("/:studentId/proposals", studentCtrl.submitProposal);

// PUT   /students/:studentId/proposals/:proposalId
router.put("/:studentId/proposals/:proposalId", studentCtrl.modifyProposal);

// GET   /students/:studentId/approved-projects
router.get("/:studentId/approved-projects", studentCtrl.listApprovedProjects);

// POST  /students/:studentId/approved-projects/:projectId
router.post(
  "/:studentId/approved-projects/:projectId",
  studentCtrl.selectApprovedProject
);

// GET   /students/:studentId/progress-logs
router.get("/:studentId/progress-logs", studentCtrl.listProgressLogs);

// POST  /students/:studentId/progress-logs
router.post("/:studentId/progress-logs", studentCtrl.submitProgressLog);

export default router;
