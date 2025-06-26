import request from "supertest";
import app from "../../app.js"; // Adjust path to your Express app
import path from "path";
import fs from "fs";

jest.mock("../../models/reportModel.js", () => ({
  createReport: jest.fn(),
  findReportById: jest.fn(),
  addFeedbackToReport: jest.fn(),
  getReportByIdForSupervisor: jest.fn(), // Specific for TC-B3.9 auth
}));
import reportModel from "../../models/reportModel.js";

// Mock projectModel for checks like student is part of project, supervisor is assigned
jest.mock("../../models/projectModel.js", () => ({
  findProjectById: jest.fn(), // Used to verify project exists and student/supervisor association
}));
import projectModel from "../../models/projectModel.js";

jest.mock("../../services/notificationService.js", () => ({
  notifyUser: jest.fn(),
}));
import notificationService from "../../services/notificationService.js";

describe("Report Endpoints", () => {
  // Main describe block can be more generic
  let studentToken, supervisorToken, managerToken;
  const studentId = "student123";
  const supervisorId = "supervisor456";
  const managerId = "manager007";
  const projectId = "proj789";
  const reportId = "report010";

  // Create a dummy file for upload tests
  const testFilePath = path.join(__dirname, "test-report.pdf");
  beforeAll(() => {
    fs.writeFileSync(testFilePath, "This is a test PDF content.");
    studentToken = global.getStudentToken
      ? global.getStudentToken({ userId: studentId })
      : "dummyStudentToken";
    supervisorToken = global.getSupervisorToken
      ? global.getSupervisorToken({ userId: supervisorId })
      : "dummySupervisorToken";
    managerToken = global.getManagerToken
      ? global.getManagerToken({ userId: managerId })
      : "dummyManagerToken";
  });

  afterAll(() => {
    fs.unlinkSync(testFilePath); // Clean up the dummy file
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TC-B3.1: Submit Report (Student)
  describe("POST /api/projects/:projectId/reports (Submit Report)", () => {
    const reportData = { title: "Midterm Progress Report" };
    const mockProjectForReport = {
      id: projectId,
      student_id: studentId,
      supervisor_id: "supervisorOfProject123",
    };

    it("should allow a student to submit a report with a file and notify supervisor", async () => {
      projectModel.findProjectById.mockResolvedValue(mockProjectForReport); // Ensure supervisor_id is on the mock
      reportModel.createReport.mockResolvedValue({
        id: reportId,
        project_id: projectId,
        student_id: studentId,
        ...reportData,
        file_path: "uploads/test-report.pdf",
      });

      const response = await request(app)
        .post(`/api/projects/${projectId}/reports`)
        .set("Authorization", `Bearer ${studentToken}`)
        .field("title", reportData.title)
        // .field('milestone_id', 'milestone1') // If you have milestones
        .attach("report_file", testFilePath);

      expect(response.statusCode).toBe(201);
      expect(response.body.report).toHaveProperty("id", reportId);
      expect(response.body.report.file_path).toBeDefined();
      expect(projectModel.findProjectById).toHaveBeenCalledWith(projectId);
      expect(reportModel.createReport).toHaveBeenCalledWith(
        expect.objectContaining({
          project_id: projectId,
          student_id: studentId,
          title: reportData.title,
          file_name: "test-report.pdf", // Assuming controller extracts filename
          // file_path will be determined by upload logic, so not checking exact mock here for it
        })
      );
      // TC-B4.3: Supervisor Notification for New Report Submission
      const { notifyUser } = jest.requireMock(
        "../../services/notificationService.js"
      );
      expect(notifyUser).toHaveBeenCalledWith(
        mockProjectForReport.supervisor_id,
        expect.stringContaining("New report submitted"),
        expect.objectContaining({ reportId: reportId, projectId: projectId })
      );
    });

    it("should return 403 if student tries to submit report for another student project", async () => {
      projectModel.findProjectById.mockResolvedValue({
        id: projectId,
        student_id: "otherStudent",
      });
      const response = await request(app)
        .post(`/api/projects/${projectId}/reports`)
        .set("Authorization", `Bearer ${studentToken}`)
        .field("title", reportData.title)
        .attach("report_file", testFilePath);
      expect(response.statusCode).toBe(403);
    });

    it("should return 400 if no file is attached", async () => {
      projectModel.findProjectById.mockResolvedValue({
        id: projectId,
        student_id: studentId,
      });
      const response = await request(app)
        .post(`/api/projects/${projectId}/reports`)
        .set("Authorization", `Bearer ${studentToken}`)
        .field("title", reportData.title); // No file
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/report file is required/i);
    });
    it("should return 400 for missing title", async () => {
      projectModel.findProjectById.mockResolvedValue({
        id: projectId,
        student_id: studentId,
      });
      const response = await request(app)
        .post(`/api/projects/${projectId}/reports`)
        .set("Authorization", `Bearer ${studentToken}`)
        .attach("report_file", testFilePath); // No title
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/title is required/i);
    });
  });

  // TC-B3.6: Review Feedback on Reports (Supervisor)
  describe("PUT /api/reports/:reportId/review (Supervisor Review Report)", () => {
    const feedbackData = {
      feedback: "Good progress, but need more details on methodology.",
      grade: "B+",
    };
    const mockReport = {
      id: reportId,
      project_id: projectId,
      student_id: studentId,
      supervisor_id: supervisorId,
    };

    it("should allow assigned supervisor to add feedback and grade to a report", async () => {
      // Assume reportModel.findReportById also fetches project and checks supervisor assignment, or controller does.
      // For this test, we can mock findReportById to return the supervisor_id directly or rely on a projectModel check.
      reportModel.findReportById.mockResolvedValue(mockReport);
      projectModel.findProjectById.mockResolvedValue({
        id: projectId,
        supervisor_id: supervisorId,
        student_id: studentId,
      });
      reportModel.addFeedbackToReport.mockResolvedValue({
        ...mockReport,
        ...feedbackData,
      });

      const response = await request(app)
        .put(`/api/reports/${reportId}/review`)
        .set("Authorization", `Bearer ${supervisorToken}`)
        .send(feedbackData);

      expect(response.statusCode).toBe(200);
      expect(response.body.report.feedback).toBe(feedbackData.feedback);
      expect(response.body.report.grade).toBe(feedbackData.grade);
      expect(reportModel.findReportById).toHaveBeenCalledWith(reportId);
      // If controller separately checks project for supervisor auth:
      // expect(projectModel.findProjectById).toHaveBeenCalledWith(projectId);
      expect(reportModel.addFeedbackToReport).toHaveBeenCalledWith(
        reportId,
        supervisorId,
        feedbackData.feedback,
        feedbackData.grade
      );
      expect(notificationService.notifyUser).toHaveBeenCalledWith(
        studentId,
        expect.stringContaining("feedback on your report"),
        expect.any(String)
      );
    });

    it("should return 403 if supervisor is not assigned to the project of the report", async () => {
      reportModel.findReportById.mockResolvedValue(mockReport);
      projectModel.findProjectById.mockResolvedValue({
        id: projectId,
        supervisor_id: "otherSupervisor",
        student_id: studentId,
      }); // Different supervisor

      const response = await request(app)
        .put(`/api/reports/${reportId}/review`)
        .set("Authorization", `Bearer ${supervisorToken}`)
        .send(feedbackData);
      expect(response.statusCode).toBe(403);
    });
    it("should return 404 if report not found", async () => {
      reportModel.findReportById.mockResolvedValue(null);
      const response = await request(app)
        .put(`/api/reports/nonexistentReport/review`)
        .set("Authorization", `Bearer ${supervisorToken}`)
        .send(feedbackData);
      expect(response.statusCode).toBe(404);
    });
  });

  // TC-B3.9: View FYP Report from Previous Project (Supervisor)
  describe("GET /api/reports/:reportId (Supervisor View Specific Report)", () => {
    const pastReport = {
      id: reportId,
      project_id: "pastProject1",
      title: "Final Report 2022",
      student_id: "pastStudent",
      supervisor_id: supervisorId,
      file_path: "archive/report.pdf",
    };

    it("should allow supervisor to view a specific report from their past projects", async () => {
      // getReportByIdForSupervisor should handle authorization: checks if supervisorId matches report's project's supervisor
      reportModel.getReportByIdForSupervisor.mockResolvedValue(pastReport);

      const response = await request(app)
        .get(`/api/reports/${reportId}`)
        .set("Authorization", `Bearer ${supervisorToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.report).toEqual(pastReport);
      expect(reportModel.getReportByIdForSupervisor).toHaveBeenCalledWith(
        reportId,
        supervisorId
      );
    });

    it("should return 404 if report not found or supervisor not authorized", async () => {
      // This mock covers both "not found" and "found but not authorized for this supervisor"
      reportModel.getReportByIdForSupervisor.mockResolvedValue(null);
      const response = await request(app)
        .get(`/api/reports/${reportId}`)
        .set("Authorization", `Bearer ${supervisorToken}`);
      expect(response.statusCode).toBe(404);
    });
  });

  // TC-B5.6: View Student Reports (Manager)
  describe("GET /api/admin/students/:studentId/reports (Manager View Student Reports)", () => {
    const targetStudentId = "anyStudent789";
    const mockReportsForStudent = [
      {
        id: "rep1",
        student_id: targetStudentId,
        title: "Report Alpha",
        file_path: "uploads/alpha.pdf",
      },
      {
        id: "rep2",
        student_id: targetStudentId,
        title: "Report Beta",
        file_path: "uploads/beta.pdf",
      },
    ];

    beforeEach(() => {
      // Ensure reportModel.getReportsByStudentId is defined for this describe block
      reportModel.getReportsByStudentId = jest.fn();
    });

    it("should allow a manager to view reports for any student", async () => {
      reportModel.getReportsByStudentId.mockResolvedValue(
        mockReportsForStudent
      );

      const response = await request(app)
        .get(`/api/admin/students/${targetStudentId}/reports`)
        .set("Authorization", `Bearer ${managerToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.reports).toEqual(mockReportsForStudent);
      expect(reportModel.getReportsByStudentId).toHaveBeenCalledWith(
        targetStudentId
      );
    });

    it("should return 200 with an empty list if student has no reports (or student not found, depending on API)", async () => {
      reportModel.getReportsByStudentId.mockResolvedValue([]);
      const response = await request(app)
        .get(`/api/admin/students/studentWithNoReports/reports`)
        .set("Authorization", `Bearer ${managerToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.reports).toEqual([]);
    });

    it("should return 403 if a non-manager tries to access", async () => {
      const response = await request(app)
        .get(`/api/admin/students/${targetStudentId}/reports`)
        .set("Authorization", `Bearer ${supervisorToken}`); // Using supervisor token
      expect(response.statusCode).toBe(403);
    });
  });
});
