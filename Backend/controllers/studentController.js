// controllers/studentController.js
import proposalModel from "../models/proposalModel.js";
import studentModel from "../models/studentModel.js";
import notificationModel from "../models/notificationModel.js";

/**
 * Helper function to check if student can submit new proposals
 * Students with approved proposals can still submit new proposals (for modifications)
 * but we should track this properly
 */
const canSubmitNewProposal = async (studentId) => {
  try {
    const activeProject = await studentModel.getActiveProject(studentId);

    // Student can submit new proposals if:
    // 1. They have no active project, OR
    // 2. They have an approved proposal but want to modify it (creating new one)
    return {
      canSubmit: true, // Always allow for modification workflow
      hasActiveProject: !!activeProject,
      activeProject: activeProject,
    };
  } catch (error) {
    console.error("Error checking proposal eligibility:", error);
    return { canSubmit: false, hasActiveProject: false, activeProject: null };
  }
};

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
    const { title, description, type, specialization, outcome, submitted_to } =
      req.body;

    if (
      !title ||
      !description ||
      !type ||
      !specialization ||
      !outcome ||
      !submitted_to
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Title, description, type, specialization, outcome, and submitted_to are required",
      });
    }

    // Check if student already has an active project
    const hasActive = await studentModel.hasActiveProject(studentId);
    if (hasActive) {
      return res.status(400).json({
        success: false,
        error:
          "You already have an active project. You can only have one active project at a time.",
      });
    }

    // Validate type enum
    if (!["Research", "Application", "Both"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Type must be one of: Research, Application, Both",
      });
    }

    const proposalId = await proposalModel.createProposal(
      studentId,
      title,
      description,
      type,
      specialization,
      outcome,
      submitted_to
    );

    // Create notification for the supervisor
    await notificationModel.notifyForProposalEvent(
      proposalId,
      "proposal_submitted"
    );

    res.status(201).json({ success: true, proposal_id: proposalId });
  } catch (err) {
    next(err);
  }
};

/**
 * Update a proposal - NEW BUSINESS LOGIC:
 * If proposal is approved, create a new proposal instead of updating existing one
 */
const updateProposal = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const proposalId = req.params.proposalId;
    const { title, description, type, specialization, outcome } = req.body;

    if (!title || !description || !type || !specialization || !outcome) {
      return res.status(400).json({
        success: false,
        error:
          "Title, description, type, specialization, and outcome are required",
      });
    }

    // Validate type enum
    if (!["Research", "Application", "Both"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Type must be one of: Research, Application, Both",
      });
    }

    // Verify the proposal belongs to the student
    const proposal = await proposalModel.getProposalById(proposalId);
    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: "Proposal not found",
      });
    }

    if (proposal.submitted_by !== parseInt(studentId)) {
      return res.status(403).json({
        success: false,
        error: "You don't have permission to update this proposal",
      });
    }

    // NEW BUSINESS LOGIC: Check if proposal is approved
    const approvedStatuses = ["Approved", "Supervisor_Approved"];
    const isApproved = approvedStatuses.includes(proposal.status_name);

    if (isApproved) {
      // If approved, create a NEW proposal instead of updating existing one
      const newProposalId = await proposalModel.createProposal(
        studentId,
        title,
        description,
        type,
        specialization,
        outcome,
        proposal.submitted_to // Same supervisor
      );

      // Notify supervisor about the NEW proposal submission
      await notificationModel.notifyForProposalEvent(
        newProposalId,
        "proposal_submitted"
      );

      res.status(201).json({
        success: true,
        message:
          "New proposal created successfully. Your previous approved proposal remains unchanged.",
        proposal_id: newProposalId,
        isNewProposal: true,
        previousProposalId: proposalId,
      });
    } else {
      // If not approved, update the existing proposal as before
      const success = await proposalModel.updateProposal(
        proposalId,
        title,
        description,
        type,
        specialization,
        outcome
      );

      if (success) {
        // Notify supervisor about the modified proposal
        await notificationModel.notifyForProposalEvent(
          proposalId,
          "proposal_modified"
        );

        res.status(200).json({
          success: true,
          message: "Proposal updated successfully",
          isNewProposal: false,
        });
      } else {
        res.status(400).json({
          success: false,
          error: "Failed to update proposal",
        });
      }
    }
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

    // Notify supervisor about the new progress log (don't let notification errors break the main flow)
    try {
      await notificationModel.notifyProgressSubmissionToSupervisor(
        "log",
        logId,
        parseInt(studentId),
        project_id
      );
    } catch (notificationError) {
      console.error(
        "Failed to send progress log notification:",
        notificationError
      );
      // Continue without failing the main request
    }

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
    const { startDate, endDate } = req.query;

    const reports = await studentModel.getProgressReports(
      studentId,
      startDate,
      endDate
    );
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

    // Notify supervisor about the new progress report (don't let notification errors break the main flow)
    try {
      await notificationModel.notifyProgressSubmissionToSupervisor(
        "report",
        reportId,
        parseInt(studentId),
        project_id
      );
    } catch (notificationError) {
      console.error(
        "Failed to send progress report notification:",
        notificationError
      );
      // Continue without failing the main request
    }

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

    // Check if student already has an active project
    const hasActive = await studentModel.hasActiveProject(studentId);
    if (hasActive) {
      return res.status(400).json({
        success: false,
        error:
          "You already have an active project. You can only have one active project at a time.",
      });
    }

    const proposalId = await studentModel.selectProject(studentId, project_id);

    if (proposalId) {
      // Notify supervisor about the new proposal
      await notificationModel.notifyForProposalEvent(
        proposalId,
        "proposal_submitted"
      );

      res.status(200).json({
        success: true,
        message:
          "Project application submitted successfully. Waiting for supervisor approval.",
        proposalId: proposalId,
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
      proposal,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get student's projects
 */
const getStudentProjects = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;

    // Get projects from the database
    const projects = await studentModel.getStudentProjects(studentId);

    res.status(200).json({ success: true, projects });
  } catch (err) {
    next(err);
  }
};

/**
 * Get student's active project status
 */
const getActiveProject = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const activeProject = await studentModel.getActiveProject(studentId);

    res.status(200).json({
      success: true,
      hasActiveProject: !!activeProject,
      activeProject: activeProject,
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
  getStudentProjects,
  getActiveProject,
  canSubmitNewProposal, // Export the new helper function
};
