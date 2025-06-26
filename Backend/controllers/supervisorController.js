// controllers/supervisorController.js
import supervisorModel from "../models/supervisorModel.js";
import proposalModel from "../models/proposalModel.js";
import studentModel from "../models/studentModel.js";
import notificationModel from "../models/notificationModel.js";
import pool from "../db.js";

/**
 * Get students under supervision
 */
const getStudents = async (req, res, next) => {
  try {
    const supervisorId = req.params.supervisorId;
    const activeOnly = req.query.active === "true";

    const students = await supervisorModel.getStudentsBySupervisor(
      supervisorId,
      activeOnly
    );
    res.status(200).json({ success: true, students });
  } catch (err) {
    next(err);
  }
};

/**
 * Get students under supervision (token-based)
 */
const getMyStudents = async (req, res, next) => {
  try {
    // Check if user is a supervisor
    if (!req.user.roles || !req.user.roles.includes("supervisor")) {
      return res.status(403).json({
        success: false,
        error: "Access denied. Supervisor role required.",
      });
    }

    const supervisorId = req.user.id; // Get from token
    const activeOnly = req.query.active === "true";

    const students = await supervisorModel.getStudentsBySupervisor(
      supervisorId,
      activeOnly
    );
    res.status(200).json({ success: true, students });
  } catch (err) {
    next(err);
  }
};

/**
 * View project proposals
 */
const viewProjectProposals = async (req, res, next) => {
  try {
    const supervisorId = req.params.supervisorId;
    const proposals = await supervisorModel.getProposalsBySupervisor(
      supervisorId
    );
    res.status(200).json({ success: true, proposals });
  } catch (err) {
    next(err);
  }
};

/**
 * Get supervisor's own proposals
 */
const getSupervisorOwnProposals = async (req, res, next) => {
  try {
    const supervisorId = req.params.supervisorId;
    const proposals = await supervisorModel.getSupervisorOwnProposals(
      supervisorId
    );
    res.status(200).json({ success: true, proposals });
  } catch (err) {
    next(err);
  }
};

/**
 * Get proposal details
 */
const getProposalDetails = async (req, res, next) => {
  try {
    const proposalId = req.params.proposalId;
    const proposal = await proposalModel.getProposalById(proposalId);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: "Proposal not found",
      });
    }

    res.status(200).json({ success: true, proposal });
  } catch (err) {
    next(err);
  }
};

/**
 * Submit proposal decision
 */
