import request from "supertest";
import app from "../../app.js"; // Adjust path to your Express app

// Mock the user model functions relevant to registration
jest.mock("../../models/authModel.js", () => ({
  findUserByEmail: jest.fn(),
  createUser: jest.fn(),
  // Mock any other model functions if your registration controller uses them
}));
import authModel from "../../models/authModel.js";

describe("User Endpoints (F1: User Account Management)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/users/register (TC-B1.3)", () => {
    const validStudentData = {
      name: "New Student",
      email: "newstudent@example.com",
      password: "strongPassword123",
      role: "student", // Assuming 'student' is a valid self-registerable role
      student_id_number: "S12345", // Example field for student
      // Add any other required fields for student registration
    };

    it("should register a new student successfully", async () => {
      authModel.findUserByEmail.mockResolvedValue(null); // Email is not taken
      // Mock createUser to simulate successful user creation
      const createdUser = { id: "newUser123", ...validStudentData };
      delete createdUser.password; // Don't return password
      authModel.createUser.mockResolvedValue(createdUser);

      const response = await request(app)
        .post("/api/users/register")
        .send(validStudentData);

      expect(response.statusCode).toBe(201);
      expect(response.body.user).toEqual(
        expect.objectContaining({
          name: validStudentData.name,
          email: validStudentData.email,
          role: validStudentData.role,
          student_id_number: validStudentData.student_id_number,
        })
      );
      expect(response.body.message).toMatch(/registration successful/i);
      expect(authModel.findUserByEmail).toHaveBeenCalledWith(
        validStudentData.email
      );
      // Check that createUser was called with data including a hashed password, not plain text
      expect(authModel.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: validStudentData.email,
          password_hash: expect.any(String), // Ensure password isn't plain
        })
      );
    });

    it("should return 409 if email already exists", async () => {
      authModel.findUserByEmail.mockResolvedValue({
        id: "existingUser",
        email: validStudentData.email,
      }); // Email is taken

      const response = await request(app)
        .post("/api/users/register")
        .send(validStudentData);

      expect(response.statusCode).toBe(409);
      expect(response.body.message).toMatch(/email already in use/i);
    });

    it("should return 400 for missing required fields (e.g., email, password, name, role)", async () => {
      const testCases = [
        { ...validStudentData, email: undefined },
        { ...validStudentData, password: undefined },
        { ...validStudentData, name: undefined },
        { ...validStudentData, role: undefined },
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post("/api/users/register")
          .send(testCase);
        expect(response.statusCode).toBe(400);
        // Add more specific message checks if your validation provides them
        expect(response.body.message).toBeDefined();
      }
    });
    it("should return 400 for invalid email format", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({ ...validStudentData, email: "invalid-email" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(
        /Please provide a valid email address/i
      );
    });

    it("should return 400 for a weak password (if policy exists)", async () => {
      // This test depends on your password complexity validation logic
      const response = await request(app)
        .post("/api/users/register")
        .send({ ...validStudentData, password: "weak" });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(
        /password does not meet complexity requirements/i
      );
    });

    it("should return 400 or 403 for an invalid role for self-registration", async () => {
      // Assuming 'admin' or 'supervisor' cannot self-register via this endpoint
      const response = await request(app)
        .post("/api/users/register")
        .send({ ...validStudentData, role: "admin" });

      expect([400, 403]).toContain(response.statusCode);
      expect(response.body.message).toMatch(/invalid role for registration/i);
    });

    // Example for a role-specific field validation, if student_id_number is unique
    /*
    it('should return 409 if student_id_number already exists', async () => {      authModel.findUserByEmail.mockResolvedValue(null); // Email is fine
      // Assume another model/method checks for student_id_number uniqueness
      // const studentModel = jest.requireMock('../../models/studentModel.js'); // hypothetical
      jest.mock('../../models/studentModel.js', () => ({ findStudentByStudentIdNumber: jest.fn() }));
      // studentModel.findStudentByStudentIdNumber.mockResolvedValue({ id: 'anotherStudent', student_id_number: validStudentData.student_id_number });

      const response = await request(app)
        .post('/api/users/register')
        .send(validStudentData);

      expect(response.statusCode).toBe(409);
      expect(response.body.message).toMatch(/student id already in use/i);
      studentModel.findStudentByStudentIdNumber.mockRestore(); // Clean up mock for this specific model if needed
    });
    */
    // Note: If student_id_number uniqueness is handled by the DB schema and createUser,
    // then the createUser mock might need to throw a specific error for that case.
    // For this example, I'm keeping authModel mocks simple.
  });
});
