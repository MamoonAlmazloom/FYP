import "@testing-library/jest-dom";
import { beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

// Mock implementations for common use cases
export const mockSuccessResponse = (data) => ({ success: true, ...data });

export const mockErrorResponse = (status, message) => ({
  success: false,
  message,
});

// Common test data
export const mockUser = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  roles: ["Student"],
};

export const mockToken = "mock-jwt-token";

export const mockStudentData = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  studentId: "STU001",
};

export const mockSupervisorData = {
  id: 1,
  name: "Dr. Jane Smith",
  email: "jane@example.com",
  department: "Computer Science",
};

export const mockProposalData = {
  id: 1,
  title: "Test Project",
  description: "Test project description",
  status: "pending",
  studentId: 1,
  supervisorId: 1,
};

export const mockProjectData = {
  id: 1,
  title: "Approved Project",
  description: "Approved project description",
  status: "active",
  studentId: 1,
  supervisorId: 1,
};

// Default handlers for common API endpoints
const defaultHandlers = [
  // Auth endpoints
  http.post("http://localhost:5000/api/auth/login", () => {
    return HttpResponse.json({
      success: true,
      token: "mock-token",
      user: mockUser,
    });
  }),
  http.post("http://localhost:5000/api/auth/logout", () => {
    return HttpResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  }),

  // Student endpoints
  http.get("http://localhost:5000/api/students/:studentId", () => {
    return HttpResponse.json(mockSuccessResponse({ student: mockStudentData }));
  }),
  http.get("http://localhost:5000/api/students/:studentId/projects", () => {
    return HttpResponse.json(
      mockSuccessResponse({ projects: [mockProjectData] })
    );
  }),
  http.get("http://localhost:5000/api/students/:studentId/proposals", () => {
    return HttpResponse.json(
      mockSuccessResponse({ proposals: [mockProposalData] })
    );
  }),
  http.post("http://localhost:5000/api/students/:studentId/proposals", () => {
    return HttpResponse.json(
      mockSuccessResponse({ proposal: mockProposalData })
    );
  }),
  http.put(
    "http://localhost:5000/api/students/:studentId/proposals/:proposalId",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ proposal: mockProposalData })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/students/:studentId/proposals/:proposalId/status",
    () => {
      return HttpResponse.json(mockSuccessResponse({ status: "pending" }));
    }
  ),
  http.get(
    "http://localhost:5000/api/students/:studentId/available-projects",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ projects: [mockProjectData] })
      );
    }
  ),
  http.post(
    "http://localhost:5000/api/students/:studentId/select-project/:projectId",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ project: mockProjectData })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/students/:studentId/progress-logs",
    () => {
      return HttpResponse.json(mockSuccessResponse({ logs: [] }));
    }
  ),
  http.post(
    "http://localhost:5000/api/students/:studentId/progress-logs",
    () => {
      return HttpResponse.json(mockSuccessResponse({ log: { id: 1 } }));
    }
  ),
  http.get(
    "http://localhost:5000/api/students/:studentId/progress-reports",
    () => {
      return HttpResponse.json(mockSuccessResponse({ reports: [] }));
    }
  ),
  http.post(
    "http://localhost:5000/api/students/:studentId/progress-reports",
    () => {
      return HttpResponse.json(mockSuccessResponse({ report: { id: 1 } }));
    }
  ),
  http.get("http://localhost:5000/api/students/:studentId/feedback", () => {
    return HttpResponse.json(mockSuccessResponse({ feedback: [] }));
  }),
  http.get(
    "http://localhost:5000/api/students/:studentId/has-active-project",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ hasActiveProject: false })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/students/:studentId/active-project",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ project: mockProjectData })
      );
    }
  ),

  // Supervisor endpoints
  http.get(
    "http://localhost:5000/api/supervisors/:supervisorId/students",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ students: [mockStudentData] })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/supervisors/:supervisorId/proposals",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ proposals: [mockProposalData] })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/supervisors/:supervisorId/my-proposals",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ proposals: [mockProposalData] })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/supervisors/:supervisorId/proposals/:proposalId",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ proposal: mockProposalData })
      );
    }
  ),
  http.post(
    "http://localhost:5000/api/supervisors/:supervisorId/proposals/:proposalId/decision",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ message: "Decision recorded" })
      );
    }
  ),
  http.post(
    "http://localhost:5000/api/supervisors/:supervisorId/proposals/:proposalId/review",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ message: "Review submitted" })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/supervisors/:supervisorId/students/:studentId",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ student: mockStudentData })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/supervisors/:supervisorId/students/:studentId/logs",
    () => {
      return HttpResponse.json(mockSuccessResponse({ logs: [] }));
    }
  ),
  http.post(
    "http://localhost:5000/api/supervisors/:supervisorId/students/:studentId/logs/:logId/feedback",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ message: "Feedback provided" })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/supervisors/:supervisorId/students/:studentId/reports",
    () => {
      return HttpResponse.json(mockSuccessResponse({ reports: [] }));
    }
  ),
  http.post(
    "http://localhost:5000/api/supervisors/:supervisorId/students/:studentId/reports/:reportId/feedback",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ message: "Feedback provided" })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/supervisors/:supervisorId/previous-projects",
    () => {
      return HttpResponse.json(mockSuccessResponse({ projects: [] }));
    }
  ),
  http.get(
    "http://localhost:5000/api/supervisors/:supervisorId/projects/:projectId",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ project: mockProjectData })
      );
    }
  ),
  http.post(
    "http://localhost:5000/api/supervisors/:supervisorId/propose-project",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ proposal: mockProposalData })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/supervisors/:supervisorId/supervisor-proposal",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ proposal: mockProposalData })
      );
    }
  ),
  http.put(
    "http://localhost:5000/api/supervisors/:supervisorId/supervisor-proposal",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ proposal: mockProposalData })
      );
    }
  ),
  http.get("http://localhost:5000/api/supervisors", () => {
    return HttpResponse.json(
      mockSuccessResponse({ supervisors: [mockSupervisorData] })
    );
  }),

  // Manager endpoints
  http.get("http://localhost:5000/api/managers/:managerId/users", () => {
    return HttpResponse.json(mockSuccessResponse({ users: [] }));
  }),
  http.put(
    "http://localhost:5000/api/managers/:managerId/users/:userId/status",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ message: "Status updated" })
      );
    }
  ),
  http.delete(
    "http://localhost:5000/api/managers/:managerId/users/:userId",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ message: "User deleted" })
      );
    }
  ),
  http.get("http://localhost:5000/api/managers/:managerId/projects", () => {
    return HttpResponse.json(mockSuccessResponse({ projects: [] }));
  }),
  http.post(
    "http://localhost:5000/api/managers/:managerId/projects/:projectId/assign-examiner",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ message: "Examiner assigned" })
      );
    }
  ),
  http.put(
    "http://localhost:5000/api/managers/:managerId/projects/:projectId/status",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ message: "Status updated" })
      );
    }
  ),
  http.get("http://localhost:5000/api/managers/:managerId/statistics", () => {
    return HttpResponse.json(mockSuccessResponse({ statistics: {} }));
  }),
  http.get("http://localhost:5000/api/managers/:managerId/deadlines", () => {
    return HttpResponse.json(mockSuccessResponse({ deadlines: [] }));
  }),
  http.post("http://localhost:5000/api/managers/:managerId/deadlines", () => {
    return HttpResponse.json(mockSuccessResponse({ deadline: { id: 1 } }));
  }),
  http.put(
    "http://localhost:5000/api/managers/:managerId/deadlines/:deadlineId",
    () => {
      return HttpResponse.json(mockSuccessResponse({ deadline: { id: 1 } }));
    }
  ),
  http.delete(
    "http://localhost:5000/api/managers/:managerId/deadlines/:deadlineId",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ message: "Deadline deleted" })
      );
    }
  ),

  // Moderator endpoints
  http.get("http://localhost:5000/api/moderators/pending-proposals", () => {
    return HttpResponse.json(mockSuccessResponse({ proposals: [] }));
  }),
  http.post(
    "http://localhost:5000/api/moderators/review-proposal/:proposalId",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ message: "Review submitted" })
      );
    }
  ),
  http.post(
    "http://localhost:5000/api/moderators/review-supervisor-proposal/:proposalId",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ message: "Review submitted" })
      );
    }
  ),
  http.get("http://localhost:5000/api/moderators/profile", () => {
    return HttpResponse.json(mockSuccessResponse({ profile: {} }));
  }),
  http.get("http://localhost:5000/api/moderators/proposals/:proposalId", () => {
    return HttpResponse.json(
      mockSuccessResponse({ proposal: mockProposalData })
    );
  }),
  http.get("http://localhost:5000/api/moderators/previous-projects", () => {
    return HttpResponse.json(mockSuccessResponse({ projects: [] }));
  }),

  // Examiner endpoints
  http.get(
    "http://localhost:5000/api/examiners/:examinerId/assigned-projects",
    () => {
      return HttpResponse.json(mockSuccessResponse({ projects: [] }));
    }
  ),
  http.get(
    "http://localhost:5000/api/examiners/:examinerId/projects/:projectId",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ project: mockProjectData })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/examiners/:examinerId/projects/:projectId/submission",
    () => {
      return HttpResponse.json(mockSuccessResponse({ submission: {} }));
    }
  ),
  http.post(
    "http://localhost:5000/api/examiners/:examinerId/projects/:projectId/feedback",
    () => {
      return HttpResponse.json(mockSuccessResponse({ feedback: { id: 1 } }));
    }
  ),
  http.put(
    "http://localhost:5000/api/examiners/:examinerId/feedback/:feedbackId",
    () => {
      return HttpResponse.json(mockSuccessResponse({ feedback: { id: 1 } }));
    }
  ),
  http.get("http://localhost:5000/api/examiners/:examinerId/profile", () => {
    return HttpResponse.json(mockSuccessResponse({ profile: {} }));
  }),
  http.get(
    "http://localhost:5000/api/examiners/:examinerId/previous-evaluations",
    () => {
      return HttpResponse.json(mockSuccessResponse({ evaluations: [] }));
    }
  ),
  http.put(
    "http://localhost:5000/api/examiners/:examinerId/projects/:projectId/status",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ message: "Status updated" })
      );
    }
  ),
  http.get("http://localhost:5000/api/examiners/:examinerId/statistics", () => {
    return HttpResponse.json(mockSuccessResponse({ statistics: {} }));
  }),
  http.post(
    "http://localhost:5000/api/examiners/:examinerId/projects/:projectId/schedule",
    () => {
      return HttpResponse.json(mockSuccessResponse({ examination: { id: 1 } }));
    }
  ),
  http.get(
    "http://localhost:5000/api/examiners/:examinerId/scheduled-examinations",
    () => {
      return HttpResponse.json(mockSuccessResponse({ examinations: [] }));
    }
  ),
  http.post(
    "http://localhost:5000/api/examiners/:examinerId/projects/:projectId/extension",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ message: "Extension requested" })
      );
    }
  ),

  // Generic fallback handlers for any other endpoints
  http.get("http://localhost:5000/api/*", () => {
    return HttpResponse.json(mockSuccessResponse({ data: [] }));
  }),
  http.post("http://localhost:5000/api/*", () => {
    return HttpResponse.json(
      mockSuccessResponse({ message: "Operation completed" })
    );
  }),
  http.put("http://localhost:5000/api/*", () => {
    return HttpResponse.json(
      mockSuccessResponse({ message: "Update completed" })
    );
  }),
  http.delete("http://localhost:5000/api/*", () => {
    return HttpResponse.json(
      mockSuccessResponse({ message: "Delete completed" })
    );
  }),

  // General test endpoint
  http.get("http://localhost:5000/test", () => {
    return HttpResponse.json({ success: true, data: "test" });
  }),
];

// Create MSW server for API mocking
export const server = setupServer(...defaultHandlers);

// Setup server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: "warn" });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  // Clear localStorage after each test
  localStorage.clear();
});

// Close server after all tests
afterAll(() => {
  server.close();
});
