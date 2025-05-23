// routes/managerRoutes.js
import express from "express";
import managerController from "../controllers/managerController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Apply auth middleware to all manager routes
router.use(auth.verifyToken, auth.hasRole("Manager"));

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

router.put("/:managerId/user-eligibility/:userId", managerController.updateUserEligibility);
router.post("/:managerId/register-user", managerController.registerUser);
router.post("/:managerId/assign-examiner", managerController.assignExaminer);
router.get("/:managerId/approved-projects", managerController.getApprovedProjects);
router.get("/:managerId/student-logs/:studentId", managerController.getStudentLogs);

// Get all roles
router.get("/:managerId/roles", managerController.getRoles);

// Get all examiners
router.get("/:managerId/examiners", managerController.getExaminers);

export default router;