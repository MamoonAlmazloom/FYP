import { describe, it, expect, beforeEach, vi } from "vitest";
import { http, HttpResponse } from "msw";
import {
  server,
  mockSuccessResponse,
  mockErrorResponse,
  mockUser,
  mockToken,
} from "../setup.js";
import {
  login,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
  initializeAuth,
  getUserPrimaryRole,
  hasRole,
  getDashboardRoute,
  getStudentRoute,
} from "../../API/authAPI.jsx";
import api from "../../API/clientAPI.jsx";

describe("AuthAPI", () => {
  beforeEach(() => {
    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];
  });

  describe("login", () => {
    it("should login successfully and store token and user data", async () => {
      const loginData = { email: "test@example.com", password: "password123" };
      const responseData = {
        success: true,
        token: mockToken,
        user: mockUser,
      };

      server.use(
        http.post("http://localhost:5000/api/auth/login", () => {
          return HttpResponse.json(responseData);
        })
      );

      const result = await login(loginData.email, loginData.password);

      expect(result).toEqual(responseData);
      expect(localStorage.getItem("token")).toBe(mockToken);
      expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
      expect(api.defaults.headers.common["Authorization"]).toBe(
        `Bearer ${mockToken}`
      );
    });

    it("should handle login failure", async () => {
      server.use(
        http.post("http://localhost:5000/api/auth/login", () => {
          return HttpResponse.json(
            { success: false, message: "Invalid credentials" },
            { status: 401 }
          );
        })
      );

      await expect(login("wrong@email.com", "wrongpassword")).rejects.toThrow();
    });

    it("should not store data if login unsuccessful", async () => {
      const responseData = {
        success: false,
        message: "Invalid credentials",
      };

      server.use(
        http.post("http://localhost:5000/api/auth/login", () => {
          return HttpResponse.json(responseData);
        })
      );

      const result = await login("test@example.com", "wrongpassword");

      expect(result).toEqual(responseData);
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  describe("logout", () => {
    it("should clear localStorage and remove authorization header", () => {
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));
      api.defaults.headers.common["Authorization"] = `Bearer ${mockToken}`;

      logout();

      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
      expect(api.defaults.headers.common["Authorization"]).toBeUndefined();
    });
  });

  describe("getCurrentUser", () => {
    it("should return parsed user data from localStorage", () => {
      localStorage.setItem("user", JSON.stringify(mockUser));

      const result = getCurrentUser();

      expect(result).toEqual(mockUser);
    });

    it("should return null if no user data exists", () => {
      const result = getCurrentUser();

      expect(result).toBeNull();
    });

    it("should return null if user data is invalid JSON", () => {
      localStorage.setItem("user", "invalid-json");
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const result = getCurrentUser();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error parsing user data:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("getToken", () => {
    it("should return token from localStorage", () => {
      localStorage.setItem("token", mockToken);

      const result = getToken();

      expect(result).toBe(mockToken);
    });

    it("should return null if no token exists", () => {
      const result = getToken();

      expect(result).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("should return true when both token and user exist", () => {
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));

      const result = isAuthenticated();

      expect(result).toBe(true);
    });

    it("should return false when token is missing", () => {
      localStorage.setItem("user", JSON.stringify(mockUser));

      const result = isAuthenticated();

      expect(result).toBe(false);
    });

    it("should return false when user is missing", () => {
      localStorage.setItem("token", mockToken);

      const result = isAuthenticated();

      expect(result).toBe(false);
    });

    it("should return false when both are missing", () => {
      const result = isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe("initializeAuth", () => {
    it("should set authorization header if token exists", () => {
      localStorage.setItem("token", mockToken);

      initializeAuth();

      expect(api.defaults.headers.common["Authorization"]).toBe(
        `Bearer ${mockToken}`
      );
    });

    it("should not set authorization header if no token exists", () => {
      initializeAuth();

      expect(api.defaults.headers.common["Authorization"]).toBeUndefined();
    });
  });

  describe("getUserPrimaryRole", () => {
    it("should return first role from roles array", () => {
      const user = { ...mockUser, roles: ["Manager", "Supervisor"] };

      const result = getUserPrimaryRole(user);

      expect(result).toBe("Manager");
    });

    it("should return null for user without roles", () => {
      const user = { ...mockUser, roles: [] };

      const result = getUserPrimaryRole(user);

      expect(result).toBeNull();
    });

    it("should return null for null user", () => {
      const result = getUserPrimaryRole(null);

      expect(result).toBeNull();
    });

    it("should return null for user with no roles property", () => {
      const user = { ...mockUser };
      delete user.roles;

      const result = getUserPrimaryRole(user);

      expect(result).toBeNull();
    });
  });

  describe("hasRole", () => {
    it("should return true when user has the specified role", () => {
      const user = { ...mockUser, roles: ["Student", "Supervisor"] };

      const result = hasRole(user, "Student");

      expect(result).toBe(true);
    });

    it("should return false when user does not have the specified role", () => {
      const user = { ...mockUser, roles: ["Student"] };

      const result = hasRole(user, "Manager");

      expect(result).toBe(false);
    });

    it("should return false for null user", () => {
      const result = hasRole(null, "Student");

      expect(result).toBe(false);
    });

    it("should return false for user without roles", () => {
      const user = { ...mockUser };
      delete user.roles;

      const result = hasRole(user, "Student");

      expect(result).toBe(false);
    });
  });

  describe("getDashboardRoute", () => {
    it("should return correct route for Manager", () => {
      const user = { ...mockUser, roles: ["Manager"] };

      const result = getDashboardRoute(user);

      expect(result).toBe("/manager/dashboard");
    });

    it("should return correct route for Supervisor", () => {
      const user = { ...mockUser, roles: ["Supervisor"] };

      const result = getDashboardRoute(user);

      expect(result).toBe("/supervisor/dashboard");
    });

    it("should return correct route for SV (alternative naming)", () => {
      const user = { ...mockUser, roles: ["SV"] };

      const result = getDashboardRoute(user);

      expect(result).toBe("/supervisor/dashboard");
    });

    it("should return correct route for Moderator", () => {
      const user = { ...mockUser, roles: ["Moderator"] };

      const result = getDashboardRoute(user);

      expect(result).toBe("/moderator/dashboard");
    });

    it("should return correct route for Examiner", () => {
      const user = { ...mockUser, roles: ["Examiner"] };

      const result = getDashboardRoute(user);

      expect(result).toBe("/examiner/dashboard");
    });

    it("should return null for Student (requires additional logic)", () => {
      const user = { ...mockUser, roles: ["Student"] };

      const result = getDashboardRoute(user);

      expect(result).toBeNull();
    });

    it("should return login route for unknown role", () => {
      const user = { ...mockUser, roles: ["UnknownRole"] };

      const result = getDashboardRoute(user);

      expect(result).toBe("/login");
    });
  });

  describe("getStudentRoute", () => {
    it("should return project-work route when student has active projects", async () => {
      server.use(
        http.get("http://localhost:5000/api/students/1/projects", () => {
          return HttpResponse.json({
            success: true,
            projects: [{ id: 1, title: "Active Project" }],
          });
        })
      );

      const result = await getStudentRoute(1);

      expect(result).toBe("/student/project-work");
    });

    it("should return choose-path route when student has no projects", async () => {
      server.use(
        http.get("http://localhost:5000/api/students/1/projects", () => {
          return HttpResponse.json({
            success: true,
            projects: [],
          });
        })
      );

      const result = await getStudentRoute(1);

      expect(result).toBe("/student/choose-path");
    });

    it("should return choose-path route on API error", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      server.use(
        http.get("http://localhost:5000/api/students/1/projects", () => {
          return HttpResponse.json(
            { success: false, message: "Error" },
            { status: 500 }
          );
        })
      );

      const result = await getStudentRoute(1);

      expect(result).toBe("/student/choose-path");
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
