// controllers/studentController.js
import proposalModel from "../models/proposalModel.js";
import studentModel from "../models/studentModel.js";

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
    const { title, proposal_description } = req.body;

    if (!title || !proposal_description) {
      return res.status(400).json({
        success: false,
        error: "Title and proposal description are required",
      });
    }

    const id = await proposalModel.createProposal(
      studentId,
      title,
      proposal_description
    );
    res.status(201).json({ success: true, project_id: id });
  } catch (err) {
    next(err);
  }
};

/**
 * Update a proposal
 */
const updateProposal = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const proposalId = req.params.proposalId;
    const { title, proposal_description } = req.body;

    if (!title || !proposal_description) {
      return res.status(400).json({
        success: false,
        error: "Title and proposal description are required",
      });
    }

    const id = await proposalModel.updateProposal(
      proposalId,
      title,
      proposal_description
    );
    res.status(200).json({ success: true, project_id: id });
  } catch (err) {
    next(err);
  }
};

/**
 * Get student profile
 */
const getStudentProfile = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const student = await studentModel.getStudentById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    res.status(200).json({ success: true, student });
  } catch (err) {
    next(err);
  }
};

/**
 * Get progress logs for a student
 */
const getProgressLogs = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const logs = await studentModel.getProgressLogs(studentId);
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
    const { project_id, details } = req.body;

    if (!project_id || !details) {
      return res.status(400).json({
        success: false,
        error: "Project ID and log details are required",
      });
    }

    const logId = await studentModel.createProgressLog(
      studentId,
      project_id,
      details
    );
    res.status(201).json({ success: true, log_id: logId });
  } catch (err) {
    next(err);
  }
};

/**
 * Get progress reports for a student
 */
const getProgressReports = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const reports = await studentModel.getProgressReports(studentId);
    res.status(200).json({ success: true, reports });
  } catch (err) {
    next(err);
  }
};

/**
 * Submit a new progress report
 */
const submitProgressReport = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const { project_id, title, details } = req.body;

    if (!project_id || !title || !details) {
      return res.status(400).json({
        success: false,
        error: "Project ID, title, and report details are required",
      });
    }

    const reportId = await studentModel.createProgressReport(
      studentId,
      project_id,
      title,
      details
    );
    res.status(201).json({ success: true, report_id: reportId });
  } catch (err) {
    next(err);
  }
};

/**
 * Get available projects for selection
 */
const getAvailableProjects = async (req, res, next) => {
  try {
    const projects = await studentModel.getAvailableProjects();
    res.status(200).json({ success: true, projects });
  } catch (err) {
    next(err);
  }
};

/**
 * Select a project from available projects
 */
const selectProject = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const { project_id } = req.body;

    if (!project_id) {
      return res.status(400).json({
        success: false,
        error: "Project ID is required",
      });
    }

    const success = await studentModel.selectProject(studentId, project_id);

    if (success) {
      res.status(200).json({
        success: true,
        message: "Project selected successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Failed to select project",
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Get feedback for a student
 */
const getFeedback = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const { type, item_id } = req.query;

    if (!type || !item_id) {
      return res.status(400).json({
        success: false,
        error: "Feedback type and item ID are required",
      });
    }

    const feedback = await studentModel.getFeedback(studentId, type, item_id);
    res.status(200).json({ success: true, feedback });
  } catch (err) {
    next(err);
  }
};

/**
 * Get proposal status
 */
const getProposalStatus = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const proposalId = req.params.proposalId;

    const proposal = await proposalModel.getProposalById(proposalId);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: "Proposal not found",
      });
    }

    // Check if the proposal belongs to the student
    if (proposal.submitted_by !== parseInt(studentId)) {
      return res.status(403).json({
        success: false,
        error: "You don't have permission to view this proposal",
      });
    }

    res.status(200).json({
      success: true,
      status: proposal.status_name,
      proposal,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  listProposals,
  submitProposal,
  updateProposal,
  getStudentProfile,
  getProgressLogs,
  submitProgressLog,
  getProgressReports,
  submitProgressReport,
  getAvailableProjects,
  selectProject,
  getFeedback,
  getProposalStatus,
};
