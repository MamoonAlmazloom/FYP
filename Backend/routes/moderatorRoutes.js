
import express from "express";
import moderatorController from "../controllers/moderatorController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Apply auth middleware to all moderator routes
router.use(auth.verifyToken, auth.hasRole("Moderator"));

// Get pending proposals for review
router.get(
  "/:moderatorId/pending-proposals",
  moderatorController.getPendingProposals
);

// Review proposal (student proposal that's already supervisor-approved)
router.post(
  "/:moderatorId/review-proposal/:proposalId",
  moderatorController.reviewProposal
);

// Review supervisor proposal (directly)
router.post(
  "/:moderatorId/review-supervisor-proposal/:proposalId",
  moderatorController.reviewSupervisorProposal
);

export default router;
