// routes/studentRoutes.js
import express from "express";
import studentController from "../controllers/studentController.js";

const router = express.Router();

/**
 * @route   GET /api/students/:studentId/proposals
 * @desc    Get all proposals for a student
 * @access  Private
 */
router.get("/:studentId/proposals", studentController.listProposals);

/**
 * @route   POST /api/students/:studentId/proposals
 * @desc    Submit a new proposal
 * @access  Private
 */
router.post("/:studentId/proposals", studentController.submitProposal);

/**
 * @route   PUT /api/students/:studentId/proposals/:proposalId
 * @desc    Modify an existing proposal
 * @access  Private
 */
router.put(
  "/:studentId/proposals/:proposalId",
  studentController.modifyProposal
);

/**
 * @route   GET /api/students/:studentId/approved-projects
 * @desc    Get all approved projects
 * @access  Private
 */
router.get(
  "/:studentId/approved-projects",
  studentController.listApprovedProjects
);

/**
 * @route   POST /api/students/:studentId/approved-projects/:projectId
 * @desc    Select an approved project
 * @access  Private
 */
router.post(
  "/:studentId/approved-projects/:projectId",
  studentController.selectApprovedProject
);

/**
 * @route   GET /api/students/:studentId/progress-logs
 * @desc    Get all progress logs for a student
 * @access  Private
 */
router.get("/:studentId/progress-logs", studentController.listProgressLogs);

/**
 * @route   POST /api/students/:studentId/progress-logs
 * @desc    Submit a new progress log
 * @access  Private
 */
router.post("/:studentId/progress-logs", studentController.submitProgressLog);

/**
 * @route   GET /api/students/:studentId/feedback
 * @desc    Get feedback for a student
 * @access  Private
 */
router.get("/:studentId/feedback", studentController.getStudentFeedback);

export default router;
