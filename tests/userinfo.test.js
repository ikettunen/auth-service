/**
 * Auth Service - User Info Endpoint Tests
 * Test Suite: S2.TS4
 * 
 * Tests the /api/auth/me endpoint that returns current user information
 * based on the provided JWT token.
 */

const request = require('supertest');
const app = require('../src/server');

describe('S2.TS4: User Info Endpoint Tests', () => {
  
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
   * Test: S2.TS4.1
   * Verify that /me endpoint with valid token returns user data
   * 
   * Expected behavior:
   * - Status code should be 200
   * - Response should contain success: true
   * - Response should contain complete user data
   * - User data should match the authenticated user
   */
  test('S2.TS4.1 - GET /api/auth/me with valid token returns user data', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${validToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('email', validCredentials.email);
    expect(response.body.data).toHaveProperty('role');
    expect(response.body.data).toHaveProperty('staffId');
    expect(response.body.data).toHaveProperty('firstName');
    expect(response.body.data).toHaveProperty('lastName');
  });

  /**
   * Test: S2.TS4.2
   * Verify that /me endpoint without token returns 401
   * 
   * Expected behavior:
   * - Status code should be 401
   * - Response should contain success: false
   * - Response should contain error message about missing token
   */
  test('S2.TS4.2 - GET /api/auth/me without token returns 401', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'No token provided');
  });

  /**
   * Test: S2.TS4.3
   * Verify that /me endpoint with invalid token returns 401
   * 
   * Expected behavior:
   * - Status code should be 401
   * - Response should contain success: false
   * - Response should contain error message about invalid token
   */
  test('S2.TS4.3 - GET /api/auth/me with invalid token returns 401', async () => {
    const invalidToken = 'invalid.jwt.token';
    
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Invalid token');
  });

});
