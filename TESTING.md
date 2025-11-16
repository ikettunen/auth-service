# Auth Service Testing Guide

Complete guide for testing the Auth Service (S2) in the Nursing Home Management System.

## Quick Start

```bash
# 1. Install dependencies
cd auth-service
npm install

# 2. Run tests
npm test

# 3. View reports
start reports/test-report.html
```

## Table of Contents

1. [Overview](#overview)
2. [Test Suite Structure](#test-suite-structure)
3. [Installation](#installation)
4. [Running Tests](#running-tests)
5. [Test Reports](#test-reports)
6. [Writing Tests](#writing-tests)
7. [CI/CD Integration](#cicd-integration)
8. [Troubleshooting](#troubleshooting)

## Overview

The Auth Service test suite provides comprehensive coverage of authentication and authorization functionality:

- **21 unit tests** across 6 test suites
- **JWT token** generation and validation
- **Password hashing** with bcrypt
- **Error handling** for all edge cases
- **Security testing** for authentication flows

### Technologies

- **Jest** - Test framework
- **Supertest** - HTTP assertions
- **Jest HTML Reporter** - Report generation

## Test Suite Structure

```
auth-service/
├── tests/
│   ├── health.test.js       # S2.TS1 - Health endpoint (1 test)
│   ├── login.test.js        # S2.TS2 - Login functionality (8 tests)
│   ├── validation.test.js   # S2.TS3 - Token validation (5 tests)
│   ├── userinfo.test.js     # S2.TS4 - User info endpoint (3 tests)
│   ├── logout.test.js       # S2.TS5 - Logout endpoint (1 test)
│   ├── password.test.js     # S2.TS6 - Password hashing (3 tests)
│   └── README.md
├── scripts/
│   └── generate-report.js   # Natural language report generator
├── reports/                 # Generated test reports
├── coverage/                # Code coverage reports
├── jest.config.js          # Jest configuration
└── TESTING.md              # This file
```

## Installation

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Install Dependencies

```bash
# Install production dependencies
npm install

# Install test dependencies
npm install --save-dev jest supertest jest-html-reporter
```

### Environment Setup

Create `.env.test` file (already included):

```env
NODE_ENV=test
PORT=3002
JWT_SECRET=test-secret-key-for-testing-only
JWT_EXPIRES_IN=24h
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Generate full report (tests + coverage + natural language report)
npm run test:report
```

### Run Specific Test Suites

```bash
# Run only login tests
npm test -- login.test.js

# Run only validation tests
npm test -- validation.test.js

# Run tests matching pattern
npm test -- --testNamePattern="S2.TS2"
```

### Verbose Output

```bash
# Show detailed test output
npm test -- --verbose

# Show test coverage in terminal
npm test -- --coverage
```

## Test Reports

### 1. HTML Report

**Location:** `reports/test-report.html`

Interactive report with:
- ✓ Pass/fail status for each test
- ✓ Execution time
- ✓ Console logs
- ✓ Error messages and stack traces

**View:**
```bash
start reports/test-report.html  # Windows
open reports/test-report.html   # Mac
```

### 2. Natural Language Report

**Location:** `reports/test-report-natural-language.txt`

Human-readable report with:
- Executive summary
- Test suite descriptions
- Coverage statistics
- Security considerations
- Recommendations

**View:**
```bash
cat reports/test-report-natural-language.txt
```

### 3. Coverage Report

**Location:** `coverage/lcov-report/index.html`

Detailed code coverage with:
- Line-by-line coverage
- Branch coverage
- Function coverage
- Uncovered code highlighting

**View:**
```bash
start coverage/lcov-report/index.html
```

## Test Coverage

### Current Coverage Goals

| Metric | Goal | Current |
|--------|------|---------|
| Statements | > 80% | Run tests to see |
| Branches | > 75% | Run tests to see |
| Functions | > 80% | Run tests to see |
| Lines | > 80% | Run tests to see |

### What's Covered

✓ **Health Endpoint**
- Service availability check

✓ **Login Functionality**
- Valid credentials → JWT token
- Invalid email → 401 error
- Invalid password → 401 error
- Missing fields → 400 error
- Token claims validation
- Token expiration (24h)

✓ **Token Validation**
- Valid token → user data
- Invalid token → 401 error
- Expired token → 401 error
- Missing token → 401 error
- Malformed token → 401 error

✓ **User Information**
- Get current user with valid token
- Error handling for invalid/missing tokens

✓ **Logout**
- Successful logout response

✓ **Password Security**
- Bcrypt hashing
- Password comparison
- Salt generation
- Plain text prevention

## Writing Tests

### Test Template

```javascript
/**
 * Test: S2.TS#.#
 * Brief description of what this test verifies
 * 
 * Expected behavior:
 * - List expected outcomes
 * - Include status codes
 * - Describe response structure
 */
test('S2.TS#.# - Test description', async () => {
    // Arrange: Set up test data
    const testData = { /* ... */ };
    
    // Act: Execute the test
    const response = await request(app)
        .post('/api/endpoint')
        .send(testData)
        .expect(200);
    
    // Assert: Verify results
    expect(response.body).toHaveProperty('success', true);
});
```

### Best Practices

1. **Use descriptive test names** with test ID (S2.TS#.#)
2. **Add natural language comments** explaining the test
3. **Document expected behavior** before assertions
4. **Test both success and error cases**
5. **Use beforeAll/afterAll** for setup/teardown
6. **Keep tests independent** - no shared state
7. **Mock external dependencies** when needed

### Adding New Tests

1. Create test file in `tests/` folder
2. Follow naming convention: `feature.test.js`
3. Add test suite to `scripts/generate-report.js`
4. Update test count in documentation
5. Run tests to verify

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Auth Service Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        cd auth-service
        npm install
    
    - name: Run tests
      run: |
        cd auth-service
        npm run test:coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./auth-service/coverage/lcov.info
    
    - name: Archive test reports
      uses: actions/upload-artifact@v3
      with:
        name: test-reports
        path: auth-service/reports/
```

### Pre-commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/sh
cd auth-service
npm test
```

## Troubleshooting

### Common Issues

**1. Tests fail with "Cannot find module"**
```bash
# Solution: Install dependencies
npm install
```

**2. Port already in use**
```bash
# Solution: Tests use supertest (no port binding)
# If issue persists, stop the auth service:
pm2 stop auth-service
```

**3. JWT_SECRET not found**
```bash
# Solution: Create .env.test file
echo "JWT_SECRET=test-secret" > .env.test
```

**4. Tests timeout**
```bash
# Solution: Increase timeout in jest.config.js
testTimeout: 10000  // 10 seconds
```

**5. Coverage reports not generated**
```bash
# Solution: Run with coverage flag
npm run test:coverage
```

### Debug Mode

```bash
# Run tests with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Run with verbose logging
DEBUG=* npm test
```

## Performance

### Test Execution Time

- **Health tests:** ~50ms
- **Login tests:** ~500ms (bcrypt hashing)
- **Validation tests:** ~300ms
- **User info tests:** ~200ms
- **Logout tests:** ~50ms
- **Password tests:** ~400ms (bcrypt operations)

**Total:** ~1.5 seconds for full suite

### Optimization Tips

1. Use `beforeAll` for expensive setup
2. Mock bcrypt in unit tests (use real in integration)
3. Run tests in parallel (Jest default)
4. Use `--maxWorkers` to control parallelism

## Related Documentation

- [Testing Plan](../testing_plan.md) - Overall testing strategy
- [API Documentation](../api-docs/auth-service.html) - API specs
- [Test Suite README](tests/README.md) - Detailed test info
- [Reports README](reports/README.md) - Report documentation

## Support

For issues or questions:
1. Check this documentation
2. Review test output and error messages
3. Check Jest documentation: https://jestjs.io/
4. Review Supertest docs: https://github.com/visionmedia/supertest

---

**Last Updated:** November 2024  
**Test Suite Version:** 1.0.0  
**Maintainer:** Development Team
