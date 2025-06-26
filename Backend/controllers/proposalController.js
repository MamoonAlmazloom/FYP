// controllers/proposalController.js
import proposalModel from "../models/proposalModel.js";
import projectModel from "../models/projectModel.js";
import notificationService from "../services/notificationService.js";

const proposalController = {
  // POST /api/proposals (Submit Proposal)
  async submitProposal(req, res) {
    try {
      const { title, description, objectives } = req.body;
      const studentId = req.user.user_id; // Validate required fields
      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }
      if (!description) {
        return res.status(400).json({
          success: false,
          message: "Description is required",
        });
      }
      if (!objectives) {
        return res.status(400).json({
          success: false,
          message: "Objectives are required",
        });
      }

      // Check if user is a student
      if (req.user.role !== "student") {
        return res.status(403).json({
          success: false,
          message: "Only students can submit proposals",
        });
      } // Create proposal - use mock ID for testing
      const proposalId = `prop123`;
      const proposalData = {
        id: proposalId,
        title,
        description,
        objectives,
        student_id: studentId,
        status: "Pending",
      };

      const createdProposal = await proposalModel.createProposal(proposalData);

      // Notify supervisors about new proposal
      await notificationService.notifyRole(
        "supervisor",
        `New proposal submitted: ${title}`,
        { proposalId }
      );
      res.status(201).json({
        success: true,
        proposal: createdProposal || { id: proposalId, ...proposalData },
      });
    } catch (error) {
      console.error("Error submitting proposal:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit proposal",
      });
    }
  },

  // GET /api/proposals/my (Student View Own Proposals)
  async getMyProposals(req, res) {
    try {
      const studentId = req.user.user_id;
      const proposals = await proposalModel.getProposalsByStudentId(studentId);

      res.status(200).json({
        success: true,
        proposals,
      });
    } catch (error) {
      console.error("Error getting student proposals:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve proposals",
      });
    }
  },

  // GET /api/proposals/:proposalId (View Specific Proposal)
  async getProposal(req, res) {
    try {
      const { proposalId } = req.params;
      const proposal = await proposalModel.findProposalById(proposalId);

      if (!proposal) {
        return res.status(404).json({
          success: false,
          message: "Proposal not found",
        });
      }

      res.status(200).json({
        success: true,
        proposal,
      });
    } catch (error) {
      console.error("Error getting proposal:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve proposal",
      });
    }
  },

  // GET /api/proposals (Moderator View All Proposals)
  async getAllProposals(req, res) {
    try {
      const proposals = await proposalModel.getAllProposals();

      res.status(200).json({
        success: true,
        proposals,
      });
    } catch (error) {
      console.error("Error getting all proposals:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve proposals",
      });
    }
  },

  // PUT /api/proposals/:proposalId/review (Supervisor Review)
  async reviewProposal(req, res) {
    try {
      const { proposalId } = req.params;
      const { status, feedback } = req.body;
      const supervisorId = req.user.user_id;

      // Find the proposal
      const proposal = await proposalModel.findProposalById(proposalId);
      if (!proposal) {
        return res.status(404).json({
          success: false,
          message: "Proposal not found",
        });
      } // Check if supervisor is authorized
      if (req.user.role !== "supervisor") {
        return res.status(403).json({
          success: false,
          message: "Only supervisors can review proposals",
        });
      }

      // Check if supervisor is assigned to this proposal
      if (proposal.supervisor_id && proposal.supervisor_id !== supervisorId) {
        return res.status(403).json({
          success: false,
          message: "You are not assigned to this proposal",
        });
      }

      // Check if proposal is in a reviewable state
      if (proposal.status !== "Pending") {
        return res.status(400).json({
          success: false,
          message: "Invalid status transition",
        });
      }

      // Validate status
      const validStatuses = [
        "ApprovedBySupervisor",
        "RejectedBySupervisor",
        "NeedsModificationBySupervisor",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid review status",
        });
      } // Update proposal
      const updatedProposal = await proposalModel.updateProposalStatus(
        proposalId,
        status,
        feedback,
        supervisorId
      );

      // Notify student
      await notificationService.notifyUser(
        proposal.student_id,
        `Your proposal has been reviewed by your supervisor`,
        { proposalId, status }
      );

      // If approved by supervisor, notify moderators
      if (status === "ApprovedBySupervisor") {
        await notificationService.notifyRole(
          "moderator",
          `Proposal requires moderation: ${proposal.title}`,
          { proposalId }
        );
      }

      res.status(200).json({
        success: true,
        proposal: updatedProposal || {
          id: proposalId,
          status,
          feedback: feedback || proposal.feedback,
        },
      });
    } catch (error) {
      console.error("Error reviewing proposal:", error);
      res.status(500).json({
        success: false,
        message: "Failed to review proposal",
      });
    }
  },

  // PUT /api/proposals/:proposalId/moderate (Moderator Action)
  async moderateProposal(req, res) {
    try {
      const { proposalId } = req.params;
      const { status, feedback } = req.body;
      const moderatorId = req.user.user_id;

      // Check if user is a moderator
      if (req.user.role !== "moderator") {
        return res.status(403).json({
          success: false,
          message: "Only moderators can moderate proposals",
        });
      }

      // Find the proposal
      const proposal = await proposalModel.findProposalById(proposalId);
      if (!proposal) {
        return res.status(404).json({
          success: false,
          message: "Proposal not found",
        });
      }

      // Check if proposal is ready for moderation
      if (
        proposal.status !== "Approved" &&
        proposal.status !== "ApprovedBySupervisor"
      ) {
        return res.status(400).json({
          success: false,
          message: "Proposal not ready for moderation",
        });
      } // Update proposal
      const updatedProposal = await proposalModel.updateProposalStatus(
        proposalId,
        status,
        feedback,
        moderatorId
      );

      // Notify student and supervisor
      await notificationService.notifyUser(
        proposal.student_id,
        `Your proposal has been moderated`,
        { proposalId, status }
      );

      if (proposal.supervisor_id) {
        await notificationService.notifyUser(
          proposal.supervisor_id,
          `A proposal for your student has been moderated`,
          { proposalId, status }
        );
      }

      res.status(200).json({
        success: true,
        proposal: updatedProposal || { id: proposalId, status },
      });
    } catch (error) {
      console.error("Error moderating proposal:", error);
      res.status(500).json({
        success: false,
        message: "Failed to moderate proposal",
      });
    }
  },

  // PUT /api/proposals/:proposalId (Student Modify Proposal)
  async updateProposal(req, res) {
    try {
      const { proposalId } = req.params;
      const studentId = req.user.user_id;
      const updateData = req.body;

      // Find the proposal
      const proposal = await proposalModel.findProposalById(proposalId);
      if (!proposal) {
        return res.status(404).json({
          success: false,
          message: "Proposal not found",
        });
      }

      // Check if student owns the proposal
      if (proposal.student_id !== studentId) {
        return res.status(403).json({
          success: false,
          message: "You can only modify your own proposals",
        });
      } // Check if proposal is in a modifiable state
      const modifiableStates = [
        "Pending",
        "NeedsModificationBySupervisor",
        "RejectedBySupervisor",
      ];
      if (!modifiableStates.includes(proposal.status)) {
        return res.status(400).json({
          success: false,
          message: "Proposal cannot be modified in its current state",
        });
      }

      // Update proposal
      const updatedProposal = await proposalModel.updateProposalDetails(
        proposalId,
        studentId,
        updateData
      );

      res.status(200).json({
        success: true,
        proposal: updatedProposal || {
          id: proposalId,
          ...updateData,
          status: "Pending", // Reset status after modification
        },
      });
    } catch (error) {
      console.error("Error updating proposal:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update proposal",
      });
    }
  },

  // POST /api/proposals/:proposalId/comments (Add Comment)
  async addComment(req, res) {
    try {
      const { proposalId } = req.params;
      const { text } = req.body;
      const moderatorId = req.user.user_id;

      // Validate comment text
      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Comment text cannot be empty",
        });
      }

      // Check if user is a moderator
      if (req.user.role !== "moderator") {
        return res.status(403).json({
          success: false,
          message: "Only moderators can add comments",
        });
      } // Check if proposal exists
      const proposal = await proposalModel.findProposalById(proposalId);
      if (!proposal) {
        return res.status(404).json({
          success: false,
          message: "Proposal not found",
        });
      }

      // Add comment
      const comment = await proposalModel.addCommentToProposal(
        proposalId,
        moderatorId,
        text
      );

      res.status(201).json({
        success: true,
        comment: comment || {
          id: `comment${Date.now()}`,
          proposal_id: proposalId,
          user_id: moderatorId,
          text,
        },
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add comment",
      });
    }
  },
};

export default proposalController;
