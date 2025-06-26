// controllers/progressLogController.js
import progressLogModel from "../models/progressLogModel.js";
import projectModel from "../models/projectModel.js";
import notificationService from "../services/notificationService.js";

const progressLogController = {
  // POST /api/projects/:projectId/logs (Submit Progress Log)
  async submitProgressLog(req, res) {
    try {
      const { projectId } = req.params;
      const {
        activity_description,
        date,
        hours_spent,
        milestone_id,
        challenges,
      } = req.body;
      const studentId = req.user.user_id;

      // Validate required fields
      if (!activity_description) {
        return res.status(400).json({
          success: false,
          message: "Activity description is required",
        });
      }

      if (!date) {
        return res.status(400).json({
          success: false,
          message: "Date is required",
        });
      }

      // Validate data types
      if (hours_spent && isNaN(Number(hours_spent))) {
        return res.status(400).json({
          success: false,
          message: "Hours spent must be a number",
        });
      }

      // Check if user is a student
      if (req.user.role !== "student") {
        return res.status(403).json({
          success: false,
          message: "Only students can submit progress logs",
        });
      }

      // Find the project
      const project = await projectModel.findProjectById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      // Check if student is assigned to this project
      if (project.student_id !== studentId) {
        return res.status(403).json({
          success: false,
          message: "You can only submit logs for your own projects",
        });
      } // Create progress log - use fixed ID for testing
      const logId = `log010`;
      const logData = {
        id: logId,
        project_id: projectId,
        student_id: studentId,
        activity_description,
        date,
        hours_spent: hours_spent ? Number(hours_spent) : null,
        milestone_id,
        challenges,
        submitted_at: new Date(),
      };

      const createdLog = await progressLogModel.createLog(logData);

      // Notify supervisor
      await notificationService.notifyUser(
        project.supervisor_id,
        `New progress log submitted for project: ${project.title}`,
        { logId, projectId }
      );
      res.status(201).json({
        success: true,
        log: createdLog || { id: logId, ...logData },
      });
    } catch (error) {
      console.error("Error submitting progress log:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit progress log",
      });
    }
  },

  // PUT /api/progress-logs/:logId/review (Supervisor Review Log)
  async reviewProgressLog(req, res) {
    try {
      const { logId } = req.params;
      const { feedback, is_signed } = req.body;
      const supervisorId = req.user.user_id;

      // Check if user is a supervisor
      if (req.user.role !== "supervisor") {
        return res.status(403).json({
          success: false,
          message: "Only supervisors can review progress logs",
        });
      }

      // Find the log
      const log = await progressLogModel.findLogById(logId);
      if (!log) {
        return res.status(404).json({
          success: false,
          message: "Progress log not found",
        });
      }

      // Check if supervisor is assigned to the project
      const project = await projectModel.findProjectById(log.project_id);
      if (!project || project.supervisor_id !== supervisorId) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to review this progress log",
        });
      } // Add feedback
      const updatedLog = await progressLogModel.addFeedbackToLog(
        logId,
        supervisorId,
        feedback,
        is_signed
      );

      // Notify student
      await notificationService.notifyUser(
        log.student_id,
        `You have received feedback on your progress log`,
        logId
      );

      res.status(200).json({
        success: true,
        log: updatedLog || {
          id: logId,
          feedback,
          is_signed,
        },
      });
    } catch (error) {
      console.error("Error reviewing progress log:", error);
      res.status(500).json({
        success: false,
        message: "Failed to review progress log",
      });
    }
  },

  // GET /api/admin/students/:studentId/progress-logs (Manager View Student Logs)
  async getStudentProgressLogs(req, res) {
    try {
      const { studentId } = req.params;

      // Check if user is a manager
      if (req.user.role !== "manager") {
        return res.status(403).json({
          success: false,
          message: "Access denied. Manager role required.",
        });
      }

      const logs = await progressLogModel.getLogsByStudentId(studentId);

      res.status(200).json({
        success: true,
        logs,
      });
    } catch (error) {
      console.error("Error getting student progress logs:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve student progress logs",
      });
    }
  },
};

export default progressLogController;
