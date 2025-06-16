// routes/examinerRoutes.js
import express from "express";
import examinerController from "../controllers/examinerController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Apply auth middleware to all examiner routes
router.use(auth.verifyToken, auth.checkUserActive, auth.hasRole("Examiner"));

// Get all assigned projects
router.get(
  "/:examinerId/assigned-projects",
  examinerController.getAssignedProjects
);

// Get all projects (alias for assigned-projects)
router.get("/:examinerId/projects", examinerController.getAssignedProjects);

// Get project details
router.get(
  "/:examinerId/project-details/:projectId",
  examinerController.getProjectDetails
);

// Get project submission
router.get(
  "/:examinerId/project-submissions/:projectId",
  examinerController.getProjectSubmission
);

// Provide examination feedback
router.post(
  "/:examinerId/examination-feedback/:projectId",
  examinerController.provideExaminationFeedback
);

// Update examination feedback
router.put(
  "/:examinerId/examination-feedback/:projectId",
  examinerController.updateExaminationFeedback
);

// Get examiner profile
router.get("/:examinerId/profile", examinerController.getExaminerProfile);

// Get all previous evaluations
router.get(
  "/:examinerId/evaluations",
  examinerController.getPreviousEvaluations
);

// Get evaluation statistics
router.get(
  "/:examinerId/statistics",
  examinerController.getEvaluationStatistics
);

// Schedule examination date
router.post(
  "/:examinerId/schedule-examination/:projectId",
  examinerController.scheduleExamination
);

// Get scheduled examinations
router.get(
  "/:examinerId/scheduled-examinations",
  examinerController.getScheduledExaminations
);

// Request extension for evaluation
router.post(
  "/:examinerId/request-extension/:projectId",
  examinerController.requestExtension
);

// Update project status
router.put(
  "/:examinerId/projects/:projectId/status",
  examinerController.updateProjectStatus
);

export default router;
