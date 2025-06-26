import request from "supertest";
import app from "../../app.js"; // Adjust path to your Express app

jest.mock("../../models/supervisorModel.js", () => ({
  getStudentsBySupervisor: jest.fn(),
}));
import supervisorModel from "../../models/supervisorModel.js";

describe("Supervisor Endpoints (F3: Progress Tracking)", () => {
  let supervisorToken;
  const supervisorId = "supervisor789";
  beforeAll(() => {
    supervisorToken = global.getSupervisorToken
      ? global.getSupervisorToken({ id: supervisorId, userId: supervisorId })
      : "dummySupervisorToken";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TC-B3.8: View Current Student List (Supervisor)
  describe("GET /api/supervisors/my/students (Supervisor View Current Students)", () => {
    it("should allow a supervisor to view their list of currently supervised students", async () => {
      const mockStudentList = [
        {
          student_id: "student1",
          name: "Alice Wonderland",
          project_title: "AI Adventures",
        },
        {
          student_id: "student2",
          name: "Bob The Builder",
          project_title: "Constructing Test Cases",
        },
      ];
      supervisorModel.getStudentsBySupervisor.mockResolvedValue(
        mockStudentList
      );

      const response = await request(app)
        .get("/api/supervisors/my/students") // Endpoint assumes supervisor ID is from token
        .set("Authorization", `Bearer ${supervisorToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.students).toEqual(mockStudentList);
      expect(supervisorModel.getStudentsBySupervisor).toHaveBeenCalledWith(
        supervisorId,
        false
      );
    });

    it("should return an empty list if supervisor has no current students", async () => {
      supervisorModel.getStudentsBySupervisor.mockResolvedValue([]);
      const response = await request(app)
        .get("/api/supervisors/my/students")
        .set("Authorization", `Bearer ${supervisorToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.students).toEqual([]);
    });

    it("should return 403 if a non-supervisor tries to access", async () => {
      const studentToken = global.getStudentToken
        ? global.getStudentToken()
        : "dummyStudentToken";
      const response = await request(app)
        .get("/api/supervisors/my/students")
        .set("Authorization", `Bearer ${studentToken}`); // Using student token
      expect(response.statusCode).toBe(403);
    });
  });
});
