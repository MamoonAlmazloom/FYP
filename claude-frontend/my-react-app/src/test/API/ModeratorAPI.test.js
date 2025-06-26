import { describe, it, expect, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import {
  server,
  mockSuccessResponse,
  mockErrorResponse,
  mockProposalData,
} from "../setup.js";
import {
  getPendingProposals,
  reviewProposal,
  reviewSupervisorProposal,
  getModeratorProfile,
  getProposalDetails,
  getPreviousProjects,
} from "../../API/ModeratorAPI.jsx";

describe("ModeratorAPI", () => {
  const proposalId = 1;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("token", "test-token");
  });

  describe("getPendingProposals", () => {
    it("should fetch pending proposals successfully", async () => {
      const proposals = [
        { ...mockProposalData, status: "supervisor_approved" },
        { ...mockProposalData, id: 2, status: "supervisor_approved" },
      ];

      server.use(
        http.get(
          "http://localhost:5000/api/moderators/pending-proposals",
          () => {
            return HttpResponse.json(mockSuccessResponse({ proposals }));
          }
        )
      );

      const result = await getPendingProposals();

      expect(result.success).toBe(true);
      expect(result.proposals).toEqual(proposals);
      expect(result.proposals.length).toBe(2);
    });

    it("should handle empty pending proposals", async () => {
      server.use(
        http.get(
          "http://localhost:5000/api/moderators/pending-proposals",
          () => {
            return HttpResponse.json(mockSuccessResponse({ proposals: [] }));
          }
        )
      );

      const result = await getPendingProposals();

      expect(result.success).toBe(true);
      expect(result.proposals).toEqual([]);
    });

    it("should handle API error", async () => {
      server.use(
        http.get(
          "http://localhost:5000/api/moderators/pending-proposals",
          () => {
            return HttpResponse.json(
              mockErrorResponse(500, "Internal server error"),
              { status: 500 }
            );
          }
        )
      );

      await expect(getPendingProposals()).rejects.toThrow();
    });
  });

  describe("reviewProposal", () => {
    it("should review proposal with approval successfully", async () => {
      const reviewData = {
        decision: "approved",
        comments: "Excellent proposal, approved for implementation",
      };

      server.use(
        http.post(
          `http://localhost:5000/api/moderators/review-proposal/${proposalId}`,
          async ({ request }) => {
            const body = await request.json();
            expect(body).toEqual(reviewData);

            return HttpResponse.json(
              mockSuccessResponse({
                message: "Proposal reviewed successfully",
                proposal: {
                  ...mockProposalData,
                  status: "approved",
                  moderatorComments: reviewData.comments,
                },
              })
            );
          }
        )
      );

      const result = await reviewProposal(proposalId, reviewData);

      expect(result.success).toBe(true);
      expect(result.proposal.status).toBe("approved");
      expect(result.proposal.moderatorComments).toBe(reviewData.comments);
    });

    it("should review proposal with rejection successfully", async () => {
      const reviewData = {
        decision: "rejected",
        comments: "Proposal needs significant improvements",
      };

      server.use(
        http.post(
          `http://localhost:5000/api/moderators/review-proposal/${proposalId}`,
          async ({ request }) => {
            const body = await request.json();
            expect(body).toEqual(reviewData);

            return HttpResponse.json(
              mockSuccessResponse({
                message: "Proposal reviewed successfully",
                proposal: {
                  ...mockProposalData,
                  status: "rejected",
                  moderatorComments: reviewData.comments,
                },
              })
            );
          }
        )
      );

      const result = await reviewProposal(proposalId, reviewData);

      expect(result.success).toBe(true);
      expect(result.proposal.status).toBe("rejected");
    });

    it("should review proposal with modification request", async () => {
      const reviewData = {
        decision: "request_modification",
        comments: "Please clarify the methodology section",
      };

      server.use(
        http.post(
          `http://localhost:5000/api/moderators/review-proposal/${proposalId}`,
          () => {
            return HttpResponse.json(
              mockSuccessResponse({
                message: "Modification requested",
                proposal: {
                  ...mockProposalData,
                  status: "modification_requested",
                },
              })
            );
          }
        )
      );

      const result = await reviewProposal(proposalId, reviewData);

      expect(result.success).toBe(true);
      expect(result.proposal.status).toBe("modification_requested");
    });

    it("should handle invalid proposal ID", async () => {
      server.use(
        http.post(
          `http://localhost:5000/api/moderators/review-proposal/999`,
          () => {
            return HttpResponse.json(
              mockErrorResponse(404, "Proposal not found"),
              { status: 404 }
            );
          }
        )
      );

      await expect(
        reviewProposal(999, { decision: "approved" })
      ).rejects.toThrow();
    });

    it("should handle invalid decision", async () => {
      server.use(
        http.post(
          `http://localhost:5000/api/moderators/review-proposal/${proposalId}`,
          () => {
            return HttpResponse.json(
              mockErrorResponse(400, "Invalid decision"),
              { status: 400 }
            );
          }
        )
      );

      await expect(
        reviewProposal(proposalId, { decision: "invalid_decision" })
      ).rejects.toThrow();
    });
  });
  describe("reviewSupervisorProposal", () => {
    it("should review supervisor proposal successfully", async () => {
      const reviewData = {
        decision: "approved",
        comments: "Excellent supervisor proposal",
      };

      server.use(
        http.post(
          `http://localhost:5000/api/moderators/review-supervisor-proposal/${proposalId}`,
          async ({ request }) => {
            const body = await request.json();
            expect(body).toEqual(reviewData);

            return HttpResponse.json(
              mockSuccessResponse({
                message: "Supervisor proposal reviewed successfully",
                proposal: {
                  ...mockProposalData,
                  status: "approved",
                  moderatorComments: reviewData.comments,
                },
              })
            );
          }
        )
      );

      const result = await reviewSupervisorProposal(proposalId, reviewData);

      expect(result.success).toBe(true);
      expect(result.proposal.status).toBe("approved");
    });
  });

  describe("getModeratorProfile", () => {
    it("should fetch moderator profile successfully", async () => {
      const moderatorProfile = {
        id: 1,
        name: "Dr. Moderator",
        email: "moderator@example.com",
        department: "Computer Science",
      };

      server.use(
        http.get("http://localhost:5000/api/moderators/profile", () => {
          return HttpResponse.json(
            mockSuccessResponse({ moderator: moderatorProfile })
          );
        })
      );

      const result = await getModeratorProfile();

      expect(result.success).toBe(true);
      expect(result.moderator).toEqual(moderatorProfile);
    });
  });

  describe("getProposalDetails", () => {
    it("should fetch proposal details successfully", async () => {
      server.use(
        http.get(
          `http://localhost:5000/api/moderators/proposal/${proposalId}`,
          () => {
            return HttpResponse.json(
              mockSuccessResponse({ proposal: mockProposalData })
            );
          }
        )
      );

      const result = await getProposalDetails(proposalId);

      expect(result.success).toBe(true);
      expect(result.proposal).toEqual(mockProposalData);
    });
  });

  describe("getPreviousProjects", () => {
    it("should fetch previous projects successfully", async () => {
      const moderatorId = 1;
      const projects = [
        { id: 1, title: "Completed Project 1", status: "completed" },
        { id: 2, title: "Completed Project 2", status: "completed" },
      ];

      server.use(
        http.get(
          `http://localhost:5000/api/moderators/${moderatorId}/previous-projects`,
          () => {
            return HttpResponse.json(mockSuccessResponse({ projects }));
          }
        )
      );

      const result = await getPreviousProjects(moderatorId);

      expect(result.success).toBe(true);
      expect(result.projects).toEqual(projects);
    });
  });

  describe("Authorization and token handling", () => {
    it("should include authorization token in requests", async () => {
      server.use(
        http.get(
          "http://localhost:5000/api/moderators/pending-proposals",
          ({ request }) => {
            const authHeader = request.headers.get("Authorization");
            expect(authHeader).toBe("Bearer test-token");

            return HttpResponse.json(mockSuccessResponse({ proposals: [] }));
          }
        )
      );

      await getPendingProposals();
    });

    it("should handle unauthorized requests", async () => {
      localStorage.removeItem("token");

      server.use(
        http.get(
          "http://localhost:5000/api/moderators/pending-proposals",
          () => {
            return HttpResponse.json(mockErrorResponse(401, "Unauthorized"), {
              status: 401,
            });
          }
        )
      );

      await expect(getPendingProposals()).rejects.toThrow();
    });
  });
});
