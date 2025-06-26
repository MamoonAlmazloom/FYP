import request from "supertest";
import app from "../../app.js"; // Adjust path to your Express app

jest.mock("../../models/proposalModel.js", () => ({
  createProposal: jest.fn(),
  findProposalById: jest.fn(),
  updateProposalStatus: jest.fn(),
  updateProposalDetails: jest.fn(),
  getProposalsByStudentId: jest.fn(),
  getAllProposals: jest.fn(), // For moderator/admin views
  addCommentToProposal: jest.fn(),
}));
import proposalModel from "../../models/proposalModel.js";

// Mock notification service if your proposal actions trigger notifications
jest.mock("../../services/notificationService.js", () => ({
  // Assuming you have such a service
  notifyUser: jest.fn(),
  notifyRole: jest.fn(),
}));
// import notificationService from '../../services/notificationService.js';

describe("Proposal Endpoints (F2: Proposal Management)", () => {
  let studentToken, supervisorToken, moderatorToken;
  const studentId = "student123";
  const supervisorId = "supervisor456";
  const moderatorId = "moderator789";
  const proposalId = "prop123";

  beforeAll(() => {
    studentToken = global.getStudentToken
      ? global.getStudentToken({ userId: studentId })
      : "dummyStudentToken";
    supervisorToken = global.getSupervisorToken
      ? global.getSupervisorToken({ userId: supervisorId })
      : "dummySupervisorToken";
    moderatorToken = global.getModeratorToken
      ? global.getModeratorToken({ userId: moderatorId })
      : "dummyModeratorToken";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TC-B2.1: Submit Project Proposal (Student)
  describe("POST /api/proposals (Submit Proposal)", () => {
    const proposalData = {
      title: "AI for Climate Change",
      description: "Using AI to model climate patterns.",
      objectives: "Objective 1",
    };

    it("should allow a student to submit a proposal successfully", async () => {
      proposalModel.createProposal.mockResolvedValue({
        id: proposalId,
        student_id: studentId,
        status: "Pending",
        ...proposalData,
      });
      const response = await request(app)
        .post("/api/proposals")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(proposalData);
      expect(response.statusCode).toBe(201);
      expect(response.body.proposal).toHaveProperty("id", proposalId);
      expect(response.body.proposal.status).toBe("Pending");
      expect(proposalModel.createProposal).toHaveBeenCalledWith(
        expect.objectContaining({ ...proposalData, student_id: studentId })
      );
      // TC-B4.3: Supervisor Notification for New Proposal
      const { notifyRole } = jest.requireMock(
        "../../services/notificationService.js"
      );
      expect(notifyRole).toHaveBeenCalledWith(
        "supervisor",
        expect.stringContaining("New proposal submitted"),
        expect.objectContaining({ proposalId: proposalId })
      );
    });

    it("should return 400 for missing required fields", async () => {
      const response = await request(app)
        .post("/api/proposals")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ description: "Only description" });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/title is required/i); // Example message
    });

    it("should return 403 if a non-student tries to submit", async () => {
      const response = await request(app)
        .post("/api/proposals")
        .set("Authorization", `Bearer ${supervisorToken}`) // Using supervisor token
        .send(proposalData);
      expect(response.statusCode).toBe(403);
    });
  });

  // TC-B2.2: Review/Approve Proposal (Supervisor)
  describe("PUT /api/proposals/:proposalId/review (Supervisor Review)", () => {
    const reviewData = {
      status: "ApprovedBySupervisor",
      feedback: "Good proposal.",
    };
    const mockProposal = {
      id: proposalId,
      student_id: "anotherStudentId",
      supervisor_id: supervisorId,
      status: "Pending",
    };

    it("should allow an assigned supervisor to approve a proposal", async () => {
      proposalModel.findProposalById.mockResolvedValue(mockProposal);
      proposalModel.updateProposalStatus.mockResolvedValue({
        ...mockProposal,
        ...reviewData,
      });

      const response = await request(app)
        .put(`/api/proposals/${proposalId}/review`)
        .set("Authorization", `Bearer ${supervisorToken}`)
        .send(reviewData);

      expect(response.statusCode).toBe(200);
      expect(response.body.proposal.status).toBe(reviewData.status);
      expect(response.body.proposal.feedback).toContain(reviewData.feedback); // Feedback might be appended
      expect(proposalModel.findProposalById).toHaveBeenCalledWith(proposalId);
      expect(proposalModel.updateProposalStatus).toHaveBeenCalledWith(
        proposalId,
        reviewData.status,
        reviewData.feedback,
        supervisorId
      );

      // TC-B4.1: Proposal Decision Notification (Student)
      // TC-B4.4: Moderator Notification for Proposals Requiring Review
      const { notifyUser, notifyRole } = jest.requireMock(
        "../../services/notificationService.js"
      );
      expect(notifyUser).toHaveBeenCalledWith(
        mockProposal.student_id,
        expect.stringContaining(
          "proposal has been reviewed by your supervisor"
        ),
        expect.objectContaining({ proposalId: proposalId })
      );
      if (reviewData.status === "ApprovedBySupervisor") {
        expect(notifyRole).toHaveBeenCalledWith(
          "moderator",
          expect.stringContaining("Proposal requires moderation"),
          expect.objectContaining({ proposalId: proposalId })
        );
      }
    });

    it("should return 404 if proposal not found", async () => {
      proposalModel.findProposalById.mockResolvedValue(null);
      const response = await request(app)
        .put(`/api/proposals/nonexistent/review`)
        .set("Authorization", `Bearer ${supervisorToken}`)
        .send(reviewData);
      expect(response.statusCode).toBe(404);
    });

    it("should return 403 if supervisor is not assigned to the proposal (or student)", async () => {
      // This requires logic in your controller to check if supervisorId matches proposal's supervisor_id
      // or if the supervisor is assigned to the student who submitted.
      // For this mock, let's assume findProposalById returns a proposal not assigned to this supervisor.
      proposalModel.findProposalById.mockResolvedValue({
        ...mockProposal,
        supervisor_id: "otherSupervisorId",
      });
      const response = await request(app)
        .put(`/api/proposals/${proposalId}/review`)
        .set("Authorization", `Bearer ${supervisorToken}`) // supervisorId is 'supervisor456'
        .send(reviewData);
      expect(response.statusCode).toBe(403); // Or 401 if auth middleware handles it generally
    });

    it("should return 400 for invalid status transition", async () => {
      proposalModel.findProposalById.mockResolvedValue({
        ...mockProposal,
        status: "ApprovedByModerator",
      }); // Already past supervisor approval
      const response = await request(app)
        .put(`/api/proposals/${proposalId}/review`)
        .set("Authorization", `Bearer ${supervisorToken}`)
        .send(reviewData);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/invalid status transition/i);
    });
  });

  // TC-B2.3 & TC-B2.10: Approve Proposal (Moderator)
  describe("PUT /api/proposals/:proposalId/moderate (Moderator Action)", () => {
    const moderationData = {
      status: "ApprovedByModerator",
      feedback: "Final approval.",
    };
    const mockProposalForModeration = {
      id: proposalId,
      student_id: "studentX",
      supervisor_id: "supervisorY",
      status: "ApprovedBySupervisor",
    };

    it("should allow a moderator to approve a proposal", async () => {
      proposalModel.findProposalById.mockResolvedValue(
        mockProposalForModeration
      );
      proposalModel.updateProposalStatus.mockResolvedValue({
        ...mockProposalForModeration,
        ...moderationData,
      });

      const response = await request(app)
        .put(`/api/proposals/${proposalId}/moderate`)
        .set("Authorization", `Bearer ${moderatorToken}`)
        .send(moderationData);

      expect(response.statusCode).toBe(200);
      expect(response.body.proposal.status).toBe(moderationData.status);
      expect(proposalModel.updateProposalStatus).toHaveBeenCalledWith(
        proposalId,
        moderationData.status,
        moderationData.feedback,
        moderatorId
      );

      // TC-B4.1: Proposal Decision Notification (Student and Supervisor)
      const { notifyUser } = jest.requireMock(
        "../../services/notificationService.js"
      );
      expect(notifyUser).toHaveBeenCalledWith(
        mockProposalForModeration.student_id,
        expect.stringContaining("proposal has been moderated"),
        expect.objectContaining({ proposalId: proposalId })
      );
      expect(notifyUser).toHaveBeenCalledWith(
        mockProposalForModeration.supervisor_id,
        expect.stringContaining("proposal for your student has been moderated"),
        expect.objectContaining({ proposalId: proposalId })
      );
    });

    it("should return 400 if proposal is not in a state for moderation", async () => {
      proposalModel.findProposalById.mockResolvedValue({
        ...mockProposalForModeration,
        status: "Pending",
      }); // Not yet approved by supervisor
      const response = await request(app)
        .put(`/api/proposals/${proposalId}/moderate`)
        .set("Authorization", `Bearer ${moderatorToken}`)
        .send(moderationData);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(
        /proposal not ready for moderation/i
      );
    });
  });

  // TC-B2.4 & TC-B2.6: View Submitted Proposal (Student)
  describe("GET /api/proposals/my (Student View Own Proposals)", () => {
    it("should allow a student to view their own proposals", async () => {
      const studentProposals = [
        {
          id: "prop1",
          student_id: studentId,
          title: "My First Proposal",
          status: "Pending",
        },
      ];
      proposalModel.getProposalsByStudentId.mockResolvedValue(studentProposals);

      const response = await request(app)
        .get("/api/proposals/my")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.proposals).toEqual(studentProposals);
      expect(proposalModel.getProposalsByStudentId).toHaveBeenCalledWith(
        studentId
      );
    });

    it("should return empty list if student has no proposals", async () => {
      proposalModel.getProposalsByStudentId.mockResolvedValue([]);
      const response = await request(app)
        .get("/api/proposals/my")
        .set("Authorization", `Bearer ${studentToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.proposals).toEqual([]);
    });
  });

  // TC-B2.9: Select Proposal from Project List (Moderator) - Viewing a specific proposal
  // This is essentially GET /api/proposals/:proposalId for a moderator
  describe("GET /api/proposals/:proposalId (Moderator View Specific Proposal)", () => {
    it("should allow a moderator to view any proposal details", async () => {
      const specificProposal = {
        id: proposalId,
        title: "Test Prop",
        status: "ApprovedBySupervisor",
        student_id: "anyStudent",
      };
      proposalModel.findProposalById.mockResolvedValue(specificProposal);

      const response = await request(app)
        .get(`/api/proposals/${proposalId}`)
        .set("Authorization", `Bearer ${moderatorToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.proposal).toEqual(specificProposal);
      expect(proposalModel.findProposalById).toHaveBeenCalledWith(proposalId);
    });
  });

  // TC-B2.7: Modify Submitted Proposal (Student)
  describe("PUT /api/proposals/:proposalId (Student Modify Proposal)", () => {
    const updatedData = {
      title: "Updated Title",
      description: "Updated Description",
    };
    const modifiableProposal = {
      id: proposalId,
      student_id: studentId,
      status: "NeedsModificationBySupervisor",
    };

    it("should allow student to modify their proposal if in modifiable state", async () => {
      proposalModel.findProposalById.mockResolvedValue(modifiableProposal);
      proposalModel.updateProposalDetails.mockResolvedValue({
        ...modifiableProposal,
        ...updatedData,
        status: "Pending",
      }); // Status might reset

      const response = await request(app)
        .put(`/api/proposals/${proposalId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send(updatedData);

      expect(response.statusCode).toBe(200);
      expect(response.body.proposal.title).toBe(updatedData.title);
      expect(response.body.proposal.status).toBe("Pending"); // Or 'PendingResubmission'
      expect(proposalModel.updateProposalDetails).toHaveBeenCalledWith(
        proposalId,
        studentId,
        updatedData
      );
    });

    it("should return 403 if student tries to modify another student proposal", async () => {
      proposalModel.findProposalById.mockResolvedValue({
        ...modifiableProposal,
        student_id: "otherStudent",
      });
      const response = await request(app)
        .put(`/api/proposals/${proposalId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send(updatedData);
      expect(response.statusCode).toBe(403);
    });

    it("should return 400 if proposal is not in a modifiable state", async () => {
      proposalModel.findProposalById.mockResolvedValue({
        ...modifiableProposal,
        status: "ApprovedBySupervisor",
      });
      const response = await request(app)
        .put(`/api/proposals/${proposalId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send(updatedData);
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(
        /cannot be modified in its current state/i
      );
    });
  });

  // TC-B2.8: View Project List (Moderator) - List all proposals
  describe("GET /api/proposals (Moderator View All Proposals)", () => {
    it("should allow moderator to view all proposals (potentially filtered)", async () => {
      const allProposals = [
        { id: "prop1", title: "P1", status: "PendingModeratorReview" },
        { id: "prop2", title: "P2", status: "ApprovedBySupervisor" },
      ];
      // Assuming controller might apply default filters for moderators
      proposalModel.getAllProposals.mockResolvedValue(allProposals);

      const response = await request(app)
        .get("/api/proposals") // No query params, controller might infer role and filter
        .set("Authorization", `Bearer ${moderatorToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.proposals).toEqual(allProposals);
      // Check if getAllProposals was called with specific status filters if applicable
      // e.g., expect(proposalModel.getAllProposals).toHaveBeenCalledWith({ status: ['ApprovedBySupervisor', 'PendingModeratorReview'] });
      expect(proposalModel.getAllProposals).toHaveBeenCalled();
    });
  });

  // TC-B2.11: Add Comments to Proposal (Moderator)
  describe("POST /api/proposals/:proposalId/comments (Moderator Add Comment)", () => {
    const commentData = { text: "This needs more detail in section 2." };
    const proposalToComment = {
      id: proposalId,
      status: "ApprovedBySupervisor",
    };

    it("should allow a moderator to add a comment to a proposal", async () => {
      proposalModel.findProposalById.mockResolvedValue(proposalToComment);
      proposalModel.addCommentToProposal.mockResolvedValue({
        id: "comment123",
        proposal_id: proposalId,
        user_id: moderatorId,
        text: commentData.text,
      });

      const response = await request(app)
        .post(`/api/proposals/${proposalId}/comments`)
        .set("Authorization", `Bearer ${moderatorToken}`)
        .send(commentData);

      expect(response.statusCode).toBe(201);
      expect(response.body.comment).toHaveProperty("id");
      expect(response.body.comment.text).toBe(commentData.text);
      expect(proposalModel.addCommentToProposal).toHaveBeenCalledWith(
        proposalId,
        moderatorId,
        commentData.text
      );
    });

    it("should return 400 for empty comment text", async () => {
      proposalModel.findProposalById.mockResolvedValue(proposalToComment);
      const response = await request(app)
        .post(`/api/proposals/${proposalId}/comments`)
        .set("Authorization", `Bearer ${moderatorToken}`)
        .send({ text: "" });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/comment text cannot be empty/i);
    });
  });
});
