// routes/projectRoutes.js
import express from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth.js";
import projectController from "../controllers/projectController.js";
import progressLogController from "../controllers/progressLogController.js";
import reportController from "../controllers/reportController.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Apply authentication middleware to all routes
router.use(authenticate);

// POST /api/projects (Supervisor Propose New Project)
router.post("/", projectController.createProject);

// POST /api/projects/available/:projectId/select (Student Select Project)
router.post("/available/:projectId/select", projectController.selectProject);

// GET /api/projects (View Projects with query params)
router.get("/", projectController.getProjects);

// GET /api/projects/archive (Supervisor Access Past Projects)
router.get("/archive", projectController.getArchivedProjects);

// GET /api/projects/my/archive (Alternative path for past projects)
router.get("/my/archive", projectController.getArchivedProjects);

// POST /api/projects/:projectId/assign-examiner (Manager assign examiner)
router.post("/:projectId/assign-examiner", projectController.assignExaminer);

// POST /api/projects/:projectId/assign-moderator (Manager assign moderator)
router.post("/:projectId/assign-moderator", projectController.assignModerator);

// POST /api/projects/:projectId/archive (Archive Project)
router.post("/:projectId/archive", projectController.archiveProject);

// POST /api/projects/:projectId/logs (Submit Progress Log)
router.post("/:projectId/logs", progressLogController.submitProgressLog);

// POST /api/projects/:projectId/reports (Submit Report)
router.post(
  "/:projectId/reports",
  upload.single("report_file"),
  reportController.submitReport
);

export default router;
