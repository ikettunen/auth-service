/**
 * Auth Service - Logout Endpoint Tests
 * Test Suite: S2.TS5
 * 
 * Tests the logout endpoint. Note: Since JWT is stateless,
 * logout is mainly for client-side cleanup, but we verify
 * the endpoint responds correctly.
 */

const request = require('supertest');
const app = require('../src/server');

describe('S2.TS5: Logout Endpoint Tests', () => {
  
  /**
   * Test: S2.TS5.1
   * Verify that logout endpoint returns success message
   * 
   * Expected behavior:
   * - Status code should be 200
   * - Response should contain success: true
   * - Response should contain a success message
   * 
   * Note: JWT is stateless, so logout is primarily for client-side
   * token removal. The server just acknowledges the logout request.
   */
  test('S2.TS5.1 - POST /api/auth/logout returns success message', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Logged out successfully');
  });

});
