import { describe, it, expect, beforeEach, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../setup.js";
import axios from "axios";

// Create a fresh API instance for testing to avoid interference
const createTestApiInstance = () => {
  const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  // Add the same response interceptor as the real clientAPI
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Check if the error is due to disabled account
      if (error.response?.status === 403 && error.response?.data?.disabled) {
        // Clear user data and redirect to login with disabled message
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        // Store the disabled message for display
        localStorage.setItem("accountDisabled", "true");

        // Redirect to login page
        window.location.href = "/login";

        return Promise.reject({
          ...error,
          isAccountDisabled: true,
          message: "Your account has been disabled by an administrator",
        });
      }

      return Promise.reject(error);
    }
  );

  return api;
};

describe("ClientAPI", () => {
  let api;

  beforeEach(() => {
    localStorage.clear();
    // Create a fresh API instance for each test
    api = createTestApiInstance();
  });

  describe("API configuration", () => {
    it("should have correct base configuration", () => {
      expect(api.defaults.baseURL).toBe("http://localhost:5000");
      expect(api.defaults.headers["Content-Type"]).toBe("application/json");
      expect(api.defaults.timeout).toBe(10000);
    });
  });
  describe("Response interceptor", () => {
    it("should pass through successful responses", async () => {
      server.use(
        http.get("http://localhost:5000/test", () => {
          return HttpResponse.json({ success: true, data: "test" });
        })
      );

      const response = await api.get("/test");

      expect(response.data).toEqual({ success: true, data: "test" });
    });
  });
  describe("HTTP methods", () => {
    beforeEach(() => {
      // Set up common handlers for this describe block
      server.use(
        http.get("http://localhost:5000/api/test", ({ request }) => {
          const authHeader = request.headers.get("Authorization");
          const customHeader = request.headers.get("X-Custom-Header");
          return HttpResponse.json({
            method: "GET",
            authHeader,
            customHeader,
          });
        }),
        http.post("http://localhost:5000/api/test", async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({ method: "POST", data: body });
        }),
        http.put("http://localhost:5000/api/test/1", async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({ method: "PUT", data: body });
        }),
        http.delete("http://localhost:5000/api/test/1", () => {
          return HttpResponse.json({ method: "DELETE", deleted: true });
        })
      );
    });

    it("should make GET requests", async () => {
      const response = await api.get("http://localhost:5000/api/test");
      expect(response.data).toEqual({
        method: "GET",
        authHeader: null,
        customHeader: null,
      });
    });
  });
});
