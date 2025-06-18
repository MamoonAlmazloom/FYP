import proposalModel from "../models/proposalModel.js";
import notificationModel from "../models/notificationModel.js";
import pool from "../db.js";

/**
 * Get pending proposals for moderator review
 */
const getPendingProposals = async (req, res, next) => {
  try {
    // Get proposals with Supervisor_Approved status
    const [proposals] = await pool.query(
      `SELECT p.proposal_id, p.title, p.submitted_by, p.submitted_to,
              u.name AS submitter_name,
              sv.name AS supervisor_name
       FROM proposal p
       JOIN proposal_status ps ON p.status_id = ps.status_id
       JOIN user u ON p.submitted_by = u.user_id
       LEFT JOIN user sv ON p.submitted_to = sv.user_id
       WHERE ps.status_name = 'Supervisor_Approved'
       ORDER BY p.proposal_id DESC`
    );

    res.status(200).json({ success: true, proposals });
  } catch (err) {
    next(err);
  }
};

/**
 * Review proposal as moderator
 */
const reviewProposal = async (req, res, next) => {
  try {
    const proposalId = parseInt(req.params.proposalId);
    const { decision, comments } = req.body;
    const moderatorId = req.user.id; // Get from authenticated user (using 'id' not 'user_id')

    if (!["approve", "reject", "modify"].includes(decision)) {
      return res.status(400).json({
        success: false,
        error: "Decision must be 'approve', 'reject', or 'modify'",
      });
    }

    // Get proposal details
    const proposal = await proposalModel.getProposalWithStatus(proposalId);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: "Proposal not found",
      });
    }

    // Check if proposal has been approved by supervisor
    if (proposal.status_name !== "Supervisor_Approved") {
      return res.status(400).json({
        success: false,
        error:
          "Proposal must be approved by supervisor before moderator review",
      });
    }

    // Update status based on decision
    let statusName;
    switch (decision) {
      case "approve":
        statusName = "Approved";
        break;
      case "reject":
        statusName = "Rejected";
        break;
      case "modify":
        statusName = "Modifications_Required";
        break;
    }

    await proposalModel.updateProposalStatus(proposalId, statusName);

    // Add feedback if provided
    if (comments) {
      await pool.query(
        `INSERT INTO Feedback (proposal_id, reviewer_id, comments)
         VALUES (?, ?, ?)`,
        [proposalId, moderatorId, comments]
      );
    } // Create notification based on decision
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

    // Notify the submitter about the decision
    await notificationModel.notifyForProposalEvent(proposalId, eventType);

    // If approved, create project
    if (decision === "approve") {
      const projectId = await proposalModel.createProjectFromProposal(
        proposalId
      );

      return res.status(200).json({
        success: true,
        message: "Proposal approved and project created successfully",
        projectId,
      });
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
 * Review supervisor proposal directly (no supervisor approval needed)
 */
const reviewSupervisorProposal = async (req, res, next) => {
  try {
    const proposalId = parseInt(req.params.proposalId);
    const { decision, comments } = req.body;
    const moderatorId = req.user.user_id; // Get from authenticated user

    if (!["approve", "reject", "modify"].includes(decision)) {
      return res.status(400).json({
        success: false,
        error: "Decision must be 'approve', 'reject', or 'modify'",
      });
    }

    // Get proposal details
    const proposal = await proposalModel.getProposalWithStatus(proposalId);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        error: "Proposal not found",
      });
    }

    // Check if the submitter is a supervisor
    const [userRoles] = await pool.query(
      `SELECT r.role_name
       FROM user_roles ur
       JOIN role r ON ur.role_id = r.role_id
       WHERE ur.user_id = ?`,
      [proposal.submitted_by]
    );

    const isSupervisor = userRoles.some(
      (role) => role.role_name === "Supervisor"
    );

    if (!isSupervisor) {
      return res.status(400).json({
        success: false,
        error: "This proposal was not submitted by a supervisor",
      });
    }

    // Update status based on decision
    let statusName;
    switch (decision) {
      case "approve":
        statusName = "Approved";
        break;
      case "reject":
        statusName = "Rejected";
        break;
      case "modify":
        statusName = "Modifications_Required";
        break;
    }

    await proposalModel.updateProposalStatus(proposalId, statusName);

    // Add feedback if provided
    if (comments) {
      await pool.query(
        `INSERT INTO feedback (proposal_id, reviewer_id, comments)
         VALUES (?, ?, ?)`,
        [proposalId, moderatorId, comments]
      );
    }

    // If approved, create project
    if (decision === "approve") {
      const projectId = await proposalModel.createProjectFromProposal(
        proposalId
      );

      return res.status(200).json({
        success: true,
        message:
          "Supervisor proposal approved and project created successfully",
        projectId,
      });
    }

    res.status(200).json({
      success: true,
      message: `Supervisor proposal ${
        decision === "modify" ? "sent back for modification" : decision + "d"
      } successfully`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get proposal details for moderator review
 */
const getProposalDetails = async (req, res, next) => {
  try {
    const proposalId = parseInt(req.params.proposalId); // Get detailed proposal information
    const [proposals] = await pool.query(
      `SELECT p.proposal_id, p.title, p.proposal_description, p.type, 
              p.specialization, p.outcome, p.submitted_by, p.submitted_to,
              u.name AS submitter_name, u.email AS submitter_email,
              sv.name AS supervisor_name, sv.email AS supervisor_email,
              ps.status_name
       FROM proposal p
       JOIN proposal_status ps ON p.status_id = ps.status_id
       JOIN user u ON p.submitted_by = u.user_id
       LEFT JOIN user sv ON p.submitted_to = sv.user_id
       WHERE p.proposal_id = ?`,
      [proposalId]
    );

    if (proposals.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Proposal not found",
      });
    }

    const proposal = proposals[0];

    // Get any existing feedback for this proposal
    const [feedback] = await pool.query(
      `SELECT f.comments, f.created_at,
              u.name AS reviewer_name
       FROM feedback f
       JOIN user u ON f.reviewer_id = u.user_id
       WHERE f.proposal_id = ?
       ORDER BY f.created_at DESC`,
      [proposalId]
    );

    res.status(200).json({
      success: true,
      proposal: {
        id: proposal.proposal_id,
        title: proposal.title,
        description: proposal.proposal_description,
        type: proposal.type,
        specialization: proposal.specialization,
        outcome: proposal.outcome,
        status: proposal.status_name,
        submitter: {
          id: proposal.submitted_by,
          name: proposal.submitter_name,
          email: proposal.submitter_email,
        },
        supervisor: {
          id: proposal.submitted_to,
          name: proposal.supervisor_name,
          email: proposal.supervisor_email,
        },
        feedback: feedback.map((f) => ({
          comments: f.comments,
          reviewerName: f.reviewer_name,
          createdAt: f.created_at,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get moderator profile
 */
const getModeratorProfile = async (req, res, next) => {
  try {
    const moderatorId = req.user.id; // Get from authenticated user (using 'id' not 'user_id')

    const [moderators] = await pool.query(
      `SELECT u.user_id, u.name, u.email, u.is_active
       FROM user u
       JOIN user_roles ur ON u.user_id = ur.user_id
       JOIN role r ON ur.role_id = r.role_id
       WHERE u.user_id = ? AND r.role_name = 'Moderator'`,
      [moderatorId]
    );

    if (moderators.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Moderator not found",
      });
    }

    const moderator = moderators[0];

    res.status(200).json({
      success: true,
      moderator: {
        id: moderator.user_id,
        name: moderator.name,
        email: moderator.email,
        isActive: moderator.is_active,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all previous (completed) projects
 */
const getPreviousProjects = async (req, res, next) => {
  try {
    const [projects] = await pool.query(
      `SELECT DISTINCT p.project_id as id, p.title, p.description,
              u.name as student_name, pr.proposal_id,
              sv.name as supervisor_name,
              ex.name as examiner_name,
              ea.status as examination_status
       FROM project p
       JOIN proposal pr ON p.project_id = pr.project_id
       JOIN user u ON pr.submitted_by = u.user_id
       JOIN proposal_status ps ON pr.status_id = ps.status_id
       LEFT JOIN supervisor_project sp ON p.project_id = sp.project_id
       LEFT JOIN user sv ON sp.supervisor_id = sv.user_id
       LEFT JOIN examiner_assignment ea ON p.project_id = ea.project_id
       LEFT JOIN user ex ON ea.examiner_id = ex.user_id
       WHERE ps.status_name = 'Approved' AND ea.status = 'Evaluated'
       ORDER BY p.project_id DESC`
    );

    res.status(200).json({ success: true, projects });
  } catch (err) {
    next(err);
  }
};

export default {
  getPendingProposals,
  reviewProposal,
  reviewSupervisorProposal,
  getProposalDetails,
  getModeratorProfile,
  getPreviousProjects,
};
