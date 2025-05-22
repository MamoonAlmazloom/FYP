import proposalModel from "../models/proposalModel.js";
import notificationModel from "../models/notificationModel.js";
import pool from "../db.js";

/**
 * Get pending proposals for moderator review
 */
const getPendingProposals = async (req, res, next) => {
  try {
    const moderatorId = parseInt(req.params.moderatorId);

    // Get proposals with Supervisor_Approved status
    const [proposals] = await pool.query(
      `SELECT p.proposal_id, p.title, p.submitted_by, p.submitted_to,
              u.name AS submitter_name,
              sv.name AS supervisor_name
       FROM Proposal p
       JOIN Proposal_Status ps ON p.status_id = ps.status_id
       JOIN User u ON p.submitted_by = u.user_id
       LEFT JOIN User sv ON p.submitted_to = sv.user_id
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
    const moderatorId = parseInt(req.params.moderatorId);
    const proposalId = parseInt(req.params.proposalId);
    const { decision, comments } = req.body;

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
    const moderatorId = parseInt(req.params.moderatorId);
    const proposalId = parseInt(req.params.proposalId);
    const { decision, comments } = req.body;

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
       FROM User_Roles ur
       JOIN Role r ON ur.role_id = r.role_id
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
        `INSERT INTO Feedback (proposal_id, reviewer_id, comments)
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

export default {
  getPendingProposals,
  reviewProposal,
  reviewSupervisorProposal,
};
