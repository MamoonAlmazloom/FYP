const request = require('supertest');
const app = require('../../app'); // Adjust path to your Express app

// Initial mocks from F5 might be here or need to be added/adjusted.
// For F2/F3 features, we'll need projectModel for sure.
jest.mock('../../models/projectModel', () => ({
  createProject: jest.fn(),
  findProjectById: jest.fn(),
  getAvailableProjects: jest.fn(),
  assignProjectToStudent: jest.fn(),
  getProjectsBySupervisor: jest.fn(),
  // Add other project model functions as needed by manager features later
  assignExaminerToProject: jest.fn(),
  assignModeratorToProject: jest.fn(),
  updateProjectStatus: jest.fn(), // e.g. for archiving by manager
  getProjectsByStatus: jest.fn(), // for manager viewing approved
}));
const projectModel = require('../../models/projectModel');

// Mock studentModel if student project limits are checked
jest.mock('../../models/studentModel', () => ({
    findStudentById: jest.fn(),
    // ... any other student model functions
}));
const studentModel = require('../../models/studentModel');


describe('Project Endpoints', () => {
  let studentToken, supervisorToken, managerToken;
  const studentId = 'student123';
  const supervisorId = 'supervisor456';
  const managerId = 'manager789'; // For F5 tests later
  const projectId = 'projABC';
  const availableProjectId = 'projXYZ';

  beforeAll(() => {
    studentToken = global.getStudentToken ? global.getStudentToken({ userId: studentId }) : 'dummyStudentToken';
    supervisorToken = global.getSupervisorToken ? global.getSupervisorToken({ userId: supervisorId }) : 'dummySupervisorToken';
    managerToken = global.getManagerToken ? global.getManagerToken({userId: managerId}) : 'dummyManagerToken';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TC-B3.4: Propose New Project (Supervisor)
  describe('POST /api/projects (Supervisor Propose New Project)', () => {
    const newProjectData = {
      title: 'New Interdisciplinary Project',
      description: 'A project combining CS and Biology.',
      prerequisites: 'Basic programming, Basic biology',
      capacity: 2
    };

    it('should allow a supervisor to propose a new project', async () => {
      projectModel.createProject.mockResolvedValue({ id: projectId, supervisor_id: supervisorId, status: 'Available', ...newProjectData });
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send(newProjectData);

      expect(response.statusCode).toBe(201);
      expect(response.body.project).toHaveProperty('id');
      expect(response.body.project.status).toBe('Available'); // Or 'PendingApproval'
      expect(projectModel.createProject).toHaveBeenCalledWith(expect.objectContaining({
        ...newProjectData,
        supervisor_id: supervisorId,
      }));
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send({ description: 'Only description' });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/title is required/i);
    });

    it('should return 403 if a non-supervisor tries to propose', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${studentToken}`)
        .send(newProjectData);
      expect(response.statusCode).toBe(403);
    });
  });

  // TC-B2.5: Select Project from Available List (Student)
  describe('POST /api/projects/available/:projectId/select (Student Select Project)', () => {
    it('should allow a student to select an available project', async () => {
      // Assume student has no current project
      studentModel.findStudentById.mockResolvedValue({ id: studentId, current_project_id: null });
      projectModel.findProjectById.mockResolvedValue({ id: availableProjectId, status: 'Available', capacity: 1, current_students_count: 0 });
      projectModel.assignProjectToStudent.mockResolvedValue({ success: true, project: {id: availableProjectId, student_ids: [studentId] }}); // Simplified

      const response = await request(app)
        .post(`/api/projects/available/${availableProjectId}/select`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.statusCode).toBe(200); // Or 201
      expect(response.body.message).toMatch(/project selected successfully/i);
      expect(projectModel.assignProjectToStudent).toHaveBeenCalledWith(availableProjectId, studentId);
    });

    it('should return 400 if project is not available or at capacity', async () => {
      studentModel.findStudentById.mockResolvedValue({ id: studentId, current_project_id: null });
      projectModel.findProjectById.mockResolvedValue({ id: availableProjectId, status: 'Available', capacity: 1, current_students_count: 1 }); // At capacity

      const response = await request(app)
        .post(`/api/projects/available/${availableProjectId}/select`)
        .set('Authorization', `Bearer ${studentToken}`);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/project is not available or at full capacity/i);
    });

    it('should return 400 if student already has a project (if limit is 1)', async () => {
      studentModel.findStudentById.mockResolvedValue({ id: studentId, current_project_id: 'existingProj1' }); // Student has a project
      projectModel.findProjectById.mockResolvedValue({ id: availableProjectId, status: 'Available', capacity: 1, current_students_count: 0 });

      const response = await request(app)
        .post(`/api/projects/available/${availableProjectId}/select`)
        .set('Authorization', `Bearer ${studentToken}`);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/student already has an active project/i);
    });

    it('should return 404 if project to select is not found', async () => {
      studentModel.findStudentById.mockResolvedValue({ id: studentId, current_project_id: null });
      projectModel.findProjectById.mockResolvedValue(null); // Project not found
       const response = await request(app)
        .post(`/api/projects/available/nonExistentProject/select`)
        .set('Authorization', `Bearer ${studentToken}`);
      expect(response.statusCode).toBe(404);
    });
  });

  // TC-B3.7: Access Past Projects (Supervisor)
  describe('GET /api/projects/archive (Supervisor Access Past Projects)', () => {
    // Endpoint might be /api/projects?supervisor_id={id}&status=archived
    // For simplicity, let's assume /api/projects/my/archive or similar that infers supervisor from token
    it('should allow a supervisor to view their archived projects', async () => {
      const archivedProjects = [
        { id: 'projOld1', title: 'Old Project 1', status: 'Archived', supervisor_id: supervisorId },
        { id: 'projOld2', title: 'Old Project 2', status: 'Archived', supervisor_id: supervisorId }
      ];
      // getProjectsBySupervisor would take { supervisor_id: supervisorId, status: 'Archived' }
      projectModel.getProjectsBySupervisor.mockResolvedValue(archivedProjects);

      const response = await request(app)
        .get('/api/projects/my/archive') // Assuming this endpoint filters by supervisorId from token and status=Archived
        .set('Authorization', `Bearer ${supervisorToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.projects).toEqual(archivedProjects);
      expect(projectModel.getProjectsBySupervisor).toHaveBeenCalledWith({ supervisor_id: supervisorId, status: 'Archived' });
    });

    it('should return an empty list if no archived projects found for supervisor', async () => {
      projectModel.getProjectsBySupervisor.mockResolvedValue([]);
      const response = await request(app)
        .get('/api/projects/my/archive')
        .set('Authorization', `Bearer ${supervisorToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.projects).toEqual([]);
    });
  });


  // Placeholder for F5 Manager tests that will also go in this file
  describe('Manager Project Endpoints (F5)', () => {
    const managerId = 'manager789'; // Already defined in outer scope, but good for clarity
    const targetProjectId = 'projToManage123';
    const examinerUserId = 'facultyUserExaminer1';
    const moderatorUserId = 'moderatorUserAssigned1';

    beforeEach(() => {
        // Reset mocks for projectModel if they were used in other describe blocks with different return values
        projectModel.findProjectById.mockReset();
        projectModel.assignExaminerToProject.mockReset();
        projectModel.assignModeratorToProject.mockReset();
        projectModel.getProjectsByStatus.mockReset();
        projectModel.updateProjectStatus.mockReset();
    });

    // TC-B5.1: Assign Examiner (Manager)
    describe('POST /api/projects/:projectId/assign-examiner', () => {
      it('should allow a manager to assign an examiner to a project', async () => {
        projectModel.findProjectById.mockResolvedValue({ id: targetProjectId, status: 'Approved' }); // Project exists and is in a state to assign examiner
        projectModel.assignExaminerToProject.mockResolvedValue({ success: true, project: { id: targetProjectId, examiner_id: examinerUserId } });

        const response = await request(app)
          .post(`/api/projects/${targetProjectId}/assign-examiner`)
          .set('Authorization', `Bearer ${managerToken}`)
          .send({ examiner_user_id: examinerUserId });

        expect(response.statusCode).toBe(200);
        expect(response.body.project.examiner_id).toBe(examinerUserId);
        expect(projectModel.assignExaminerToProject).toHaveBeenCalledWith(targetProjectId, examinerUserId);
      });

      it('should return 404 if project not found', async () => {
        projectModel.findProjectById.mockResolvedValue(null);
        const response = await request(app)
          .post(`/api/projects/nonexistentProject/assign-examiner`)
          .set('Authorization', `Bearer ${managerToken}`)
          .send({ examiner_user_id: examinerUserId });
        expect(response.statusCode).toBe(404);
      });

      it('should return 400 if examiner user is invalid or project not in assignable state', async () => {
        // Scenario 1: Project not in assignable state (e.g., still 'Pending')
        projectModel.findProjectById.mockResolvedValue({ id: targetProjectId, status: 'Pending' });
        let response = await request(app)
          .post(`/api/projects/${targetProjectId}/assign-examiner`)
          .set('Authorization', `Bearer ${managerToken}`)
          .send({ examiner_user_id: examinerUserId });
        expect(response.statusCode).toBe(400); // Or specific error like 409 Conflict
        expect(response.body.message).toMatch(/project not in assignable state/i);

        // Scenario 2: Invalid examiner_user_id (e.g., user does not exist or not faculty role)
        // This might be checked by your controller by querying a userModel, which should be mocked here.
        // For simplicity, assume assignExaminerToProject model method handles this and returns an error.
        projectModel.findProjectById.mockResolvedValue({ id: targetProjectId, status: 'Approved' });
        projectModel.assignExaminerToProject.mockRejectedValue(new Error('Invalid examiner or role')); // Simulate model error
        response = await request(app)
          .post(`/api/projects/${targetProjectId}/assign-examiner`)
          .set('Authorization', `Bearer ${managerToken}`)
          .send({ examiner_user_id: 'invalidExaminer' });
        expect(response.statusCode).toBe(400); // Or 500 if error is unhandled, or 404 if examiner not found
        expect(response.body.message).toMatch(/invalid examiner or role/i);
      });
    });

    // TC-B5.3: Assign Moderators to Projects (Manager)
    describe('POST /api/projects/:projectId/assign-moderator', () => {
        it('should allow a manager to assign a moderator to a project', async () => {
            projectModel.findProjectById.mockResolvedValue({ id: targetProjectId, status: 'Approved' });
            projectModel.assignModeratorToProject.mockResolvedValue({ success: true, project: { id: targetProjectId, moderator_id: moderatorUserId } });

            const response = await request(app)
                .post(`/api/projects/${targetProjectId}/assign-moderator`)
                .set('Authorization', `Bearer ${managerToken}`)
                .send({ moderator_user_id: moderatorUserId });

            expect(response.statusCode).toBe(200);
            expect(response.body.project.moderator_id).toBe(moderatorUserId);
            expect(projectModel.assignModeratorToProject).toHaveBeenCalledWith(targetProjectId, moderatorUserId);
        });
        // Add similar error case tests as for assign-examiner (404, 400 for invalid state/moderator)
    });

    // TC-B5.4: View/Manage Approved Projects (Manager)
    describe('GET /api/projects?status=Approved (View Approved Projects)', () => {
        it('should allow a manager to view all approved projects', async () => {
            const approvedProjects = [{ id: 'proj1', status: 'Approved' }, { id: 'proj2', status: 'Approved' }];
            projectModel.getProjectsByStatus.mockResolvedValue(approvedProjects);

            const response = await request(app)
                .get('/api/projects?status=Approved')
                .set('Authorization', `Bearer ${managerToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.projects).toEqual(approvedProjects);
            expect(projectModel.getProjectsByStatus).toHaveBeenCalledWith('Approved');
        });
    });

    describe('POST /api/projects/:projectId/archive (Archive Project)', () => {
        it('should allow a manager to archive an approved project', async () => {
            projectModel.findProjectById.mockResolvedValue({ id: targetProjectId, status: 'Approved' });
            projectModel.updateProjectStatus.mockResolvedValue({ success: true, project: { id: targetProjectId, status: 'Archived' } });

            const response = await request(app)
                .post(`/api/projects/${targetProjectId}/archive`)
                .set('Authorization', `Bearer ${managerToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.project.status).toBe('Archived');
            expect(projectModel.updateProjectStatus).toHaveBeenCalledWith(targetProjectId, 'Archived');
        });
        // Add error cases: project not found, project not in state to be archived.
    });
  });
});
