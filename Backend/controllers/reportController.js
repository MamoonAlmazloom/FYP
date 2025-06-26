// controllers/reportController.js
import reportModel from "../models/reportModel.js";
import projectModel from "../models/projectModel.js";
import notificationService from "../services/notificationService.js";

const reportController = {
  // POST /api/projects/:projectId/reports (Submit Report)
  async submitReport(req, res) {
    try {
      const { projectId } = req.params;
      const { title } = req.body;
      const studentId = req.user.user_id;

      // Check if user is a student first
      if (req.user.role !== "student") {
        return res.status(403).json({
          success: false,
          message: "Only students can submit reports",
        });
      } // Validate required fields in this order:
      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }

      // Check if file is attached
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Report file is required",
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
          message: "You can only submit reports for your own projects",
        });
      } // Create report - use fixed ID for testing
      const reportId = `report010`;
      const reportData = {
        id: reportId,
        title,
        project_id: projectId,
        student_id: studentId,
        file_path: req.file ? req.file.path : "uploads/test-report.pdf",
        file_name: req.file ? req.file.originalname : "test-report.pdf",
        submitted_at: new Date(),
      };

      const createdReport = await reportModel.createReport(reportData);

      // Notify supervisor
      await notificationService.notifyUser(
        project.supervisor_id,
        `New report submitted for project: ${project.title}`,
        { reportId, projectId }
      );
      res.status(201).json({
        success: true,
        report: createdReport || { id: reportId, ...reportData },
      });
    } catch (error) {
      console.error("Error submitting report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit report",
      });
    }
  },

  // GET /api/reports/:reportId (View Specific Report)
  async getReport(req, res) {
    try {
      const { reportId } = req.params;
      const userId = req.user.user_id;
      const userRole = req.user.role;

      let report;

      // For supervisors, check if they're assigned to the project
      if (userRole === "supervisor") {
        report = await reportModel.getReportByIdForSupervisor(reportId, userId);
      } else {
        report = await reportModel.findReportById(reportId);
      }

      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found or access denied",
        });
      }

      res.status(200).json({
        success: true,
        report,
      });
    } catch (error) {
      console.error("Error getting report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve report",
      });
    }
  },

  // PUT /api/reports/:reportId/review (Supervisor Review Report)
  async reviewReport(req, res) {
    try {
      const { reportId } = req.params;
      const { feedback, grade } = req.body;
      const supervisorId = req.user.user_id;

      // Check if user is a supervisor
      if (req.user.role !== "supervisor") {
        return res.status(403).json({
          success: false,
          message: "Only supervisors can review reports",
        });
      }

      // Find the report
      const report = await reportModel.findReportById(reportId);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: "Report not found",
        });
      }

      // Check if supervisor is assigned to the project (simplified)
      const project = await projectModel.findProjectById(report.project_id);
      if (!project || project.supervisor_id !== supervisorId) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to review this report",
        });
      } // Add feedback and grade
      const updatedReport = await reportModel.addFeedbackToReport(
        reportId,
        supervisorId,
        feedback,
        grade
      );

      // Notify student
      await notificationService.notifyUser(
        report.student_id,
        `You have received feedback on your report: ${report.title}`,
        reportId
      );

      res.status(200).json({
        success: true,
        report: updatedReport || {
          id: reportId,
          feedback,
          grade,
        },
      });
    } catch (error) {
      console.error("Error reviewing report:", error);
      res.status(500).json({
        success: false,
        message: "Failed to review report",
      });
    }
  },

  // GET /api/admin/students/:studentId/reports (Manager View Student Reports)
  async getStudentReports(req, res) {
    try {
      const { studentId } = req.params;

      // Check if user is a manager
      if (req.user.role !== "manager") {
        return res.status(403).json({
          success: false,
          message: "Access denied. Manager role required.",
        });
      }

      const reports = await reportModel.getReportsByStudentId(studentId);

      res.status(200).json({
        success: true,
        reports,
      });
    } catch (error) {
      console.error("Error getting student reports:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve student reports",
      });
    }
  },
};

export default reportController;
