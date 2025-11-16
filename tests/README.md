# Auth Service Test Suite

Comprehensive test suite for the Auth Service (S2) using Jest and Supertest.

## Test Coverage

### Test Suites

| Suite ID | Name | Tests | File |
|----------|------|-------|------|
| S2.TS1 | Health Endpoint Tests | 1 | health.test.js |
| S2.TS2 | Login Endpoint Tests | 8 | login.test.js |
| S2.TS3 | Token Validation Tests | 5 | validation.test.js |
| S2.TS4 | User Info Endpoint Tests | 3 | userinfo.test.js |
| S2.TS5 | Logout Endpoint Tests | 1 | logout.test.js |
| S2.TS6 | Password Hashing Tests | 3 | password.test.js |
| **Total** | **6 Test Suites** | **21 Tests** | |

## Test Numbering System

Tests follow the format: **S#.TS#.#**
- **S2** = Service 2 (Auth Service)
- **TS#** = Test Suite number
- **#** = Individual test number

Example: `S2.TS2.3` = Auth Service, Login Test Suite, Test #3

## Installation

```bash
# Install dependencies
npm install

# Install test dependencies
npm install --save-dev jest supertest jest-html-reporter
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (for development)
npm run test:watch

# Generate full report (coverage + natural language report)
npm run test:report
```

## Test Reports

After running tests, reports are generated in the `reports/` folder:

- **test-report.html** - Interactive HTML report with test results
- **test-report-natural-language.txt** - Human-readable text report
- **test-report-natural-language.md** - Markdown formatted report
- **coverage/** - Code coverage reports (HTML, LCOV)

## Test Structure

Each test file includes:

1. **Natural language comments** - Explaining what each test does
2. **Expected behavior** - Clear description of expected outcomes
3. **Assertions** - Comprehensive checks for all scenarios
4. **Error cases** - Testing both success and failure paths

## Example Test

```javascript
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
});
```

## Test Credentials

The tests use mock users defined in the auth service:

- **Email:** anna.virtanen@nursinghome.com
- **Password:** nursing123
- **Role:** nurse

## What's Tested

### ✓ Health Checks
- Service availability
- Correct service identification

### ✓ Authentication
- Valid login credentials
- Invalid email/password
- Missing credentials
- JWT token generation
- Token expiration (24 hours)

### ✓ Token Validation
- Valid token verification
- Invalid token rejection
- Expired token handling
- Missing token handling
- Malformed token handling

### ✓ User Information
- Retrieving current user data
- Token-based authentication
- Error handling

### ✓ Logout
- Logout endpoint response

### ✓ Password Security
- Bcrypt hashing
- Password comparison
- Salt generation
- Plain text prevention

## Coverage Goals

- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm test
  
- name: Generate coverage
  run: npm run test:coverage
  
- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Troubleshooting

### Tests failing with "Cannot find module"
```bash
npm install
```

### Port already in use
The tests use supertest which doesn't bind to a port. If you see port errors, make sure the auth service isn't running separately.

### JWT_SECRET not found
Tests use a default test secret. For production, ensure JWT_SECRET is set in .env file.

## Contributing

When adding new tests:

1. Follow the numbering convention (S2.TS#.#)
2. Add natural language comments
3. Document expected behavior
4. Test both success and error cases
5. Update this README with new test information

## Related Documentation

- [Testing Plan](../../testing_plan.md)
- [API Documentation](../../api-docs/auth-service.html)
- [Auth Service README](../README.md)
