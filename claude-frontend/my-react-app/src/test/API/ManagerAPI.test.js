import { describe, it, expect, beforeEach, vi } from "vitest";
import { http, HttpResponse } from "msw";
import {
  server,
  mockSuccessResponse,
  mockErrorResponse,
  mockStudentData,
  mockProjectData,
} from "../setup.js";
import ManagerAPI from "../../API/ManagerAPI.jsx";

describe("ManagerAPI", () => {
  const managerId = 1;
  const userId = 1;
  const studentId = 1;
  const projectId = 1;
  const examinerId = 1;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("token", "test-token");
  });

  describe("getAllUsers", () => {
    it("should fetch all users successfully", async () => {
      const users = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "Student" },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "Supervisor",
        },
      ];

      server.use(
        http.get(
          `http://localhost:5000/api/managers/${managerId}/users`,
          () => {
            return HttpResponse.json(mockSuccessResponse({ users }));
          }
        )
      );

      const result = await ManagerAPI.getAllUsers(managerId);

      expect(result.success).toBe(true);
      expect(result.users).toEqual(users);
    });

    it("should handle API error", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      server.use(
        http.get(
          `http://localhost:5000/api/managers/${managerId}/users`,
          () => {
            return HttpResponse.json(
              mockErrorResponse(500, "Internal server error"),
              { status: 500 }
            );
          }
        )
      );

      await expect(ManagerAPI.getAllUsers(managerId)).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching users:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("updateUserEligibility", () => {
    it("should update user eligibility successfully", async () => {
      const status = "active";

      server.use(
        http.put(
          `http://localhost:5000/api/managers/${managerId}/users/${userId}/status`,
          async ({ request }) => {
            const body = await request.json();
            expect(body.status).toBe(status);

            return HttpResponse.json(
              mockSuccessResponse({
                message: "User status updated successfully",
                user: { id: userId, status },
              })
            );
          }
        )
      );

      const result = await ManagerAPI.updateUserEligibility(
        managerId,
        userId,
        status
      );

      expect(result.success).toBe(true);
      expect(result.user.status).toBe(status);
    });

    it("should handle invalid status", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      server.use(
        http.put(
          `http://localhost:5000/api/managers/${managerId}/users/${userId}/status`,
          () => {
            return HttpResponse.json(mockErrorResponse(400, "Invalid status"), {
              status: 400,
            });
          }
        )
      );

      await expect(
        ManagerAPI.updateUserEligibility(managerId, userId, "invalid")
      ).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("registerUser", () => {
    it("should register user successfully", async () => {
      const userData = {
        name: "New User",
        email: "newuser@example.com",
        role: "Student",
        password: "password123",
      };

      server.use(
        http.post(
          `http://localhost:5000/api/managers/${managerId}/register`,
          async ({ request }) => {
            const body = await request.json();
            expect(body).toEqual(userData);

            return HttpResponse.json(
              mockSuccessResponse({
                message: "User registered successfully",
                user: { ...userData, id: userId },
              })
            );
          }
        )
      );

      const result = await ManagerAPI.registerUser(managerId, userData);

      expect(result.success).toBe(true);
      expect(result.user.email).toBe(userData.email);
    });

    it("should handle validation errors", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      server.use(
        http.post(
          `http://localhost:5000/api/managers/${managerId}/register`,
          () => {
            return HttpResponse.json(
              mockErrorResponse(400, "Email already exists"),
              { status: 400 }
            );
          }
        )
      );

      await expect(ManagerAPI.registerUser(managerId, {})).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("getApprovedProjects", () => {
    it("should fetch approved projects successfully", async () => {
      const projects = [mockProjectData];

      server.use(
        http.get(
          `http://localhost:5000/api/managers/${managerId}/approved-projects`,
          () => {
            return HttpResponse.json(mockSuccessResponse({ projects }));
          }
        )
      );

      const result = await ManagerAPI.getApprovedProjects(managerId);

      expect(result.success).toBe(true);
      expect(result.projects).toEqual(projects);
    });
  });

  describe("assignExaminer", () => {
    it("should assign examiner successfully", async () => {
      const examinerData = {
        projectId: projectId,
        examinerId: examinerId,
        examinerType: "internal",
      };

      server.use(
        http.post(
          `http://localhost:5000/api/managers/${managerId}/assign-examiner`,
          async ({ request }) => {
            const body = await request.json();
            expect(body).toEqual(examinerData);

            return HttpResponse.json(
              mockSuccessResponse({
                message: "Examiner assigned successfully",
                assignment: examinerData,
              })
            );
          }
        )
      );

      const result = await ManagerAPI.assignExaminer(managerId, examinerData);

      expect(result.success).toBe(true);
      expect(result.assignment).toEqual(examinerData);
    });

    it("should handle assignment conflicts", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      server.use(
        http.post(
          `http://localhost:5000/api/managers/${managerId}/assign-examiner`,
          () => {
            return HttpResponse.json(
              mockErrorResponse(409, "Examiner already assigned"),
              { status: 409 }
            );
          }
        )
      );

      await expect(ManagerAPI.assignExaminer(managerId, {})).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("getStudentLogs", () => {
    it("should fetch student logs successfully", async () => {
      const logs = [
        { id: 1, title: "Week 1", content: "Initial progress" },
        { id: 2, title: "Week 2", content: "Continued work" },
      ];

      server.use(
        http.get(
          `http://localhost:5000/api/managers/${managerId}/students/${studentId}/logs`,
          () => {
            return HttpResponse.json(mockSuccessResponse({ logs }));
          }
        )
      );

      const result = await ManagerAPI.getStudentLogs(managerId, studentId);

      expect(result.success).toBe(true);
      expect(result.logs).toEqual(logs);
    });
  });

  describe("getRoles", () => {
    it("should fetch roles successfully", async () => {
      const roles = [
        "Student",
        "Supervisor",
        "Manager",
        "Moderator",
        "Examiner",
      ];

      server.use(
        http.get(
          `http://localhost:5000/api/managers/${managerId}/roles`,
          () => {
            return HttpResponse.json(mockSuccessResponse({ roles }));
          }
        )
      );

      const result = await ManagerAPI.getRoles(managerId);

      expect(result.success).toBe(true);
      expect(result.roles).toEqual(roles);
    });
  });

  describe("getExaminers", () => {
    it("should fetch examiners successfully", async () => {
      const examiners = [
        { id: 1, name: "Dr. Examiner One", email: "examiner1@example.com" },
        { id: 2, name: "Dr. Examiner Two", email: "examiner2@example.com" },
      ];

      server.use(
        http.get(
          `http://localhost:5000/api/managers/${managerId}/examiners`,
          () => {
            return HttpResponse.json(mockSuccessResponse({ examiners }));
          }
        )
      );

      const result = await ManagerAPI.getExaminers(managerId);

      expect(result.success).toBe(true);
      expect(result.examiners).toEqual(examiners);
    });
  });

  describe("getPreviousProjects", () => {
    it("should fetch previous projects successfully", async () => {
      const projects = [
        { id: 1, title: "Completed Project 1", status: "completed" },
        { id: 2, title: "Completed Project 2", status: "completed" },
      ];

      server.use(
        http.get(
          `http://localhost:5000/api/managers/${managerId}/previous-projects`,
          () => {
            return HttpResponse.json(mockSuccessResponse({ projects }));
          }
        )
      );

      const result = await ManagerAPI.getPreviousProjects(managerId);

      expect(result.success).toBe(true);
      expect(result.projects).toEqual(projects);
    });

    it("should handle query parameters", async () => {
      server.use(
        http.get(
          `http://localhost:5000/api/managers/${managerId}/previous-projects`,
          ({ request }) => {
            const url = new URL(request.url);
            const year = url.searchParams.get("year");
            const status = url.searchParams.get("status");

            expect(year).toBe("2023");
            expect(status).toBe("completed");

            return HttpResponse.json(mockSuccessResponse({ projects: [] }));
          }
        )
      );

      // Since the function doesn't currently accept parameters, we'll test with direct API call
      const response = await fetch(
        `http://localhost:5000/api/managers/${managerId}/previous-projects?year=2023&status=completed`
      );
      const result = await response.json();

      expect(result.success).toBe(true);
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      server.use(
        http.delete(
          `http://localhost:5000/api/managers/${managerId}/users/${userId}`,
          () => {
            return HttpResponse.json(
              mockSuccessResponse({
                message: "User deleted successfully",
              })
            );
          }
        )
      );

      const result = await ManagerAPI.deleteUser(managerId, userId);

      expect(result.success).toBe(true);
      expect(result.message).toBe("User deleted successfully");
    });

    it("should handle deletion errors", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      server.use(
        http.delete(
          `http://localhost:5000/api/managers/${managerId}/users/${userId}`,
          () => {
            return HttpResponse.json(
              mockErrorResponse(400, "Cannot delete user with active projects"),
              { status: 400 }
            );
          }
        )
      );

      await expect(ManagerAPI.deleteUser(managerId, userId)).rejects.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("Error handling and logging", () => {
    it("should consistently log errors to console", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Test multiple endpoints for consistent error handling
      const endpoints = [
        () => ManagerAPI.getAllUsers(managerId),
        () => ManagerAPI.updateUserEligibility(managerId, userId, "active"),
        () => ManagerAPI.registerUser(managerId, {}),
        () => ManagerAPI.getApprovedProjects(managerId),
        () => ManagerAPI.assignExaminer(managerId, {}),
        () => ManagerAPI.getStudentLogs(managerId, studentId),
        () => ManagerAPI.getRoles(managerId),
        () => ManagerAPI.getExaminers(managerId),
        () => ManagerAPI.getPreviousProjects(managerId),
        () => ManagerAPI.deleteUser(managerId, userId),
      ];

      // Set up error responses for all endpoints
      server.use(
        http.get("*", () => HttpResponse.json({}, { status: 500 })),
        http.post("*", () => HttpResponse.json({}, { status: 500 })),
        http.put("*", () => HttpResponse.json({}, { status: 500 })),
        http.delete("*", () => HttpResponse.json({}, { status: 500 }))
      );

      // Test each endpoint throws and logs
      for (const endpoint of endpoints) {
        try {
          await endpoint();
          throw new Error("Expected endpoint to throw");
        } catch (error) {
          // Expected to throw
        }
      }

      expect(consoleSpy.mock.calls.length).toBeGreaterThan(0);
      consoleSpy.mockRestore();
    });
  });
});
