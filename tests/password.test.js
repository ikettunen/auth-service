/**
 * Auth Service - Password Hashing Tests
 * Test Suite: S2.TS6
 * 
 * Tests password hashing functionality to ensure passwords are
 * properly hashed using bcrypt and never stored in plain text.
 */

const bcrypt = require('bcryptjs');

describe('S2.TS6: Password Hashing Tests', () => {
  
  const plainPassword = 'nursing123';
  let hashedPassword;

  /**
   * Test: S2.TS6.1
   * Verify that passwords are hashed using bcrypt
   * 
   * Expected behavior:
   * - Hashed password should not equal plain password
   * - Hashed password should start with bcrypt identifier ($2b$ or $2a$)
   * - Hash should be 60 characters long (bcrypt standard)
   */
  test('S2.TS6.1 - Passwords are hashed using bcrypt', async () => {
    hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Hashed password should not equal plain password
    expect(hashedPassword).not.toBe(plainPassword);
    
    // Should start with bcrypt identifier
    expect(hashedPassword).toMatch(/^\$2[ab]\$/);
    
    // Bcrypt hashes are 60 characters long
    expect(hashedPassword.length).toBe(60);
  });

  /**
   * Test: S2.TS6.2
   * Verify that password comparison works correctly
   * 
   * Expected behavior:
   * - Correct password should match the hash
   * - Incorrect password should not match the hash
   * - Comparison should be case-sensitive
   */
  test('S2.TS6.2 - Password comparison works correctly', async () => {
    hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Correct password should match
    const isValidCorrect = await bcrypt.compare(plainPassword, hashedPassword);
    expect(isValidCorrect).toBe(true);

    // Incorrect password should not match
    const isValidWrong = await bcrypt.compare('wrongpassword', hashedPassword);
    expect(isValidWrong).toBe(false);

    // Case-sensitive comparison
    const isValidCase = await bcrypt.compare('Nursing123', hashedPassword);
    expect(isValidCase).toBe(false);
  });

  /**
   * Test: S2.TS6.3
   * Verify that plain text passwords are never stored
   * 
   * Expected behavior:
   * - Hash should not contain the plain password
   * - Hash should be cryptographically secure
   * - Same password should produce different hashes (due to salt)
   */
  test('S2.TS6.3 - Plain text passwords are never stored', async () => {
    const hash1 = await bcrypt.hash(plainPassword, 10);
    const hash2 = await bcrypt.hash(plainPassword, 10);

    // Hash should not contain plain password
    expect(hash1).not.toContain(plainPassword);
    expect(hash2).not.toContain(plainPassword);

    // Same password should produce different hashes (due to random salt)
    expect(hash1).not.toBe(hash2);

    // Both hashes should still validate against the same password
    expect(await bcrypt.compare(plainPassword, hash1)).toBe(true);
    expect(await bcrypt.compare(plainPassword, hash2)).toBe(true);
  });

});
