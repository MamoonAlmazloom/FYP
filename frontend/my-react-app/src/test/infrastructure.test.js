import { describe, it, expect, beforeEach, vi } from "vitest";
import { server } from "./setup.js";

// This is a test suite to verify our testing infrastructure
describe("Test Infrastructure", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Setup and Configuration", () => {
    it("should have MSW server running", () => {
      expect(server).toBeDefined();
    });

    it("should clear localStorage between tests", () => {
      localStorage.setItem("test", "value");
      expect(localStorage.getItem("test")).toBe("value");
      // localStorage should be cleared by beforeEach in next test
    });

    it("should have cleared localStorage from previous test", () => {
      expect(localStorage.getItem("test")).toBeNull();
    });

    it("should have jsdom environment", () => {
      expect(typeof window).toBe("object");
      expect(typeof document).toBe("object");
      expect(typeof localStorage).toBe("object");
    });
  });

  describe("Testing Utilities", () => {
    it("should support async/await", async () => {
      const promise = Promise.resolve("test");
      const result = await promise;
      expect(result).toBe("test");
    });

    it("should support mocking", () => {
      const mockFn = vi.fn();
      mockFn("test");
      expect(mockFn).toHaveBeenCalledWith("test");
    });
  });
});
