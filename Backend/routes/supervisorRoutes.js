// routes/supervisorRoutes.js
import express from "express";

const router = express.Router();

// TODO: Import the supervisor controller
// import supervisorController from "../controllers/supervisorController.js";

// Placeholder routes for supervisor functionality
router.get("/:supervisorId/proposals", (req, res) => {
  res.status(200).json({
    success: true,
    message: "This endpoint will list all proposals assigned to the supervisor",
    supervisor_id: req.params.supervisorId,
  });
});

router.post("/:supervisorId/proposal-decision/:proposalId", (req, res) => {
  res.status(200).json({
    success: true,
    message: "This endpoint will process supervisor's decision on a proposal",
    supervisor_id: req.params.supervisorId,
    proposal_id: req.params.proposalId,
    decision: req.body.decision,
  });
});

router.get("/:supervisorId/students", (req, res) => {
  res.status(200).json({
    success: true,
    message: "This endpoint will list all students under the supervisor",
    supervisor_id: req.params.supervisorId,
  });
});

router.get("/:supervisorId/student-progress/:studentId", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "This endpoint will provide progress tracking for a specific student",
    supervisor_id: req.params.supervisorId,
    student_id: req.params.studentId,
  });
});

router.post("/:supervisorId/feedback", (req, res) => {
  res.status(201).json({
    success: true,
    message: "This endpoint will allow supervisor to provide feedback",
    supervisor_id: req.params.supervisorId,
    feedback_type: req.body.type,
    item_id: req.body.item_id,
    comments: req.body.comments,
  });
});

router.post("/:supervisorId/projects", (req, res) => {
  res.status(201).json({
    success: true,
    message: "This endpoint will allow supervisor to propose new projects",
    supervisor_id: req.params.supervisorId,
    title: req.body.title,
    description: req.body.description,
  });
});

export default router;
