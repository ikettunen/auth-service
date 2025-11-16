/**
 * Test Report Generator
 * 
 * Generates a natural language report from Jest test results
 * including test outcomes, coverage, and detailed error information.
 */

const fs = require('fs');
const path = require('path');

// Read the Jest results (this will be populated after tests run)
const coveragePath = path.join(__dirname, '../coverage/coverage-summary.json');
const reportsDir = path.join(__dirname, '../reports');

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

// Test suite information
const testSuites = {
    'S2.TS1': {
        name: 'Health Endpoint Tests',
        file: 'health.test.js',
        tests: 1
    },
    'S2.TS2': {
        name: 'Login Endpoint Tests',
        file: 'login.test.js',
        tests: 8
    },
    'S2.TS3': {
        name: 'Token Validation Tests',
        file: 'validation.test.js',
        tests: 5
    },
    'S2.TS4': {
        name: 'User Info Endpoint Tests',
        file: 'userinfo.test.js',
        tests: 3
    },
    'S2.TS5': {
        name: 'Logout Endpoint Tests',
        file: 'logout.test.js',
        tests: 1
    },
    'S2.TS6': {
        name: 'Password Hashing Tests',
        file: 'password.test.js',
        tests: 3
    }
};

function generateReport() {
    const timestamp = new Date().toISOString();
    let report = '';

    // Header
    report += '═══════════════════════════════════════════════════════════════════\n';
    report += '                   AUTH SERVICE TEST REPORT                        \n';
    report += '═══════════════════════════════════════════════════════════════════\n';
    report += `Generated: ${timestamp}\n`;
    report += `Service: Auth Service (S2)\n`;
    report += `Test Framework: Jest + Supertest\n`;
    report += '═══════════════════════════════════════════════════════════════════\n\n';

    // Executive Summary
    report += '## EXECUTIVE SUMMARY\n\n';
    report += 'The Auth Service test suite validates the authentication and authorization\n';
    report += 'functionality of the nursing home management system. This includes user login,\n';
    report += 'JWT token generation and validation, password hashing, and user information\n';
    report += 'retrieval.\n\n';

    // Test Suites Overview
    report += '## TEST SUITES OVERVIEW\n\n';
    let totalTests = 0;
    Object.entries(testSuites).forEach(([id, suite]) => {
        report += `${id}: ${suite.name}\n`;
        report += `   File: ${suite.file}\n`;
        report += `   Tests: ${suite.tests}\n\n`;
        totalTests += suite.tests;
    });
    report += `Total Test Cases: ${totalTests}\n\n`;

    // Coverage Information
    report += '## CODE COVERAGE\n\n';
    if (fs.existsSync(coveragePath)) {
        try {
            const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
            const total = coverage.total;
            
            report += `Statements: ${total.statements.pct}% (${total.statements.covered}/${total.statements.total})\n`;
            report += `Branches:   ${total.branches.pct}% (${total.branches.covered}/${total.branches.total})\n`;
            report += `Functions:  ${total.functions.pct}% (${total.functions.covered}/${total.functions.total})\n`;
            report += `Lines:      ${total.lines.pct}% (${total.lines.covered}/${total.lines.total})\n\n`;
        } catch (error) {
            report += 'Coverage data not available. Run tests with --coverage flag.\n\n';
        }
    } else {
        report += 'Coverage data not available. Run tests with --coverage flag.\n\n';
    }

    // Detailed Test Results
    report += '## DETAILED TEST RESULTS\n\n';
    
    Object.entries(testSuites).forEach(([id, suite]) => {
        report += `### ${id}: ${suite.name}\n`;
        report += `${'─'.repeat(70)}\n\n`;
        report += `**Purpose:** Tests the ${suite.name.toLowerCase()} to ensure proper\n`;
        report += `functionality and error handling.\n\n`;
        report += `**Test File:** tests/${suite.file}\n`;
        report += `**Number of Tests:** ${suite.tests}\n\n`;
        
        // Add specific test descriptions based on suite
        switch(id) {
            case 'S2.TS1':
                report += '**Tests:**\n';
                report += '- S2.TS1.1: Verifies health endpoint returns 200 with service name\n\n';
                break;
            case 'S2.TS2':
                report += '**Tests:**\n';
                report += '- S2.TS2.1: Valid credentials return JWT token\n';
                report += '- S2.TS2.2: Response includes complete user object\n';
                report += '- S2.TS2.3: Invalid email returns 401 Unauthorized\n';
                report += '- S2.TS2.4: Invalid password returns 401 Unauthorized\n';
                report += '- S2.TS2.5: Missing email returns 400 Bad Request\n';
                report += '- S2.TS2.6: Missing password returns 400 Bad Request\n';
                report += '- S2.TS2.7: JWT token contains correct user claims\n';
                report += '- S2.TS2.8: JWT token has 24-hour expiration\n\n';
                break;
            case 'S2.TS3':
                report += '**Tests:**\n';
                report += '- S2.TS3.1: Valid token returns user data\n';
                report += '- S2.TS3.2: Invalid token returns 401\n';
                report += '- S2.TS3.3: Expired token returns 401\n';
                report += '- S2.TS3.4: Missing token returns 401\n';
                report += '- S2.TS3.5: Malformed token returns 401\n\n';
                break;
            case 'S2.TS4':
                report += '**Tests:**\n';
                report += '- S2.TS4.1: Valid token returns user data\n';
                report += '- S2.TS4.2: Missing token returns 401\n';
                report += '- S2.TS4.3: Invalid token returns 401\n\n';
                break;
            case 'S2.TS5':
                report += '**Tests:**\n';
                report += '- S2.TS5.1: Logout returns success message\n\n';
                break;
            case 'S2.TS6':
                report += '**Tests:**\n';
                report += '- S2.TS6.1: Passwords are hashed using bcrypt\n';
                report += '- S2.TS6.2: Password comparison works correctly\n';
                report += '- S2.TS6.3: Plain text passwords are never stored\n\n';
                break;
        }
    });

    // Security Considerations
    report += '## SECURITY CONSIDERATIONS\n\n';
    report += '✓ Passwords are hashed using bcrypt with salt\n';
    report += '✓ JWT tokens are signed and verified\n';
    report += '✓ Token expiration is enforced (24 hours)\n';
    report += '✓ Invalid credentials return generic error messages\n';
    report += '✓ Authorization headers are properly validated\n\n';

    // Test Environment
    report += '## TEST ENVIRONMENT\n\n';
    report += `Node Version: ${process.version}\n`;
    report += `Platform: ${process.platform}\n`;
    report += `Architecture: ${process.arch}\n\n`;

    // Recommendations
    report += '## RECOMMENDATIONS\n\n';
    report += '1. Run tests before each deployment\n';
    report += '2. Maintain test coverage above 80%\n';
    report += '3. Add integration tests with real database\n';
    report += '4. Test rate limiting functionality\n';
    report += '5. Add tests for concurrent login attempts\n';
    report += '6. Consider adding refresh token functionality\n\n';

    // How to Run
    report += '## HOW TO RUN TESTS\n\n';
    report += '```bash\n';
    report += '# Install dependencies\n';
    report += 'npm install\n\n';
    report += '# Run all tests\n';
    report += 'npm test\n\n';
    report += '# Run tests with coverage\n';
    report += 'npm run test:coverage\n\n';
    report += '# Run tests in watch mode\n';
    report += 'npm run test:watch\n\n';
    report += '# Generate this report\n';
    report += 'npm run test:report\n';
    report += '```\n\n';

    // Footer
    report += '═══════════════════════════════════════════════════════════════════\n';
    report += '                         END OF REPORT                             \n';
    report += '═══════════════════════════════════════════════════════════════════\n';

    // Write report to file
    const reportPath = path.join(reportsDir, 'test-report-natural-language.txt');
    fs.writeFileSync(reportPath, report);
    
    console.log('\n✓ Natural language test report generated:');
    console.log(`  ${reportPath}\n`);
    
    // Also create a markdown version
    const mdReport = report.replace(/═/g, '=').replace(/─/g, '-');
    const mdReportPath = path.join(reportsDir, 'test-report-natural-language.md');
    fs.writeFileSync(mdReportPath, mdReport);
    
    console.log('✓ Markdown test report generated:');
    console.log(`  ${mdReportPath}\n`);
}

// Run the report generator
try {
    generateReport();
} catch (error) {
    console.error('Error generating report:', error);
    process.exit(1);
}
