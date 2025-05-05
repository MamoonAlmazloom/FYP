// controllers/studentController.js
import proposalModel from "../models/proposalModel.js";
import projectModel from "../models/projectModel.js";
import progressModel from "../models/progressModel.js";
import feedbackModel from "../models/feedbackModel.js";

/**
 * List all proposals for a student
 */
const listProposals = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const proposals = await proposalModel.getProposalsByStudent(studentId);
    res.status(200).json({ success: true, proposals });
  } catch (err) {
    next(err);
  }
};

/**
 * Submit a new proposal
 */
const submitProposal = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const { projectId } = req.body;

    if (!projectId) {
      return res
        .status(400)
        .json({ success: false, error: "Project ID is required" });
    }

    const id = await proposalModel.createProposal(studentId, projectId);
    res.status(201).json({ success: true, proposalId: id });
  } catch (err) {
    next(err);
  }
};

/**
 * Modify an existing proposal
 */
const modifyProposal = async (req, res, next) => {
  try {
    const { proposalId, studentId } = req.params;
    const { projectId } = req.body;

    if (!projectId) {
      return res
        .status(400)
        .json({ success: false, error: "Project ID is required" });
    }

    const updated = await proposalModel.updateProposal(proposalId, projectId);
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, error: "Proposal not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Proposal updated successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * List all approved projects
 */
const listApprovedProjects = async (req, res, next) => {
  try {
    const projects = await projectModel.getApprovedProjects();
    res.status(200).json({ success: true, projects });
  } catch (err) {
    next(err);
  }
};

/**
 * Select an approved project
 */
const selectApprovedProject = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const projectId = req.params.projectId;

    if (!projectId) {
      return res
        .status(400)
        .json({ success: false, error: "Project ID is required" });
    }

    const assignmentId = await projectModel.selectProject(studentId, projectId);
    res.status(201).json({ success: true, assignmentId });
  } catch (err) {
    if (err.message === "Project not found") {
      return res.status(404).json({ success: false, error: err.message });
    }
    next(err);
  }
};

/**
 * List all progress logs for a student
 */
const listProgressLogs = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const logs = await progressModel.getProgressLogs(studentId);
    res.status(200).json({ success: true, logs });
  } catch (err) {
    next(err);
  }
};

/**
 * Submit a new progress log
 */
const submitProgressLog = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const { projectId, submissionDate } = req.body;

    if (!projectId || !submissionDate) {
      return res.status(400).json({
        success: false,
        error: "Project ID and submission date are required",
      });
    }

    const logId = await progressModel.createProgressLog(
      studentId,
      projectId,
      submissionDate
    );
    res.status(201).json({ success: true, logId });
  } catch (err) {
    if (
      err.message === "Project is not assigned to this student or not approved"
    ) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next(err);
  }
};

/**
 * Get feedback for a student
 */
const getStudentFeedback = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const feedback = await feedbackModel.getFeedbackForStudent(studentId);
    res.status(200).json({ success: true, feedback });
  } catch (err) {
    next(err);
  }
};

export default {
  listProposals,
  submitProposal,
  modifyProposal,
  listApprovedProjects,
  selectApprovedProject,
  listProgressLogs,
  submitProgressLog,
  getStudentFeedback,
};
