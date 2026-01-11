import { describe, it, expect, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import {
  server,
  mockSuccessResponse,
  mockErrorResponse,
  mockStudentData,
  mockProposalData,
  mockProjectData,
} from "../setup.js";
import {
  getStudentProfile,
  getStudentProjects,
  getStudentProposals,
  submitProposal,
  updateProposal,
  getProposalStatus,
  getAvailableProjects,
  selectProject,
  getProgressLogs,
  submitProgressLog,
  getProgressReports,
  submitProgressReport,
  getFeedback,
  hasActiveProject,
  getActiveProject,
} from "../../API/StudentAPI.jsx";

describe("StudentAPI", () => {
  const studentId = 1;
  const proposalId = 1;
  const projectId = 1;
  const logId = 1;
  const reportId = 1;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("token", "test-token");
  });

  describe("getStudentProfile", () => {
    it("should fetch student profile successfully", async () => {
      server.use(
        http.get(`http://localhost:5000/api/students/${studentId}`, () => {
          return HttpResponse.json(
            mockSuccessResponse({ student: mockStudentData })
          );
        })
      );

      const result = await getStudentProfile(studentId);

      expect(result.success).toBe(true);
      expect(result.student).toEqual(mockStudentData);
    });

    it("should handle API error", async () => {
      server.use(
        http.get(`http://localhost:5000/api/students/${studentId}`, () => {
          return HttpResponse.json(
            mockErrorResponse(404, "Student not found"),
            { status: 404 }
          );
        })
      );

      await expect(getStudentProfile(studentId)).rejects.toThrow();
    });
  });

  describe("getStudentProjects", () => {
    it("should fetch student projects successfully", async () => {
      const projects = [mockProjectData];

      server.use(
        http.get(
          `http://localhost:5000/api/students/${studentId}/projects`,
          () => {
            return HttpResponse.json(mockSuccessResponse({ projects }));
          }
        )
      );

      const result = await getStudentProjects(studentId);

      expect(result.success).toBe(true);
      expect(result.projects).toEqual(projects);
    });

    it("should handle no projects case", async () => {
      server.use(
        http.get(
          `http://localhost:5000/api/students/${studentId}/projects`,
          () => {
            return HttpResponse.json(mockSuccessResponse({ projects: [] }));
          }
        )
      );

      const result = await getStudentProjects(studentId);

      expect(result.success).toBe(true);
      expect(result.projects).toEqual([]);
    });
  });

  describe("getStudentProposals", () => {
    it("should fetch student proposals successfully", async () => {
      const proposals = [mockProposalData];

      server.use(
        http.get(
          `http://localhost:5000/api/students/${studentId}/proposals`,
          () => {
            return HttpResponse.json(mockSuccessResponse({ proposals }));
          }
        )
      );

      const result = await getStudentProposals(studentId);

      expect(result.success).toBe(true);
      expect(result.proposals).toEqual(proposals);
    });
  });

  describe("submitProposal", () => {
    it("should submit proposal successfully", async () => {
      const proposalData = {
        title: "New Project",
        description: "Project description",
      };

      server.use(
        http.post(
          `http://localhost:5000/api/students/${studentId}/proposals`,
          async ({ request }) => {
            const body = await request.json();
            return HttpResponse.json(
              mockSuccessResponse({
                proposal: { ...proposalData, id: proposalId, ...body },
              })
            );
          }
        )
      );

      const result = await submitProposal(studentId, proposalData);

      expect(result.success).toBe(true);
      expect(result.proposal.title).toBe(proposalData.title);
    });

    it("should handle validation errors", async () => {
      server.use(
        http.post(
          `http://localhost:5000/api/students/${studentId}/proposals`,
          () => {
            return HttpResponse.json(
              mockErrorResponse(400, "Title is required"),
              { status: 400 }
            );
          }
        )
      );

      await expect(submitProposal(studentId, {})).rejects.toThrow();
    });
  });

  describe("updateProposal", () => {
    it("should update proposal successfully", async () => {
      const updateData = {
        title: "Updated Project Title",
        description: "Updated description",
      };

      server.use(
        http.put(
          `http://localhost:5000/api/students/${studentId}/proposals/${proposalId}`,
          async ({ request }) => {
            const body = await request.json();
            return HttpResponse.json(
              mockSuccessResponse({
                proposal: { ...mockProposalData, ...body },
              })
            );
          }
        )
      );

      const result = await updateProposal(studentId, proposalId, updateData);

      expect(result.success).toBe(true);
      expect(result.proposal.title).toBe(updateData.title);
    });
  });

  describe("getProposalStatus", () => {
    it("should fetch proposal status successfully", async () => {
      server.use(
        http.get(
          `http://localhost:5000/api/students/${studentId}/proposals/${proposalId}/status`,
          () => {
            return HttpResponse.json(
              mockSuccessResponse({
                status: "approved",
                comments: "Good proposal",
              })
            );
          }
        )
      );

      const result = await getProposalStatus(studentId, proposalId);

      expect(result.success).toBe(true);
      expect(result.status).toBe("approved");
    });
  });

  describe("getAvailableProjects", () => {
    it("should fetch available projects successfully", async () => {
      const availableProjects = [
        { id: 1, title: "Available Project 1" },
        { id: 2, title: "Available Project 2" },
      ];

      server.use(
        http.get(
          `http://localhost:5000/api/students/${studentId}/available-projects`,
          () => {
            return HttpResponse.json(
              mockSuccessResponse({ projects: availableProjects })
            );
          }
        )
      );

      const result = await getAvailableProjects(studentId);

      expect(result.success).toBe(true);
      expect(result.projects).toEqual(availableProjects);
    });
  });

  describe("selectProject", () => {
    it("should select project successfully", async () => {
      server.use(
        http.post(
          `http://localhost:5000/api/students/${studentId}/select-project/${projectId}`,
          () => {
            return HttpResponse.json(
              mockSuccessResponse({
                message: "Project selected successfully",
                project: mockProjectData,
              })
            );
          }
        )
      );

      const result = await selectProject(studentId, projectId);

      expect(result.success).toBe(true);
      expect(result.project).toEqual(mockProjectData);
    });
  });

  describe("getProgressLogs", () => {
    it("should fetch progress logs successfully", async () => {
      const logs = [
        { id: 1, title: "Week 1 Progress", content: "Made good progress" },
        { id: 2, title: "Week 2 Progress", content: "Continued development" },
      ];

      server.use(
        http.get(`http://localhost:5000/api/students/${studentId}/logs`, () => {
          return HttpResponse.json(mockSuccessResponse({ logs }));
        })
      );

      const result = await getProgressLogs(studentId);

      expect(result.success).toBe(true);
      expect(result.logs).toEqual(logs);
    });
  });

  describe("submitProgressLog", () => {
    it("should submit progress log successfully", async () => {
      const logData = {
        title: "Weekly Progress",
        content: "This week I worked on...",
        weekNumber: 5,
      };

      server.use(
        http.post(
          `http://localhost:5000/api/students/${studentId}/logs`,
          async ({ request }) => {
            const body = await request.json();
            return HttpResponse.json(
              mockSuccessResponse({
                log: { ...logData, id: logId, ...body },
              })
            );
          }
        )
      );

      const result = await submitProgressLog(studentId, logData);

      expect(result.success).toBe(true);
      expect(result.log.title).toBe(logData.title);
    });
  });

  describe("getProgressReports", () => {
    it("should fetch progress reports successfully", async () => {
      const reports = [
        { id: 1, title: "Mid-term Report", type: "midterm" },
        { id: 2, title: "Final Report", type: "final" },
      ];

      server.use(
        http.get(
          `http://localhost:5000/api/students/${studentId}/reports`,
          () => {
            return HttpResponse.json(mockSuccessResponse({ reports }));
          }
        )
      );

      const result = await getProgressReports(studentId);

      expect(result.success).toBe(true);
      expect(result.reports).toEqual(reports);
    });

    it("should handle startDate and endDate parameters", async () => {
      const startDate = "2024-01-01";
      const endDate = "2024-12-31";

      server.use(
        http.get(
          `http://localhost:5000/api/students/${studentId}/reports`,
          ({ request }) => {
            const url = new URL(request.url);
            const start = url.searchParams.get("startDate");
            const end = url.searchParams.get("endDate");

            expect(start).toBe(startDate);
            expect(end).toBe(endDate);

            return HttpResponse.json(mockSuccessResponse({ reports: [] }));
          }
        )
      );

      await getProgressReports(studentId, startDate, endDate);
    });
  });

  describe("submitProgressReport", () => {
    it("should submit progress report successfully", async () => {
      const reportData = new FormData();
      reportData.append("title", "Final Report");
      reportData.append("type", "final");

      server.use(
        http.post(
          `http://localhost:5000/api/students/${studentId}/reports`,
          () => {
            return HttpResponse.json(
              mockSuccessResponse({
                report: { id: reportId, title: "Final Report", type: "final" },
              })
            );
          }
        )
      );

      const result = await submitProgressReport(studentId, reportData);

      expect(result.success).toBe(true);
      expect(result.report.title).toBe("Final Report");
    });
  });

  describe("getFeedback", () => {
    it("should fetch feedback successfully", async () => {
      const feedback = {
        id: 1,
        comments: "Good work, keep it up!",
        rating: "excellent",
      };

      server.use(
        http.get(
          `http://localhost:5000/api/students/${studentId}/feedback/log/${logId}`,
          () => {
            return HttpResponse.json(mockSuccessResponse({ feedback }));
          }
        )
      );

      const result = await getFeedback(studentId, "log", logId);

      expect(result.success).toBe(true);
      expect(result.feedback).toEqual(feedback);
    });

    it("should handle different feedback types", async () => {
      server.use(
        http.get(
          `http://localhost:5000/api/students/${studentId}/feedback/report/${reportId}`,
          () => {
            return HttpResponse.json(
              mockSuccessResponse({ feedback: { comments: "Report feedback" } })
            );
          }
        )
      );

      const result = await getFeedback(studentId, "report", reportId);

      expect(result.success).toBe(true);
      expect(result.feedback.comments).toBe("Report feedback");
    });
  });
  describe("hasActiveProject", () => {
    it("should return true when student has active project", async () => {
      server.use(
        http.get(
          `http://localhost:5000/api/students/${studentId}/projects`,
          () => {
            return HttpResponse.json(
              mockSuccessResponse({
                projects: [mockProjectData],
              })
            );
          }
        )
      );

      const result = await hasActiveProject(studentId);

      expect(result).toBe(true);
    });

    it("should return false when student has no active project", async () => {
      server.use(
        http.get(
          `http://localhost:5000/api/students/${studentId}/projects`,
          () => {
            return HttpResponse.json(
              mockSuccessResponse({
                projects: [],
              })
            );
          }
        )
      );

      const result = await hasActiveProject(studentId);

      expect(result).toBe(false);
    });
  });
  describe("getActiveProject", () => {
    it("should fetch active project successfully", async () => {
      server.use(
        http.get(
          `http://localhost:5000/api/students/${studentId}/active-project`,
          () => {
            return HttpResponse.json(
              mockSuccessResponse({
                project: mockProjectData,
              })
            );
          }
        )
      );

      const result = await getActiveProject(studentId);

      expect(result.success).toBe(true);
      expect(result.project).toEqual(mockProjectData);
    });

    it("should handle no active project case", async () => {
      server.use(
        http.get(
          `http://localhost:5000/api/students/${studentId}/active-project`,
          () => {
            return HttpResponse.json(
              mockErrorResponse(404, "No active project found"),
              { status: 404 }
            );
          }
        )
      );

      await expect(getActiveProject(studentId)).rejects.toThrow();
    });
  });
});
