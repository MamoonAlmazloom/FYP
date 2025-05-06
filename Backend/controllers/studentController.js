// controllers/studentController.js
import proposalModel from "../models/proposalModel.js";

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
    


    if(!title || !proposal_description) {
      return res.status(400).json({
        success: false,
        error: "Title and proposal description are required"
      });
    }

    const id = await proposalModel.createProposal(studentId , title, proposal_description);
    res.status(201).json({ success: true, project_id: id });
  } catch (err) {
    next(err);
  }
};

/**
 * Update a proposal
 */ const updateProposal = async (req, res, next) => {
   try {
    const studentId = req.params.studentId;
    const proposalId = req.params.proposalId;
    const { title, proposal_description } = req.body; 

    if(!title || !proposal_description) {
      return res.status(400).json({
        success: false,
        error: "Title and proposal description are required"
      });
    }

    const id = await proposalModel.updateProposal(proposalId, title, proposal_description);
    res.status(200).json({ success: true , project_id: id });
  } catch (err) {
    next(err);
  }
}


export default {
  listProposals,
  submitProposal,
  updateProposal
};
