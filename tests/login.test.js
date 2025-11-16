/**
 * Auth Service - Login Endpoint Tests
 * Test Suite: S2.TS2
 * 
 * Tests the login functionality including valid/invalid credentials,
 * JWT token generation, and proper error handling.
 */

const request = require('supertest');
const app = require('../src/server');
const jwt = require('jsonwebtoken');

describe('S2.TS2: Login Endpoint Tests', () => {
  
  // Valid test credentials
  const validCredentials = {
    email: 'anna.virtanen@nursinghome.com',
    password: 'nursing123'
  };

  /**
   * Test: S2.TS2.1
   * Verify that login with valid credentials returns a JWT token
   * 
   * Expected behavior:
   * - Status code should be 200
   * - Response should contain success: true
   * - Response should contain a token string
   */
  test('S2.TS2.1 - POST /api/auth/login with valid credentials returns JWT token', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send(validCredentials)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('token');
    expect(typeof response.body.data.token).toBe('string');
    expect(response.body.data.token.length).toBeGreaterThan(0);
  });

  /**
   * Test: S2.TS2.2
   * Verify that login returns user object with correct fields
   * 
   * Expected behavior:
   * - User object should contain: id, email, role, staffId, firstName, lastName
   * - All fields should have appropriate values
   */
  test('S2.TS2.2 - POST /api/auth/login returns user object with correct fields', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send(validCredentials)
      .expect(200);

    const user = response.body.data.user;
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email', validCredentials.email);
    expect(user).toHaveProperty('role');
    expect(user).toHaveProperty('staffId');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
  });

  /**
   * Test: S2.TS2.3
   * Verify that login with invalid email returns 401 Unauthorized
   * 
   * Expected behavior:
   * - Status code should be 401
   * - Response should contain success: false
   * - Response should contain error message about invalid credentials
   */
  test('S2.TS2.3 - POST /api/auth/login with invalid email returns 401', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@nursinghome.com',
        password: 'nursing123'
      })
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });

  /**
   * Test: S2.TS2.4
   * Verify that login with invalid password returns 401 Unauthorized
   * 
   * Expected behavior:
   * - Status code should be 401
   * - Response should contain success: false
   * - Response should contain error message about invalid credentials
   */
  test('S2.TS2.4 - POST /api/auth/login with invalid password returns 401', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: validCredentials.email,
        password: 'wrongpassword'
      })
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });

  /**
   * Test: S2.TS2.5
   * Verify that login without email returns 400 Bad Request
   * 
   * Expected behavior:
   * - Status code should be 400
   * - Response should contain success: false
   * - Response should contain error message about required fields
   */
  test('S2.TS2.5 - POST /api/auth/login without email returns 400', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        password: 'nursing123'
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Email and password are required');
  });

  /**
   * Test: S2.TS2.6
   * Verify that login without password returns 400 Bad Request
   * 
   * Expected behavior:
   * - Status code should be 400
   * - Response should contain success: false
   * - Response should contain error message about required fields
   */
  test('S2.TS2.6 - POST /api/auth/login without password returns 400', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: validCredentials.email
      })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Email and password are required');
  });

  /**
   * Test: S2.TS2.7
   * Verify that JWT token contains correct user claims
   * 
   * Expected behavior:
   * - Token should be decodable
   * - Token should contain: sub, email, role, staffId, firstName, lastName
   * - Claims should match the user data
   */
  test('S2.TS2.7 - JWT token contains correct user claims (sub, email, role, staffId)', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send(validCredentials)
      .expect(200);

    const token = response.body.data.token;
    const decoded = jwt.decode(token);

    expect(decoded).toHaveProperty('sub');
    expect(decoded).toHaveProperty('email', validCredentials.email);
    expect(decoded).toHaveProperty('role');
    expect(decoded).toHaveProperty('staffId');
    expect(decoded).toHaveProperty('firstName');
    expect(decoded).toHaveProperty('lastName');
  });

  /**
   * Test: S2.TS2.8
   * Verify that JWT token has correct expiration time (24 hours)
   * 
   * Expected behavior:
   * - Token should have 'exp' claim
   * - Token should have 'iat' (issued at) claim
   * - Expiration should be approximately 24 hours from issued time
   */
  test('S2.TS2.8 - JWT token has correct expiration time (24h)', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send(validCredentials)
      .expect(200);

    const token = response.body.data.token;
    const decoded = jwt.decode(token);

    expect(decoded).toHaveProperty('exp');
    expect(decoded).toHaveProperty('iat');

    // Calculate expiration duration in hours
    const expirationDuration = (decoded.exp - decoded.iat) / 3600;
    
    // Should be 24 hours (with small tolerance for processing time)
    expect(expirationDuration).toBeGreaterThanOrEqual(23.9);
    expect(expirationDuration).toBeLessThanOrEqual(24.1);
  });

});
