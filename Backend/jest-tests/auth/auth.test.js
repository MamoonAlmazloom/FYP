const request = require('supertest');
const app = require('../../app'); // Adjust path to your Express app
// const { generateTestToken, getStudentToken } = require('../setupTests'); // Assuming setupTests.js exports these if not global

// Mock the user model to prevent actual DB calls during these auth tests
// You'd typically mock the functions that your authController calls, e.g., findByEmail, comparePassword
jest.mock('../../models/authModel', () => ({
  findUserByEmail: jest.fn(),
  verifyPassword: jest.fn(),
  // Add other functions that might be called by your /auth/logout or password reset handlers
}));
const authModel = require('../../models/authModel');


describe('Auth Endpoints (F1: User Account Management)', () => {
  let studentToken;

  beforeAll(() => {
    // Generate a generic student token for tests that need an authenticated user (e.g., logout)
    // Ensure your global.getStudentToken or imported generateTestToken works
    studentToken = global.getStudentToken ? global.getStudentToken({ userId: 'student123' }) : 'dummyStudentToken';
  });

  afterEach(() => {
    // Clear all mock implementations and calls after each test
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login (TC-B1.1)', () => {
    it('should login a user with valid credentials and return a token', async () => {
      const mockUser = { id: 'user1', email: 'test@example.com', password_hash: 'hashedpassword', role: 'student', is_active: true };
      authModel.findUserByEmail.mockResolvedValue(mockUser);
      authModel.verifyPassword.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toEqual(expect.objectContaining({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      }));
      expect(authModel.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(authModel.verifyPassword).toHaveBeenCalledWith('password123', mockUser.password_hash);
    });

    it('should return 401 for invalid password', async () => {
      const mockUser = { id: 'user1', email: 'test@example.com', password_hash: 'hashedpassword', role: 'student', is_active: true };
      authModel.findUserByEmail.mockResolvedValue(mockUser);
      authModel.verifyPassword.mockResolvedValue(false); // Password does not match

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toMatch(/invalid credentials/i);
    });

    it('should return 401 or 404 if user not found', async () => {
      authModel.findUserByEmail.mockResolvedValue(null); // User not found

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      // Depending on implementation, it might be 401 (more secure) or 404
      expect([401, 404]).toContain(response.statusCode);
      expect(response.body.message).toMatch(/invalid credentials|user not found/i);
    });

    it('should return 400 if user is inactive', async () => {
      const mockUser = { id: 'user1', email: 'test@example.com', password_hash: 'hashedpassword', role: 'student', is_active: false };
      authModel.findUserByEmail.mockResolvedValue(mockUser);
      authModel.verifyPassword.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/account is inactive/i);
    });

    it('should return 400 for missing email or password', async () => {
      let response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/password is required/i);

      response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' });
      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/email is required/i);
    });

     it('should return 400 for malformed email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'not-an-email', password: 'password123' });
      expect(response.statusCode).toBe(400);
      // This message depends on your validation library/setup
      expect(response.body.message).toMatch(/invalid email/i);
    });
  });

  describe('POST /api/auth/logout (TC-B1.2)', () => {
    // Logout testing depends heavily on implementation (e.g., token blacklisting)
    // For a stateless JWT approach, logout might just be a client-side token deletion.
    // If there's a server-side mechanism (e.g. for blacklisting), test that.
    it('should return 200 for a successful logout if server handles it', async () => {
      // This test assumes your /logout endpoint does something, like blacklisting a token.
      // If it's purely client-side, this endpoint might not exist or do much.
      // Let's assume it exists and returns 200.
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toMatch(/logged out successfully/i);
      // Add assertions here if your logout invalidates tokens on the server-side
      // e.g. mock a blacklistModel.add(token) and check if it was called.
    });

    it('should return 401 if no token is provided for logout', async () => {
      const response = await request(app)
        .post('/api/auth/logout');

      expect(response.statusCode).toBe(401);
    });

    it('should return 401 if an invalid/expired token is provided for logout', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer invalidOrExpiredToken`);

      expect(response.statusCode).toBe(401); // Assuming your auth middleware catches this
    });
  });

  // TC-B1.4: Reset Password (will be in this file too)
  describe('POST /api/auth/forgot-password (TC-B1.4 Part 1)', () => {
    it('should initiate password reset for a valid email and trigger email (mocked)', async () => {
      authModel.findUserByEmail.mockResolvedValue({ id: 'user1', email: 'registered@example.com' });
      // Mock the part of your system that generates and stores the reset token
      // and the part that sends an email.
      // For example, if authController calls a userService.generatePasswordResetToken:
      // const userService = require('../../services/userService'); // hypothetical
      // jest.spyOn(userService, 'generatePasswordResetToken').mockResolvedValue('fakeResetToken');
      // jest.spyOn(emailService, 'sendPasswordResetEmail').mockResolvedValue(true);


      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'registered@example.com' });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toMatch(/password reset email sent/i);
      expect(authModel.findUserByEmail).toHaveBeenCalledWith('registered@example.com');
      // Add expect for token generation and email sending mocks to have been called
    });

    it('should return 404 or 200 (to prevent enumeration) if email not found', async () => {
      authModel.findUserByEmail.mockResolvedValue(null);
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'unregistered@example.com' });

      // Be aware of security implications: returning 404 can confirm if an email is registered.
      // Many systems return 200 regardless, to prevent email enumeration.
      // Let's assume a 200 for this common practice.
      expect(response.statusCode).toBe(200); // Or 404, depending on your app's strategy
      expect(response.body.message).toMatch(/password reset email sent|if your email is registered/i);
    });

    it('should return 400 for invalid email format', async () => {
        const response = await request(app)
            .post('/api/auth/forgot-password')
            .send({ email: 'invalid-email' });
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatch(/invalid email/i);
    });
  });

  describe('POST /api/auth/reset-password (TC-B1.4 Part 2)', () => {
    // These tests require mocking how reset tokens are validated and passwords updated.
    // e.g. authModel.validateResetToken, authModel.updateUserPassword

    // Mock functions for reset password
    authModel.validateResetToken = jest.fn();
    authModel.updateUserPassword = jest.fn();

    it('should reset password with a valid token and new password', async () => {
      authModel.validateResetToken.mockResolvedValue({ userId: 'user123', email: 'test@example.com' }); // Token is valid
      authModel.updateUserPassword.mockResolvedValue(true); // Password update successful

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: 'valid_reset_token', new_password: 'newStrongPassword123' });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toMatch(/password has been reset successfully/i);
      expect(authModel.validateResetToken).toHaveBeenCalledWith('valid_reset_token');
      expect(authModel.updateUserPassword).toHaveBeenCalledWith('user123', 'newStrongPassword123');
    });

    it('should return 400 for an invalid or expired token', async () => {
      authModel.validateResetToken.mockResolvedValue(null); // Token is invalid or expired

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: 'invalid_or_expired_token', new_password: 'newStrongPassword123' });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/invalid or expired token/i);
    });

    it('should return 400 for a weak new password (if policy exists)', async () => {
      authModel.validateResetToken.mockResolvedValue({ userId: 'user123', email: 'test@example.com' });
      // Assuming your controller or service validates password strength before calling updateUserPassword
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: 'valid_reset_token', new_password: 'weak' });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toMatch(/password does not meet complexity requirements/i);
    });

    it('should return 400 for missing token or new_password', async () => {
      let res = await request(app)
        .post('/api/auth/reset-password')
        .send({ new_password: 'newStrongPassword123' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/token is required/i);

      res = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: 'valid_reset_token' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/new password is required/i);
    });
  });
});
