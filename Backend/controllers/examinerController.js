// controllers/examinerController.js
import examinerModel from "../models/examinerModel.js";
import notificationModel from "../models/notificationModel.js";

/**
 * Get all projects assigned to an examiner
 */
const getAssignedProjects = async (req, res, next) => {
  try {
    const examinerId = req.params.examinerId;
    const projects = await examinerModel.getAssignedProjects(examinerId);
    res.status(200).json({ success: true, projects });
  } catch (err) {
    next(err);
  }
};

/**
 * Get specific project details
 */
const getProjectDetails = async (req, res, next) => {
  try {
    const examinerId = req.params.examinerId;
    const projectId = req.params.projectId;
    const project = await examinerModel.getProjectById(projectId, examinerId);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found or not assigned to you",
      });
    }

    res.status(200).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

/**
 * Get project submission
 */
const getProjectSubmission = async (req, res, next) => {
  try {
    const examinerId = req.params.examinerId;
    const projectId = req.params.projectId;
    const submission = await examinerModel.getProjectSubmission(
      projectId,
      examinerId
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: "Submission not found or project not assigned to you",
      });
    }

    res.status(200).json({ success: true, submission });
  } catch (err) {
    next(err);
  }
};

/**
 * Provide examination feedback and grade
 */
const provideExaminationFeedback = async (req, res, next) => {
  try {
    const examinerId = req.params.examinerId;
    const projectId = req.params.projectId;
    const { feedback, grade } = req.body;

    if (!feedback || grade === undefined) {
      return res.status(400).json({
        success: false,
        error: "Feedback and grade are required",
      });
    }

    if (grade < 0 || grade > 100) {
      return res.status(400).json({
        success: false,
        error: "Grade must be between 0 and 100",
      });
    }
    try {
      const evaluationId = await examinerModel.createEvaluation(
        examinerId,
        projectId,
        feedback,
        grade
      );

      // Notify student about project evaluation
      const evaluationResult = grade >= 60 ? "Pass" : "Fail"; // Assuming 60 is passing grade
      await notificationModel.notifyProjectEvaluation(
        projectId,
        parseInt(examinerId),
        evaluationResult,
        grade
      );

      res.status(201).json({
        success: true,
        message: "Examination feedback provided successfully",
        evaluation_id: evaluationId,
      });
    } catch (error) {
      if (error.message.includes("only evaluate projects assigned to you")) {
        return res.status(403).json({
          success: false,
          error: "You can only evaluate projects assigned to you",
        });
      }
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Update examination feedback
 */
const updateExaminationFeedback = async (req, res, next) => {
  try {
    const examinerId = req.params.examinerId;
    const projectId = req.params.projectId;
    const { feedback, grade } = req.body;

    if (!feedback || grade === undefined) {
      return res.status(400).json({
        success: false,
        error: "Feedback and grade are required",
      });
    }

    if (grade < 0 || grade > 100) {
      return res.status(400).json({
        success: false,
        error: "Grade must be between 0 and 100",
      });
    }

    const success = await examinerModel.updateEvaluation(
      examinerId,
      projectId,
      feedback,
      grade
    );

    if (!success) {
      return res.status(404).json({
        success: false,
        error: "Evaluation not found or you don't have permission to update it",
      });
    }

    res.status(200).json({
      success: true,
      message: "Examination feedback updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get examiner profile
 */
const getExaminerProfile = async (req, res, next) => {
  try {
    const examinerId = req.params.examinerId;
    const profile = await examinerModel.getExaminerProfile(examinerId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Examiner profile not found",
      });
    }

    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all previous evaluations
 */
const getPreviousEvaluations = async (req, res, next) => {
  try {
    const examinerId = req.params.examinerId;
    const evaluations = await examinerModel.getEvaluationsByExaminer(
      examinerId
    );
    res.status(200).json({ success: true, evaluations });
  } catch (err) {
    next(err);
  }
};

/**
 * Get evaluation statistics
 */
const getEvaluationStatistics = async (req, res, next) => {
  try {
    const examinerId = req.params.examinerId;
    const statistics = await examinerModel.getEvaluationStatistics(examinerId);
    res.status(200).json({ success: true, statistics });
  } catch (err) {
    next(err);
  }
};

/**
 * Schedule examination date
 */
const scheduleExamination = async (req, res, next) => {
  try {
    const examinerId = req.params.examinerId;
    const projectId = req.params.projectId;
    const { examination_date, venue } = req.body;

    if (!examination_date || !venue) {
      return res.status(400).json({
        success: false,
        error: "Examination date and venue are required",
      });
    }

    const scheduleId = await examinerModel.scheduleExamination(
      examinerId,
      projectId,
      examination_date,
      venue
    );

    res.status(201).json({
      success: true,
      message: "Examination scheduled successfully",
      schedule_id: scheduleId,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get scheduled examinations
 */
const getScheduledExaminations = async (req, res, next) => {
  try {
    const examinerId = req.params.examinerId;
    const schedules = await examinerModel.getScheduledExaminations(examinerId);
    res.status(200).json({ success: true, schedules });
  } catch (err) {
    next(err);
  }
};

/**
 * Request extension for evaluation
 */
const requestExtension = async (req, res, next) => {
  try {
    const examinerId = req.params.examinerId;
    const projectId = req.params.projectId;
    const { reason, requested_days } = req.body;

    if (!reason || !requested_days) {
      return res.status(400).json({
        success: false,
        error: "Reason and requested days are required",
      });
    }

    const requestId = await examinerModel.requestExtension(
      examinerId,
      projectId,
      reason,
      requested_days
    );

    res.status(201).json({
      success: true,
      message: "Extension request submitted successfully",
      request_id: requestId,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update project examination status
 */
const updateProjectStatus = async (req, res, next) => {
  try {
    const examinerId = req.params.examinerId;
    const projectId = req.params.projectId;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status is required",
      });
    }

    const updated = await examinerModel.updateProjectStatus(
      examinerId,
      projectId,
      status
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Project not found or not assigned to you",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project status updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getAssignedProjects,
  getProjectDetails,
  getProjectSubmission,
  provideExaminationFeedback,
  updateExaminationFeedback,
  getExaminerProfile,
  getPreviousEvaluations,
  getEvaluationStatistics,
  scheduleExamination,
  getScheduledExaminations,
  requestExtension,
  updateProjectStatus,
};
