// app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import supervisorRoutes from "./routes/supervisorRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";
import moderatorRoutes from "./routes/moderatorRoutes.js";
import examinerRoutes from "./routes/examinerRoutes.js";
import deadlineRoutes from "./routes/deadlineRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import progressLogRoutes from "./routes/progressLogRoutes.js";

// Import notification model for test endpoints
import notificationModel from "./models/notificationModel.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/supervisors", supervisorRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/admin", managerRoutes); // Admin routes use manager controller
app.use("/api/moderators", moderatorRoutes);
app.use("/api/examiners", examinerRoutes);
app.use("/api/deadlines", deadlineRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/progress-logs", progressLogRoutes);

// Simple notification test endpoint (without authentication for testing)
app.get("/api/notifications/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Notification service is working",
    data: [
      {
        notification_id: 1,
        message: "Test notification 1 - New proposal submitted for review",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        is_read: false,
        event_name: "proposal_submitted",
      },
      {
        notification_id: 2,
        message: "Test notification 2 - Your proposal has been approved",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        is_read: true,
        event_name: "proposal_approved",
      },
      {
        notification_id: 3,
        message:
          "Test notification 3 - Deadline reminder: Project submission due in 3 days",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        is_read: false,
        event_name: "deadline_reminder",
      },
      {
        notification_id: 4,
        message: "Test notification 4 - Your proposal needs modification",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        is_read: false,
        event_name: "proposal_needs_modification",
      },
      {
        notification_id: 5,
        message:
          "Test notification 5 - Examiner John Doe has been assigned to your project",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        is_read: false,
        event_name: "examiner_assigned",
      },
      {
        notification_id: 6,
        message:
          "Test notification 6 - Your project has been evaluated. Result: Pass (Score: 85)",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
        is_read: false,
        event_name: "project_evaluated",
      },
      {
        notification_id: 7,
        message:
          "Test notification 7 - You have received feedback from Prof. Smith on your Progress Report",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        is_read: true,
        event_name: "feedback_received",
      },
      {
        notification_id: 8,
        message:
          "Test notification 8 - Student Alice submitted a new progress log for 'AI Medical Diagnosis'",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), // 6 days ago
        is_read: false,
        event_name: "log_submitted",
      },
    ],
  });
});

// Test notification trigger endpoints
app.post("/api/notifications/test/examiner-assignment", async (req, res) => {
  try {
    const { projectId, studentId, examinerId } = req.body;
    await notificationModel.notifyExaminerAssignment(
      projectId,
      studentId,
      examinerId
    );
    res.status(200).json({
      success: true,
      message: "Examiner assignment notification sent",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/notifications/test/project-evaluation", async (req, res) => {
  try {
    const { projectId, examinerId, evaluationResult, score } = req.body;
    await notificationModel.notifyProjectEvaluation(
      projectId,
      examinerId,
      evaluationResult,
      score
    );
    res
      .status(200)
      .json({ success: true, message: "Project evaluation notification sent" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/notifications/test/progress-submission", async (req, res) => {
  try {
    const { submissionType, submissionId, studentId, projectId } = req.body;
    await notificationModel.notifyProgressSubmissionToSupervisor(
      submissionType,
      submissionId,
      studentId,
      projectId
    );
    res.status(200).json({
      success: true,
      message: "Progress submission notification sent",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/notifications/test/feedback-received", async (req, res) => {
  try {
    const { feedbackType, feedbackId, reviewerId, targetId } = req.body;
    await notificationModel.notifyFeedbackReceived(
      feedbackType,
      feedbackId,
      reviewerId,
      targetId
    );
    res
      .status(200)
      .json({ success: true, message: "Feedback received notification sent" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use("/api/notifications", notificationRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend server is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
    message: err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Only start server if this file is run directly (not imported)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🔔 Notification service ready!`);
  });
}

export default app;
