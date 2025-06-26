// tests/setupTests.js

// This file will be used for global setup for tests.
// For example, you might initialize a test server, mock global objects,
// or set up common helper functions.

// Mock the database pool to prevent real database connections
jest.mock("../db.js", () => ({
  default: {
    query: jest.fn(),
    execute: jest.fn(),
    end: jest.fn(),
  },
}));

jest.mock("../middleware/auth.js", () => ({
  authenticate: jest.fn((req, res, next) => {
    // Extract JWT token from Authorization header and decode it
    let userPayload = {
      id: "test-user-id",
      user_id: "test-user-id",
      userId: "test-user-id",
      roles: ["student"],
      role: "student",
      email: "test@example.com",
    };

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        // Decode the test JWT token to get the actual payload
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, JWT_SECRET);
        const primaryRole = Array.isArray(decoded.roles)
          ? decoded.roles[0]
          : decoded.role || "student";
        userPayload = {
          id: decoded.id || decoded.userId || "test-user-id",
          user_id:
            decoded.user_id || decoded.userId || decoded.id || "test-user-id",
          userId: decoded.userId || decoded.id || "test-user-id",
          roles: decoded.roles || [primaryRole],
          role: primaryRole,
          email: decoded.email || "test@example.com",
        };
      } catch (err) {
        // If token is invalid, use default payload
      }
    }

    req.user = userPayload;
    next();
  }),
  verifyToken: jest.fn((req, res, next) => {
    const authHeader = req.headers.authorization;

    // If no authorization header, return 401
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - No token provided",
      });
    }

    const token = authHeader.substring(7);

    // If no token, return 401
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - No token provided",
      });
    }

    try {
      // Decode the test JWT token to get the actual payload
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(token, JWT_SECRET);
      const userPayload = {
        id: decoded.id || decoded.userId || "test-user-id",
        userId: decoded.userId || decoded.id || "test-user-id",
        roles: decoded.roles || ["student"],
        email: decoded.email || "test@example.com",
      };
      req.user = userPayload;
      next();
    } catch (err) {
      // If token is invalid, return 401
      return res.status(401).json({
        success: false,
        error: "Unauthorized - Invalid token",
      });
    }
  }),
  checkUserActive: jest.fn((req, res, next) => next()),
  hasRole: jest.fn(() => (req, res, next) => next()),
  hasAnyRole: jest.fn(() => (req, res, next) => next()),
  default: {
    authenticate: jest.fn((req, res, next) => {
      // Extract JWT token from Authorization header and decode it
      let userPayload = {
        id: "test-user-id",
        userId: "test-user-id",
        roles: ["student"],
        email: "test@example.com",
      };

      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        try {
          // Decode the test JWT token to get the actual payload
          const jwt = require("jsonwebtoken");
          const decoded = jwt.verify(token, JWT_SECRET);
          userPayload = {
            id: decoded.id || decoded.userId || "test-user-id",
            userId: decoded.userId || decoded.id || "test-user-id",
            roles: decoded.roles || ["student"],
            email: decoded.email || "test@example.com",
          };
        } catch (err) {
          // If token is invalid, use default payload
        }
      }

      req.user = userPayload;
      next();
    }),
    verifyToken: jest.fn((req, res, next) => {
      const authHeader = req.headers.authorization;

      // If no authorization header, return 401
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized - No token provided",
        });
      }

      const token = authHeader.substring(7);

      // If no token, return 401
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized - No token provided",
        });
      }

      try {
        // Decode the test JWT token to get the actual payload
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, JWT_SECRET);
        const userPayload = {
          id: decoded.id || decoded.userId || "test-user-id",
          userId: decoded.userId || decoded.id || "test-user-id",
          roles: decoded.roles || ["student"],
          email: decoded.email || "test@example.com",
        };
        req.user = userPayload;
        next();
      } catch (err) {
        // If token is invalid, return 401
        return res.status(401).json({
          success: false,
          error: "Unauthorized - Invalid token",
        });
      }
    }),
    checkUserActive: jest.fn((req, res, next) => next()),
    hasRole: jest.fn(() => (req, res, next) => next()),
    hasAnyRole: jest.fn(() => (req, res, next) => next()),
  },
}));

