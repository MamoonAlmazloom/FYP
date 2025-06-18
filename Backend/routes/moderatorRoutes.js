import express from "express";
import moderatorController from "../controllers/moderatorController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Apply auth middleware to all moderator routes
router.use(auth.verifyToken, auth.checkUserActive, auth.hasRole("Moderator"));

// Get moderator profile (current user)
router.get("/profile", moderatorController.getModeratorProfile);

// Get pending proposals for review
router.get("/pending-proposals", moderatorController.getPendingProposals);

// Get proposal details for review
router.get("/proposal/:proposalId", moderatorController.getProposalDetails);

// Review proposal (student proposal that's already supervisor-approved)
router.post("/review-proposal/:proposalId", moderatorController.reviewProposal);

// Review supervisor proposal (directly)
router.post(
  "/review-supervisor-proposal/:proposalId",
  moderatorController.reviewSupervisorProposal
);

// Get previous (completed) projects
router.get(
  "/:moderatorId/previous-projects",
  moderatorController.getPreviousProjects
);

export default router;
