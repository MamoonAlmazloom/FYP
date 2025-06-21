const request = require('supertest');
const app = require('../../app'); // Adjust path to your Express app

// Mock a model that handles user/student data and eligibility
jest.mock('../../models/userModel', () => ({ // Or studentModel, or a specific adminModel
  findUserById: jest.fn(),
  updateUserEligibility: jest.fn(),
}));
const userModel = require('../../models/userModel');

describe('Admin Endpoints (F5: Manager Functional Requirements)', () => {
  let managerToken;
  const managerId = 'manager001';
  const studentToModifyId = 'studentToMakeEligible123';

  beforeAll(() => {
    managerToken = global.getManagerToken ? global.getManagerToken({ userId: managerId }) : 'dummyManagerToken';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TC-B5.2: Manage Student Eligibility (Manager)
  describe('POST /api/admin/students/:studentId/eligibility (Set Student Eligibility)', () => {
    it('should allow a manager to make a student eligible for FYP', async () => {
      userModel.findUserById.mockResolvedValue({ id: studentToModifyId, role: 'student', is_fyp_eligible: false });
      userModel.updateUserEligibility.mockResolvedValue({ success: true, user: { id: studentToModifyId, is_fyp_eligible: true } });

      const response = await request(app)
        .post(`/api/admin/students/${studentToModifyId}/eligibility`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ is_eligible: true });

      expect(response.statusCode).toBe(200);
      expect(response.body.user.is_fyp_eligible).toBe(true);
      expect(userModel.updateUserEligibility).toHaveBeenCalledWith(studentToModifyId, true);
    });

    it('should allow a manager to make a student ineligible for FYP', async () => {
      userModel.findUserById.mockResolvedValue({ id: studentToModifyId, role: 'student', is_fyp_eligible: true });
      userModel.updateUserEligibility.mockResolvedValue({ success: true, user: { id: studentToModifyId, is_fyp_eligible: false } });

      const response = await request(app)
        .post(`/api/admin/students/${studentToModifyId}/eligibility`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ is_eligible: false });

      expect(response.statusCode).toBe(200);
      expect(response.body.user.is_fyp_eligible).toBe(false);
      expect(userModel.updateUserEligibility).toHaveBeenCalledWith(studentToModifyId, false);
    });

    it('should return 404 if student to modify is not found', async () => {
      userModel.findUserById.mockResolvedValue(null);
      const response = await request(app)
        .post(`/api/admin/students/nonExistentStudent/eligibility`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ is_eligible: true });
      expect(response.statusCode).toBe(404);
    });

    it('should return 400 if is_eligible field is missing or not a boolean', async () => {
      userModel.findUserById.mockResolvedValue({ id: studentToModifyId, role: 'student', is_fyp_eligible: false });
      let response = await request(app)
        .post(`/api/admin/students/${studentToModifyId}/eligibility`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({}); // Missing is_eligible
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/is_eligible must be provided/i);

      response = await request(app)
        .post(`/api/admin/students/${studentToModifyId}/eligibility`)
        .set('Authorization', `Bearer ${managerToken}`)
        .send({ is_eligible: "yes" }); // Invalid type
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/is_eligible must be a boolean/i);
    });

    it('should return 403 if a non-manager tries to modify eligibility', async () => {
      const studentToken = global.getStudentToken ? global.getStudentToken() : 'dummyStudentToken';
      const response = await request(app)
        .post(`/api/admin/students/${studentToModifyId}/eligibility`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ is_eligible: true });
      expect(response.statusCode).toBe(403);
    });
  });

  // Other admin-specific, non-project routes could go here.
});
