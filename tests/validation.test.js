/**
 * Auth Service - Token Validation Tests
 * Test Suite: S2.TS3
 * 
 * Tests the token validation endpoint to ensure proper verification
 * of JWT tokens including valid, invalid, expired, and malformed tokens.
 */

const request = require('supertest');
const app = require('../src/server');
const jwt = require('jsonwebtoken');

describe('S2.TS3: Token Validation Tests', () => {
  
  let validToken;
  const validCredentials = {
    email: 'anna.virtanen@nursinghome.com',
    password: 'nursing123'
  };

  // Get a valid token before running tests
  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send(validCredentials);
    
    validToken = response.body.data.token;
  });

  /**
   * Test: S2.TS3.1
   * Verify that validation with a valid token returns user data
   * 
   * Expected behavior:
   * - Status code should be 200
   * - Response should contain success: true
   * - Response should contain user data with correct fields
   */
  test('S2.TS3.1 - POST /api/auth/validate with valid token returns user data', async () => {
    const response = await request(app)
      .post('/api/auth/validate')
      .set('Authorization', `Bearer ${validToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user).toHaveProperty('id');
    expect(response.body.data.user).toHaveProperty('email');
    expect(response.body.data.user).toHaveProperty('role');
  });

  /**
   * Test: S2.TS3.2
   * Verify that validation with an invalid token returns 401
   * 
   * Expected behavior:
   * - Status code should be 401
   * - Response should contain success: false
   * - Response should contain error message about invalid token
   */
  test('S2.TS3.2 - POST /api/auth/validate with invalid token returns 401', async () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    
    const response = await request(app)
      .post('/api/auth/validate')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Invalid token');
  });

  /**
   * Test: S2.TS3.3
   * Verify that validation with an expired token returns 401
   * 
   * Expected behavior:
   * - Status code should be 401
   * - Response should contain success: false
   * - Response should contain error message about invalid token
   */
  test('S2.TS3.3 - POST /api/auth/validate with expired token returns 401', async () => {
    // Create an expired token (expired 1 hour ago)
    const expiredToken = jwt.sign(
      {
        sub: 'test_user',
        email: 'test@example.com',
        role: 'nurse'
      },
      process.env.JWT_SECRET || 'test-secret-key-change-in-production',
      { expiresIn: '-1h' }
    );

    const response = await request(app)
      .post('/api/auth/validate')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Invalid token');
  });

  /**
   * Test: S2.TS3.4
   * Verify that validation without a token returns 401
   * 
   * Expected behavior:
   * - Status code should be 401
   * - Response should contain success: false
   * - Response should contain error message about missing token
   */
  test('S2.TS3.4 - POST /api/auth/validate without token returns 401', async () => {
    const response = await request(app)
      .post('/api/auth/validate')
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'No token provided');
  });

  /**
   * Test: S2.TS3.5
   * Verify that validation with a malformed token returns 401
   * 
   * Expected behavior:
   * - Status code should be 401
   * - Response should contain success: false
   * - Response should contain error message about invalid token
   */
  test('S2.TS3.5 - POST /api/auth/validate with malformed token returns 401', async () => {
    const malformedToken = 'this-is-not-a-valid-jwt-token';
    
    const response = await request(app)
      .post('/api/auth/validate')
      .set('Authorization', `Bearer ${malformedToken}`)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Invalid token');
  });

});
