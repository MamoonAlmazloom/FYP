// controllers/studentController.js
import proposalModel from "../models/proposalModel.js";
import projectModel from "../models/projectModel.js";
import progressModel from "../models/progressModel.js";

const listProposals = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const proposals = await proposalModel.getProposalsByStudent(studentId);
    res.json({ proposals });
  } catch (err) {
    next(err);
  }
};

const submitProposal = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const { projectId } = req.body;
    const id = await proposalModel.createProposal(studentId, projectId);
    res.status(201).json({ proposalId: id });
  } catch (err) {
    next(err);
  }
};

const modifyProposal = async (req, res, next) => {
  try {
    const { proposalId, studentId } = req.params;
    const { projectId } = req.body;
    const updated = await proposalModel.updateProposal(proposalId, projectId);
    if (!updated) return res.status(404).send("Proposal not found");
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const listApprovedProjects = async (req, res, next) => {
  try {
    const projects = await projectModel.getApprovedProjects();
    res.json({ projects });
  } catch (err) {
    next(err);
  }
};

const selectApprovedProject = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const projectId = req.params.projectId;
    const assignmentId = await projectModel.selectProject(studentId, projectId);
    res.status(201).json({ assignmentId });
  } catch (err) {
    next(err);
  }
};

const listProgressLogs = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const logs = await progressModel.getProgressLogs(studentId);
    res.json({ logs });
  } catch (err) {
    next(err);
  }
};

const submitProgressLog = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;
    const { projectId, submissionDate } = req.body;
    const logId = await progressModel.createProgressLog(
      studentId,
      projectId,
      submissionDate
    );
    res.status(201).json({ logId });
  } catch (err) {
    next(err);
  }
};

export default {
  listProposals,
  submitProposal,
  modifyProposal,
  listApprovedProjects,
  selectApprovedProject,
  listProgressLogs,
  submitProgressLog,
};