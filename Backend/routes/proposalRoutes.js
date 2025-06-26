// routes/proposalRoutes.js
import express from "express";
import proposalController from "../controllers/proposalController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// POST /api/proposals (Submit Proposal)
router.post("/", proposalController.submitProposal);

// GET /api/proposals/my (Student View Own Proposals)
router.get("/my", proposalController.getMyProposals);

// GET /api/proposals/:proposalId (View Specific Proposal)
router.get("/:proposalId", proposalController.getProposal);

// GET /api/proposals (Moderator View All Proposals)
router.get("/", proposalController.getAllProposals);

// PUT /api/proposals/:proposalId/review (Supervisor Review)
router.put("/:proposalId/review", proposalController.reviewProposal);

// PUT /api/proposals/:proposalId/moderate (Moderator Action)
router.put("/:proposalId/moderate", proposalController.moderateProposal);

// PUT /api/proposals/:proposalId (Student Modify Proposal)
router.put("/:proposalId", proposalController.updateProposal);

// POST /api/proposals/:proposalId/comments (Add Comment)
router.post("/:proposalId/comments", proposalController.addComment);

export default router;