// Mock all models to prevent database calls
jest.mock("../models/userModel.js", () => ({
  default: {
    createUser: jest.fn().mockResolvedValue({ id: "user123" }),
    findUserByEmail: jest.fn().mockResolvedValue(null),
    updateUserEligibility: jest
      .fn()
      .mockResolvedValue({ is_fyp_eligible: true }),
    getAllUsers: jest.fn().mockResolvedValue([]),
  },
  createUser: jest.fn().mockResolvedValue({ id: "user123" }),
  findUserByEmail: jest.fn().mockResolvedValue(null),
  updateUserEligibility: jest.fn().mockResolvedValue({ is_fyp_eligible: true }),
  getAllUsers: jest.fn().mockResolvedValue([]),
}));

jest.mock("../models/projectModel.js", () => ({
  default: {
    createProject: jest.fn().mockResolvedValue({ id: "proj123" }),
    assignProjectToStudent: jest.fn().mockResolvedValue(true),
    getProjectsBySupervisor: jest.fn().mockResolvedValue([]),
    getProjectsByStatus: jest.fn().mockResolvedValue([]),
    assignExaminerToProject: jest
      .fn()
      .mockResolvedValue({ examiner_id: "examiner1" }),
    assignModeratorToProject: jest
      .fn()
      .mockResolvedValue({ moderator_id: "moderator1" }),
    updateProjectStatus: jest.fn().mockResolvedValue({ status: "Archived" }),
    findProjectById: jest.fn().mockResolvedValue({ id: "proj123" }),
  },
  createProject: jest.fn().mockResolvedValue({ id: "proj123" }),
  assignProjectToStudent: jest.fn().mockResolvedValue(true),
  getProjectsBySupervisor: jest.fn().mockResolvedValue([]),
  getProjectsByStatus: jest.fn().mockResolvedValue([]),
  assignExaminerToProject: jest
    .fn()
    .mockResolvedValue({ examiner_id: "examiner1" }),
  assignModeratorToProject: jest
    .fn()
    .mockResolvedValue({ moderator_id: "moderator1" }),
  updateProjectStatus: jest.fn().mockResolvedValue({ status: "Archived" }),
  findProjectById: jest.fn().mockResolvedValue({ id: "proj123" }),
}));

jest.mock("../models/proposalModel.js", () => ({
  default: {
    createProposal: jest.fn().mockResolvedValue({ id: "prop123" }),
    findProposalById: jest
      .fn()
      .mockResolvedValue({ id: "prop123", title: "Sample Proposal" }),
    updateProposalStatus: jest.fn().mockResolvedValue({ status: "Approved" }),
    updateProposalDetails: jest.fn().mockResolvedValue({ title: "Updated" }),
    getProposalsByStudentId: jest.fn().mockResolvedValue([]),
    getAllProposals: jest.fn().mockResolvedValue([]),
    addCommentToProposal: jest.fn().mockResolvedValue({ id: "comment123" }),
  },
  createProposal: jest.fn().mockResolvedValue({ id: "prop123" }),
  findProposalById: jest
    .fn()
    .mockResolvedValue({ id: "prop123", title: "Sample Proposal" }),
  updateProposalStatus: jest.fn().mockResolvedValue({ status: "Approved" }),
  updateProposalDetails: jest.fn().mockResolvedValue({ title: "Updated" }),
  getProposalsByStudentId: jest.fn().mockResolvedValue([]),
  getAllProposals: jest.fn().mockResolvedValue([]),
  addCommentToProposal: jest.fn().mockResolvedValue({ id: "comment123" }),
}));

jest.mock("../models/progressLogModel.js", () => ({
  default: {
    createLog: jest.fn().mockResolvedValue({ id: "log123" }),
    findLogById: jest.fn().mockResolvedValue({ id: "log123" }),
    addFeedbackToLog: jest.fn().mockResolvedValue({ feedback: "Good work" }),
    getLogsByStudentId: jest.fn().mockResolvedValue([]),
  },
  createLog: jest.fn().mockResolvedValue({ id: "log123" }),
  findLogById: jest.fn().mockResolvedValue({ id: "log123" }),
  addFeedbackToLog: jest.fn().mockResolvedValue({ feedback: "Good work" }),
  getLogsByStudentId: jest.fn().mockResolvedValue([]),
}));

