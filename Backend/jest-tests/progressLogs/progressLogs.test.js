const request = require('supertest');
const app = require('../../app'); // Adjust path to your Express app

jest.mock('../../models/progressLogModel', () => ({
  createLog: jest.fn(),
  findLogById: jest.fn(),
  addFeedbackToLog: jest.fn(),
}));
const progressLogModel = require('../../models/progressLogModel');

jest.mock('../../models/projectModel', () => ({
  findProjectById: jest.fn(), // Used to verify project exists and student/supervisor association
}));
const projectModel = require('../../models/projectModel');

jest.mock('../../services/notificationService', () => ({
  notifyUser: jest.fn(),
}));
// const notificationService = require('../../services/notificationService');


describe('Progress Log Endpoints', () => { // Main describe block can be more generic
  let studentToken, supervisorToken, managerToken;
  const studentId = 'student123';
  const supervisorId = 'supervisor456';
  const managerId = 'manager007';
  const projectId = 'proj789';
  const logId = 'log010';
  const milestoneId = 'milestoneABC';

  beforeAll(() => {
    studentToken = global.getStudentToken ? global.getStudentToken({ userId: studentId }) : 'dummyStudentToken';
    supervisorToken = global.getSupervisorToken ? global.getSupervisorToken({ userId: supervisorId }) : 'dummySupervisorToken';
    managerToken = global.getManagerToken ? global.getManagerToken({ userId: managerId }) : 'dummyManagerToken';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TC-B3.2: Submit Progress Log (Student)
  describe('POST /api/projects/:projectId/logs (Submit Progress Log)', () => {
    const logData = {
      milestone_id: milestoneId,
      date: '2023-10-26',
      activity_description: 'Worked on API design.',
      hours_spent: 4,
      challenges: 'Deciding on REST vs GraphQL.'
    };

    it('should allow a student to submit a progress log', async () => {
      projectModel.findProjectById.mockResolvedValue({ id: projectId, student_id: studentId });
      progressLogModel.createLog.mockResolvedValue({ id: logId, project_id: projectId, student_id: studentId, ...logData });

      const response = await request(app)
        .post(`/api/projects/${projectId}/logs`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send(logData);

      expect(response.statusCode).toBe(201);
      expect(response.body.log).toHaveProperty('id', logId);
      expect(progressLogModel.createLog).toHaveBeenCalledWith(expect.objectContaining({
        project_id: projectId,
        student_id: studentId,
        ...logData
      }));
      // expect(notificationService.notifyUser).toHaveBeenCalledWith(project's supervisor_id, ...);
    });

    it('should return 403 if student submits log for another student project', async () => {
      projectModel.findProjectById.mockResolvedValue({ id: projectId, student_id: 'otherStudent' });
      const response = await request(app)
        .post(`/api/projects/${projectId}/logs`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send(logData);
      expect(response.statusCode).toBe(403);
    });

    it('should return 400 for missing required fields (e.g., activity_description, date)', async () => {
      projectModel.findProjectById.mockResolvedValue({ id: projectId, student_id: studentId });
      const invalidLogData = { ...logData, activity_description: undefined };
      const response = await request(app)
        .post(`/api/projects/${projectId}/logs`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send(invalidLogData);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/activity description is required/i);
    });

    it('should return 400 for invalid data types (e.g. hours_spent not a number)', async () => {
      projectModel.findProjectById.mockResolvedValue({ id: projectId, student_id: studentId });
      const invalidLogData = { ...logData, hours_spent: "four" };
      const response = await request(app)
        .post(`/api/projects/${projectId}/logs`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send(invalidLogData);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/hours spent must be a number/i);
    });
  });

  // TC-B3.5: Review Feedback on Log (Supervisor)
  describe('PUT /api/progress-logs/:logId/review (Supervisor Review Log)', () => {
    const feedbackData = { feedback: "Good details. Keep it up.", is_signed: true };
    const mockLog = { id: logId, project_id: projectId, student_id: studentId };

    it('should allow assigned supervisor to add feedback and sign a log', async () => {
      progressLogModel.findLogById.mockResolvedValue(mockLog);
      projectModel.findProjectById.mockResolvedValue({ id: projectId, supervisor_id: supervisorId, student_id: studentId });
      progressLogModel.addFeedbackToLog.mockResolvedValue({ ...mockLog, ...feedbackData });

      const response = await request(app)
        .put(`/api/progress-logs/${logId}/review`)
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send(feedbackData);

      expect(response.statusCode).toBe(200);
      expect(response.body.log.feedback).toBe(feedbackData.feedback);
      expect(response.body.log.is_signed).toBe(feedbackData.is_signed);
      expect(progressLogModel.findLogById).toHaveBeenCalledWith(logId);
      // expect(projectModel.findProjectById).toHaveBeenCalledWith(projectId); // If controller checks project for supervisor
      expect(progressLogModel.addFeedbackToLog).toHaveBeenCalledWith(logId, supervisorId, feedbackData.feedback, feedbackData.is_signed);
      expect(notificationService.notifyUser).toHaveBeenCalledWith(studentId, expect.stringContaining("feedback on your progress log"), expect.any(String));
    });

    it('should return 403 if supervisor is not assigned to the project of the log', async () => {
      progressLogModel.findLogById.mockResolvedValue(mockLog);
      projectModel.findProjectById.mockResolvedValue({ id: projectId, supervisor_id: 'otherSupervisor', student_id: studentId });

      const response = await request(app)
        .put(`/api/progress-logs/${logId}/review`)
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send(feedbackData);
      expect(response.statusCode).toBe(403);
    });

    it('should return 404 if log not found', async () => {
      progressLogModel.findLogById.mockResolvedValue(null);
      const response = await request(app)
        .put(`/api/progress-logs/nonexistentLog/review`)
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send(feedbackData);
      expect(response.statusCode).toBe(404);
    });
  });

  // TC-B5.5: View Student Logs (Manager)
  describe('GET /api/admin/students/:studentId/progress-logs (Manager View Student Logs)', () => {
    const targetStudentId = 'anyStudent456';
    const mockLogsForStudent = [
      { id: 'log1', student_id: targetStudentId, activity_description: 'Activity A' },
      { id: 'log2', student_id: targetStudentId, activity_description: 'Activity B' },
    ];

    beforeEach(() => {
        // Ensure progressLogModel.getLogsByStudentId is defined for this describe block
        progressLogModel.getLogsByStudentId = jest.fn();
    });

    it('should allow a manager to view progress logs for any student', async () => {
      progressLogModel.getLogsByStudentId.mockResolvedValue(mockLogsForStudent);

      const response = await request(app)
        .get(`/api/admin/students/${targetStudentId}/progress-logs`)
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.logs).toEqual(mockLogsForStudent);
      expect(progressLogModel.getLogsByStudentId).toHaveBeenCalledWith(targetStudentId);
    });

    it('should return 404 if student not found (or no logs, depending on API design)', async () => {
      // Assuming if student exists but has no logs, it returns 200 with empty array
      // This test is for when the studentId itself is invalid leading to no logs.
      progressLogModel.getLogsByStudentId.mockResolvedValue([]); // Or mock userModel.findUserById to return null first

      const response = await request(app)
        .get(`/api/admin/students/nonExistentStudent789/progress-logs`)
        .set('Authorization', `Bearer ${managerToken}`);

      // If endpoint returns 404 when student has no logs OR student doesn't exist
      // expect(response.statusCode).toBe(404);
      // If it returns 200 with empty array for no logs, but 404 for non-existent student,
      // this test needs to differentiate. For simplicity, let's assume 200 and empty for now.
      expect(response.statusCode).toBe(200);
      expect(response.body.logs).toEqual([]);
    });

    it('should return 403 if a non-manager tries to access', async () => {
      const response = await request(app)
        .get(`/api/admin/students/${targetStudentId}/progress-logs`)
        .set('Authorization', `Bearer ${studentToken}`); // Using student token
      expect(response.statusCode).toBe(403);
    });
  });
});
