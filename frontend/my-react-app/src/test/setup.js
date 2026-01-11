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

export const mockSubmissionData = {
  id: 1,
  projectId: 1,
  fileName: "project-final.pdf",
  fileUrl: "submissions/project-final.pdf",
  fileSize: 2048576,
  submittedDate: "2024-01-15T10:00:00Z",
  submissionNotes: "Final submission for evaluation",
};

export const mockFeedbackData = {
  id: 1,
  rating: "excellent",
  grade: 85,
  comments: "Good work, keep it up!",
};

export const mockLogsData = [
  { id: 1, title: "Week 1 Progress", content: "Made good progress" },
  { id: 2, title: "Week 2 Progress", content: "Continued development" },
];

export const mockReportsData = [
  { id: 1, title: "Mid-term Report", type: "midterm" },
  { id: 2, title: "Final Report", type: "final" },
];

export const mockEvaluationsData = [
  {
    id: 1,
    projectId: 1,
    projectTitle: "AI Classification System",
    studentName: "John Doe",
    grade: 85,
    evaluationDate: "2024-01-10",
  },
  {
    id: 2,
    projectId: 2,
    projectTitle: "Web Development Framework",
    studentName: "Jane Smith",
    grade: 92,
    evaluationDate: "2024-01-05",
  },
];