jest.mock("../models/reportModel.js", () => ({
  default: {
    createReport: jest.fn().mockResolvedValue({ id: "report123" }),
    findReportById: jest
      .fn()
      .mockResolvedValue({ id: "report010", title: "Sample Report" }),
    getReportByIdForSupervisor: jest
      .fn()
      .mockResolvedValue({ id: "report010", title: "Sample Report" }),
    addFeedbackToReport: jest
      .fn()
      .mockResolvedValue({ feedback: "Good report" }),
    getReportsByStudentId: jest.fn().mockResolvedValue([]),
  },
  createReport: jest.fn().mockResolvedValue({ id: "report123" }),
  findReportById: jest
    .fn()
    .mockResolvedValue({ id: "report010", title: "Sample Report" }),
  getReportByIdForSupervisor: jest
    .fn()
    .mockResolvedValue({ id: "report010", title: "Sample Report" }),
  addFeedbackToReport: jest.fn().mockResolvedValue({ feedback: "Good report" }),
  getReportsByStudentId: jest.fn().mockResolvedValue([]),
}));

jest.mock("../models/supervisorModel.js", () => ({
  default: {
    getStudentsBySupervisor: jest.fn().mockResolvedValue([]),
    getAssignedStudentsBySupervisorId: jest.fn().mockResolvedValue([]),
  },
  getStudentsBySupervisor: jest.fn().mockResolvedValue([]),
  getAssignedStudentsBySupervisorId: jest.fn().mockResolvedValue([]),
}));

jest.mock("../models/authModel.js", () => ({
  default: {
    getUserByEmail: jest.fn().mockResolvedValue({
      id: "user123",
      email: "test@example.com",
      password: "hashed-password",
      is_active: true,
      roles: ["student"],
    }),
    getUserRoles: jest.fn().mockResolvedValue(["student"]),
    validateResetToken: jest.fn().mockResolvedValue({ user_id: "user123" }),
    updateUserPassword: jest.fn().mockResolvedValue(true),
    createPasswordResetToken: jest.fn().mockResolvedValue("reset-token"),
  },
  getUserByEmail: jest.fn().mockResolvedValue({
    id: "user123",
    email: "test@example.com",
    password: "hashed-password",
    is_active: true,
    roles: ["student"],
  }),
  getUserRoles: jest.fn().mockResolvedValue(["student"]),
  validateResetToken: jest.fn().mockResolvedValue({ user_id: "user123" }),
  updateUserPassword: jest.fn().mockResolvedValue(true),
  createPasswordResetToken: jest.fn().mockResolvedValue("reset-token"),
}));

// Mock bcrypt for password operations
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
  compare: jest.fn().mockResolvedValue(true),
  hashSync: jest.fn().mockReturnValue("hashed-password"),
  compareSync: jest.fn().mockReturnValue(true),
}));

// Helper function to generate JWT tokens for different user roles
import jwt from "jsonwebtoken"; // You'll need to install jsonwebtoken: npm install jsonwebtoken --save-dev
const JWT_SECRET = "test-secret"; // Use consistent test secret

global.generateTestToken = (userPayload) => {
  // Default payload if nothing specific is needed for the role
  const defaults = {
    id: "testUserId",
    userId: "testUserId",
    roles: ["student"], // default role
    email: "test@example.com",
    // Add other necessary claims for your JWT structure
  };
  return jwt.sign({ ...defaults, ...userPayload }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

global.getStudentToken = (payload = {}) =>
  global.generateTestToken({
    roles: ["student"],
    role: "student",
    id: payload.userId || "student123",
    user_id: payload.userId || "student123",
    userId: payload.userId || "student123",
    ...payload,
  });
global.getSupervisorToken = (payload = {}) =>
  global.generateTestToken({
    roles: ["supervisor"],
    role: "supervisor",
    id: payload.userId || "supervisor456",
    user_id: payload.userId || "supervisor456",
    userId: payload.userId || "supervisor456",
    ...payload,
  });
global.getModeratorToken = (payload = {}) =>
  global.generateTestToken({
    roles: ["moderator"],
    role: "moderator",
    id: payload.userId || "moderator789",
    user_id: payload.userId || "moderator789",
    userId: payload.userId || "moderator789",
    ...payload,
  });
global.getManagerToken = (payload = {}) =>
  global.generateTestToken({
    roles: ["manager"],
    role: "manager",
    id: payload.userId || "manager001",
    user_id: payload.userId || "manager001",
    userId: payload.userId || "manager001",
    ...payload,
  });

// Mock process.env variables for tests
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";

// Cleanup any database connections that might persist
afterAll(async () => {
  // Force close any lingering database connections
  jest.clearAllMocks();
  // Give time for async operations to complete
  await new Promise((resolve) => setTimeout(resolve, 100));
});

console.log("Global test setup file loaded.");
