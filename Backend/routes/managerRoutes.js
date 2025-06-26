// routes/managerRoutes.js
import express from "express";
import managerController from "../controllers/managerController.js";
import progressLogController from "../controllers/progressLogController.js";
import reportController from "../controllers/reportController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Apply auth middleware to all manager routes (authentication only, role checks in controllers)
router.use(auth.authenticate);

// Get all users (new route for the requirement)
router.get("/:managerId/users", managerController.getUsers);

// Your existing routes
router.get("/:managerId/students", (req, res) => {
  // Your existing implementation or call managerController.getStudents
  res.status(200).json({
    success: true,
    message: "This endpoint will list all students for eligibility management",
    manager_id: req.params.managerId,
  });
});

router.put(
  "/:managerId/user-eligibility/:userId",
  managerController.updateUserEligibility
);

// Admin-style route for student eligibility (for tests)
router.post(
  "/students/:studentId/eligibility",
  managerController.updateStudentEligibility
);

// Admin routes for viewing student data
router.get(
  "/students/:studentId/progress-logs",
  progressLogController.getStudentProgressLogs
);

router.get("/students/:studentId/reports", reportController.getStudentReports);

router.post("/:managerId/register-user", managerController.registerUser);
router.post("/:managerId/assign-examiner", managerController.assignExaminer);
router.get(
  "/:managerId/approved-projects",
  managerController.getApprovedProjects
);
router.get(
  "/:managerId/student-logs/:studentId",
  managerController.getStudentLogs
);

// Get all roles
router.get("/:managerId/roles", managerController.getRoles);

// Get all examiners
router.get("/:managerId/examiners", managerController.getExaminers);

// Get previous (completed) projects
router.get(
  "/:managerId/previous-projects",
  managerController.getPreviousProjects
);

// Delete user route
router.delete("/:managerId/users/:userId", managerController.deleteUser);

export default router;