// Default handlers for common API endpoints
const defaultHandlers = [
  // ClientAPI specific error test handlers (must come before generic handlers)
  http.get("http://localhost:5000/test-disabled", () => {
    return HttpResponse.json(
      { disabled: true, message: "Account disabled" },
      { status: 403 }
    );
  }),
  http.get("http://localhost:5000/test-403", () => {
    return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
  }),
  http.get("http://localhost:5000/test-404", () => {
    return HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

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
    "http://localhost:5000/api/students/:studentId/select-project",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({
          message: "Project selected successfully",
          project: mockProjectData,
        })
      );
    }
  ),
  http.post(
    "http://localhost:5000/api/students/:studentId/select-project/:projectId",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({
          message: "Project selected successfully",
          project: mockProjectData,
        })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/students/:studentId/progress-logs",
    () => {
      return HttpResponse.json(mockSuccessResponse({ logs: mockLogsData }));
    }
  ),
  http.post(
    "http://localhost:5000/api/students/:studentId/progress-logs",
    async ({ request }) => {
      const data = await request.json();
      return HttpResponse.json(
        mockSuccessResponse({ log: { id: 1, title: data.title, ...data } })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/students/:studentId/progress-reports",
    ({ request }) => {
      const url = new URL(request.url);
      const startDate = url.searchParams.get("startDate");
      const endDate = url.searchParams.get("endDate");
      return HttpResponse.json(
        mockSuccessResponse({ reports: mockReportsData })
      );
    }
  ),
  http.post(
    "http://localhost:5000/api/students/:studentId/progress-reports",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ report: { id: 1, title: "Final Report" } })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/students/:studentId/feedback",
    ({ request }) => {
      const url = new URL(request.url);
      const type = url.searchParams.get("type");
      const feedback =
        type === "report"
          ? { id: 1, comments: "Report feedback", rating: "excellent" }
          : { id: 1, comments: "Good work, keep it up!", rating: "excellent" };
      return HttpResponse.json(mockSuccessResponse({ feedback }));
    }
  ),
  http.get("http://localhost:5000/api/students/1/has-active-project", () => {
    return HttpResponse.json(mockSuccessResponse({ hasActiveProject: true }));
  }),
  http.get("http://localhost:5000/api/students/2/has-active-project", () => {
    return HttpResponse.json(mockSuccessResponse({ hasActiveProject: false }));
  }),
  http.get(
    "http://localhost:5000/api/students/:studentId/has-active-project",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ hasActiveProject: false })
      );
    }
  ),
  http.get("http://localhost:5000/api/students/1/active-project", () => {
    return HttpResponse.json(mockSuccessResponse({ project: mockProjectData }));
  }),
  http.get("http://localhost:5000/api/students/999/active-project", () => {
    return HttpResponse.json(
      { success: false, message: "No active project found" },
      { status: 404 }
    );
  }),
  http.get(
    "http://localhost:5000/api/students/:studentId/active-project",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ project: mockProjectData })
      );
    }
  ), // Supervisor endpoints
  http.get(
    "http://localhost:5000/api/supervisors/:supervisorId/students",
    ({ request }) => {
      const url = new URL(request.url);
      const includePrevious = url.searchParams.get("includePrevious");
      // Return different results based on includePrevious parameter for testing
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
  // These specific supervisor handlers were causing 500 errors due to missing handlers
  http.post(
    "http://localhost:5000/api/supervisors/:supervisorId/proposal-decision/:proposalId",
    async ({ request }) => {
      const body = await request.json();
      return HttpResponse.json(
        mockSuccessResponse({
          message: "Decision submitted successfully",
          proposal: { ...mockProposalData, status: "approved" },
        })
      );
    }
  ),
  http.post(
    "http://localhost:5000/api/supervisors/:supervisorId/review-proposal/:proposalId",
    async ({ request }) => {
      const body = await request.json();
      return HttpResponse.json(
        mockSuccessResponse({
          message: "Review submitted successfully",
          review: body,
        })
      );
    }
  ),
  http.post(
    "http://localhost:5000/api/supervisors/:supervisorId/feedback/report/:reportId",
    async ({ request }) => {
      const body = await request.json();
      return HttpResponse.json(
        mockSuccessResponse({
          message: "Feedback provided successfully",
          feedback: { ...body, reportId: request.params.reportId },
        })
      );
    }
  ), // Supervisor endpoints - specific handlers that were causing 500 errors
  // Most specific handlers are removed to allow test-specific overrides
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
      return HttpResponse.json(mockSuccessResponse({ logs: mockLogsData }));
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
      return HttpResponse.json(
        mockSuccessResponse({ reports: mockReportsData })
      );
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
  http.post(
    "http://localhost:5000/api/supervisors/:supervisorId/feedback/:studentId/:reportId",
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
  }), // Manager endpoints
  http.get("http://localhost:5000/api/managers/:managerId/users", () => {
    return HttpResponse.json(mockSuccessResponse({ users: [mockUser] }));
  }),
  http.put(
    "http://localhost:5000/api/managers/:managerId/user-eligibility/:userId",
    async ({ request }) => {
      const body = await request.json();
      if (body.status === "invalid") {
        return HttpResponse.json(
          { success: false, message: "Invalid status" },
          { status: 400 }
        );
      }
      return HttpResponse.json(
        mockSuccessResponse({
          message: "User eligibility updated successfully",
          user: { ...mockUser, status: body.status },
        })
      );
    }
  ),
  http.post(
    "http://localhost:5000/api/managers/:managerId/register-user",
    async ({ request }) => {
      const body = await request.json();
      if (!body.name || !body.email) {
        return HttpResponse.json(
          { success: false, message: "Missing required fields" },
          { status: 400 }
        );
      }
      return HttpResponse.json(
        mockSuccessResponse({
          message: "User registered successfully",
          user: { id: 123, ...body },
        })
      );
    }
  ),
  http.get(
    "http://localhost:5000/api/managers/:managerId/approved-projects",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({ projects: [mockProjectData] })
      );
    }
  ),
  http.post(
    "http://localhost:5000/api/managers/:managerId/assign-examiner",
    () => {
      return HttpResponse.json(
        mockSuccessResponse({
          message: "Examiner assigned successfully",
          assignment: { projectId: 1, examinerId: 1, examinerType: "internal" },
        })
      );
    }
  ),
  http.put(
    "http://localhost:5000/api/managers/:managerId/users/:userId/status",
    async ({ request }) => {
      const data = await request.json();
      const status = data.status;
      if (!["active", "inactive", "pending"].includes(status)) {
        return HttpResponse.json(
          { success: false, message: "Invalid status" },
          { status: 400 }
        );
      }
      return HttpResponse.json(
        mockSuccessResponse({
          message: "Status updated",
          user: { ...mockUser, status },
        })
      );
    }
  ),
  http.post(
    "http://localhost:5000/api/managers/:managerId/users/register",
    async ({ request }) => {
      const userData = await request.json();
      if (!userData.email || !userData.name) {
        return HttpResponse.json(
          { success: false, message: "Validation failed" },
          { status: 400 }
        );
      }
      return HttpResponse.json(
        mockSuccessResponse({
          message: "User registered",
          user: { id: 2, ...userData },
        })
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
    return HttpResponse.json(
      mockSuccessResponse({ projects: [mockProjectData] })
    );
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
  http.get(
    "http://localhost:5000/api/managers/:managerId/student-logs/:studentId",
    () => {
      const managerLogs = [
        { id: 1, title: "Week 1", content: "Initial progress" },
        { id: 2, title: "Week 2", content: "Continued work" },
      ];
      return HttpResponse.json(mockSuccessResponse({ logs: managerLogs }));
    }
  ),
  http.get(
    "http://localhost:5000/api/managers/:managerId/students/:studentId/logs",
    () => {
      const managerLogs = [
        { id: 1, title: "Week 1", content: "Initial progress" },
        { id: 2, title: "Week 2", content: "Continued work" },
      ];
      return HttpResponse.json(mockSuccessResponse({ logs: managerLogs }));
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
  http.get("http://localhost:5000/api/managers/:managerId/roles", () => {
    return HttpResponse.json(
      mockSuccessResponse({ roles: ["Student", "Supervisor"] })
    );
  }),
  http.get("http://localhost:5000/api/managers/:managerId/examiners", () => {
    return HttpResponse.json(
      mockSuccessResponse({ examiners: [{ id: 1, name: "Dr. Examiner" }] })
    );
  }),
  http.get(
    "http://localhost:5000/api/managers/:managerId/previous-projects",
    () => {
      return HttpResponse.json(mockSuccessResponse({ projects: [] }));
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

  // Examiner endpoints - Removed all handlers to allow test-specific overrides
  // Tests should define their own handlers using server.use()

  // Generic fallback handlers removed to allow test-specific overrides
  // Tests should define their own handlers using server.use()

  // Only keep specific handlers for endpoints that need them
  // ClientAPI test endpoints - both absolute and relative URLs for compatibility
  http.get("http://localhost:5000/test-disabled", () => {
    return HttpResponse.json(
      { disabled: true, message: "Account disabled" },
      { status: 403 }
    );
  }),
  http.get("http://localhost:5000/test-403", () => {
    return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
  }),
  http.get("http://localhost:5000/test-404", () => {
    return HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
  http.get("http://localhost:5000/test", () => {
    return HttpResponse.json({ success: true, data: "test" });
  }),
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
  }),
  http.get("http://localhost:5000/api/slow", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return HttpResponse.json({ data: "slow response" });
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