const submitProposalDecision = async (req, res, next) => {
  try {
    const supervisorId = req.params.supervisorId;
    const proposalId = req.params.proposalId;
    const { decision, comments } = req.body;

    if (!["approve", "reject", "modify"].includes(decision)) {
      return res.status(400).json({
        success: false,
        error: "Invalid decision. Must be 'approve', 'reject', or 'modify'",
      });
    }

    // Get the proposal to check if it exists and was submitted to this supervisor
    const [proposalRows] = await pool.query(
      `SELECT * FROM Proposal WHERE proposal_id = ? AND submitted_to = ?`,
      [proposalId, supervisorId]
    );

    if (proposalRows.length === 0) {
      return res.status(403).json({
        success: false,
        error: "You don't have permission to make decisions on this proposal",
      });
    } // Map decision to status name
    let statusName;
    switch (decision) {
      case "approve":
        statusName = "Supervisor_Approved";
        break;
      case "reject":
        statusName = "Supervisor_Rejected";
        break;
      case "modify":
        statusName = "Modifications_Required";
        break;
    }

    // Update the proposal status
    await proposalModel.updateProposalStatus(proposalId, statusName);

    // Add feedback if comments are provided
    if (comments) {
      await supervisorModel.provideFeedback(proposalId, supervisorId, comments);
    }

    res.status(200).json({
      success: true,
      message: `Proposal ${
        decision === "modify" ? "sent back for modification" : decision + "d"
      } successfully`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get student details
 */
const getStudentDetails = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const student = await studentModel.getStudentById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    // Get student's project
    const projects = await supervisorModel.getStudentProjects(studentId);

    res.status(200).json({
      success: true,
      student,
      projects,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get student logs
 */
const getStudentLogs = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const { startDate, endDate } = req.query;

    // Get student logs
    const logs = await supervisorModel.getStudentLogs(
      studentId,
      startDate,
      endDate
    );

    // Get student information
    const student = await studentModel.getStudentById(studentId);

    res.status(200).json({
      success: true,
      logs,
      student: student
        ? {
            id: student.id,
            name: student.name,
            email: student.email,
          }
        : null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Provide feedback on logs
 */
const provideFeedbackOnLog = async (req, res, next) => {
  try {
    const supervisorId = req.params.supervisorId;
    const logId = req.params.logId;
    const { comments } = req.body;

    if (!comments) {
      return res.status(400).json({
        success: false,
        error: "Feedback comments are required",
      });
    }
    const feedbackId = await supervisorModel.provideFeedbackOnLog(
      logId,
      supervisorId,
      comments
    );

    // Notify student about new feedback on their log
    await notificationModel.notifyForFeedbackEvent(feedbackId);

    res.status(200).json({
      success: true,
      message: "Feedback provided successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get student reports
 */
const getStudentReports = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const { startDate, endDate } = req.query;

    // Get student reports
    const reports = await supervisorModel.getStudentReports(
      studentId,
      startDate,
      endDate
    );

    // Get student information
    const student = await studentModel.getStudentById(studentId);

    res.status(200).json({
      success: true,
      reports,
      student: student
        ? {
            id: student.id,
            name: student.name,
            email: student.email,
          }
        : null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Provide feedback on reports
 */
const provideFeedbackOnReport = async (req, res, next) => {
  try {
    const supervisorId = req.params.supervisorId;
    const reportId = req.params.reportId;
    const { comments } = req.body;

    if (!comments) {
      return res.status(400).json({
        success: false,
        error: "Feedback comments are required",
      });
    }
    const feedbackId = await supervisorModel.provideFeedbackOnReport(
      reportId,
      supervisorId,
      comments
    );

    // Notify student about new feedback on their report
    await notificationModel.notifyForFeedbackEvent(feedbackId);

    res.status(200).json({
      success: true,
      message: "Feedback provided successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get previous projects archive
 */
const getPreviousProjects = async (req, res, next) => {
  try {
    const supervisorId = req.params.supervisorId;
    const projects = await supervisorModel.getPreviousProjects(supervisorId);
    res.status(200).json({ success: true, projects });
  } catch (err) {
    next(err);
  }
};

/**
 * Get project details
 */
const getProjectDetails = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const project = await supervisorModel.getProjectById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    res.status(200).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

/**
 * Propose a new project
 */
const proposeProject = async (req, res, next) => {
  try {
    const supervisorId = req.params.supervisorId;
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

    const proposalId = await supervisorModel.createProposal(
      supervisorId,
      title,
      description,
      type,
      specialization,
      outcome
    );
    res.status(201).json({ success: true, proposal_id: proposalId });
  } catch (err) {
    next(err);
  }
};

/**
 * Get supervisor's proposal
 */
const getSupervisorProposal = async (req, res, next) => {
  try {
    const supervisorId = req.params.supervisorId;
    const proposalId = req.params.proposalId;

    const proposal = await supervisorModel.getSupervisorProposal(
      supervisorId,
      proposalId
    );

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: "Proposal not found",
      });
    }

    res.status(200).json({ success: true, proposal });
  } catch (err) {
    next(err);
  }
};

/**
 * Update proposal
 */
const updateProposal = async (req, res, next) => {
  try {
    const supervisorId = req.params.supervisorId;
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

    // Verify the proposal belongs to the supervisor
    const proposal = await supervisorModel.getSupervisorProposal(
      supervisorId,
      proposalId
    );

    if (!proposal) {
      return res.status(403).json({
        success: false,
        error: "You don't have permission to update this proposal",
      });
    }

    await proposalModel.updateProposal(
      proposalId,
      title,
      description,
      type,
      specialization,
      outcome
    );
    res
      .status(200)
      .json({ success: true, message: "Proposal updated successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * Review student proposal
 */
const reviewStudentProposal = async (req, res, next) => {
  try {
    const supervisorId = parseInt(req.params.supervisorId);
    const proposalId = parseInt(req.params.proposalId);
    const { decision, comments } = req.body;

    if (!["approve", "reject", "modify"].includes(decision)) {
      return res.status(400).json({
        success: false,
        error: "Decision must be 'approve', 'reject', or 'modify'",
      });
    } // Get proposal details
    const proposal = await proposalModel.getProposalWithStatus(proposalId);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: "Proposal not found",
      });
    }

    // Check if this supervisor is the assigned reviewer
    if (parseInt(proposal.submitted_to) !== supervisorId) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to review this proposal",
      });
    }

    // Update status based on decision
    let statusName;
    switch (decision) {
      case "approve":
        statusName = "Supervisor_Approved";
        break;
      case "reject":
        statusName = "Supervisor_Rejected";
        break;
      case "modify":
        statusName = "Modifications_Required";
        break;
    }
    await proposalModel.updateProposalStatus(proposalId, statusName);

    // Add feedback if provided
    if (comments) {
      await supervisorModel.provideFeedback(proposalId, supervisorId, comments);
    }

    // Create notifications based on the decision
    let eventType;
    switch (decision) {
      case "approve":
        eventType = "proposal_approved";
        break;
      case "reject":
        eventType = "proposal_rejected";
        break;
      case "modify":
        eventType = "proposal_needs_modification";
        break;
    }

    // Notify the submitter of the proposal
    await notificationModel.notifyForProposalEvent(proposalId, eventType);

    res.status(200).json({
      success: true,
      message: `Proposal ${
        decision === "modify" ? "sent back for modification" : decision + "d"
      } successfully`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all supervisors
 */
const getAllSupervisors = async (req, res, next) => {
  try {
    const supervisors = await supervisorModel.getAllSupervisors();
    res.status(200).json({ success: true, supervisors });
  } catch (err) {
    next(err);
  }
};

export default {
  getStudents,
  getMyStudents,
  viewProjectProposals,
  getProposalDetails,
  submitProposalDecision,
  getStudentDetails,
  getStudentLogs,
  provideFeedbackOnLog,
  getStudentReports,
  provideFeedbackOnReport,
  getPreviousProjects,
  getProjectDetails,
  proposeProject,
  getSupervisorProposal,
  updateProposal,
  reviewStudentProposal,
  getAllSupervisors,
  getSupervisorOwnProposals,
};
