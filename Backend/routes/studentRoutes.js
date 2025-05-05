// routes/studentRoutes.js
import express from "express";
import studentController from "../controllers/studentController.js";

const router = express.Router();

router.get("/:studentId/proposals", studentController.listProposals);

router.post("/:studentId/proposals", studentController.submitProposal);

router.put(
  "/:studentId/proposals/:proposalId",
  studentController.modifyProposal
);

router.get(
  "/:studentId/approved-projects",
  studentController.listApprovedProjects
);

router.post(
  "/:studentId/approved-projects/:projectId",
  studentController.selectApprovedProject
);

router.get("/:studentId/progress-logs", studentController.listProgressLogs);

router.post("/:studentId/progress-logs", studentController.submitProgressLog);

router.get("/:studentId/feedback", studentController.getStudentFeedback);

export default router;
