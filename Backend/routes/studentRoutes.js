// routes/studentRoutes.js
import express from "express";
import studentController from "../controllers/studentController.js";

const router = express.Router();

router.get("/:studentId/proposals", studentController.listProposals);

router.post("/:studentId/proposals", studentController.submitProposal);

router.put("/:studentId/proposals/:proposalId", studentController.updateProposal);




export default router;
