// tests/setupTests.js

// This file will be used for global setup for tests.
// For example, you might initialize a test server, mock global objects,
// or set up common helper functions.

// If using supertest with a local app instance:
// const request = require('supertest');
// const app = require('../src/app'); // Adjust path to your Express app

// Global test variables (use with caution, prefer passing explicitly)
// global.request = request(app);
// global.baseUrl = '/api/v1'; // Example base URL

// Mocking external services (example for a notification service)
/*
jest.mock('../src/services/notificationService', () => ({
  sendNotification: jest.fn().mockResolvedValue({ success: true }),
}));
*/

// Helper function to generate JWT tokens for different user roles
const jwt = require('jsonwebtoken'); // You'll need to install jsonwebtoken: npm install jsonwebtoken --save-dev
const JWT_SECRET = process.env.JWT_SECRET || 'your-test-secret-key'; // Use a test secret

global.generateTestToken = (userPayload) => {
  // Default payload if nothing specific is needed for the role
  const defaults = {
    userId: 'testUserId',
    role: 'student', // default role
    // Add other necessary claims for your JWT structure
  };
  return jwt.sign({ ...defaults, ...userPayload }, JWT_SECRET, { expiresIn: '1h' });
};

global.getStudentToken = (payload = {}) => global.generateTestToken({ role: 'student', ...payload });
global.getSupervisorToken = (payload = {}) => global.generateTestToken({ role: 'supervisor', ...payload });
global.getModeratorToken = (payload = {}) => global.generateTestToken({ role: 'moderator', ...payload });
global.getManagerToken = (payload = {}) => global.generateTestToken({ role: 'manager', ...payload });


// You might also want to set up beforeAll/afterAll hooks for database connections
// const db = require('../src/db'); // Adjust path to your DB setup

/*
beforeAll(async () => {
  // Initialize DB connection for tests
  // await db.connect();
});

afterAll(async () => {
  // Close DB connection after tests
  // await db.disconnect();
});
*/

// If you need to run migrations or seed data before tests:
/*
beforeEach(async () => {
  // Example: Clean and seed database before each test or suite
  // await db.migrate.latest();
  // await db.seed.run();
});
*/

console.log('Global test setup file loaded.');
