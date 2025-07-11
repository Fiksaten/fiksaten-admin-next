import { describe, it, expect, beforeEach } from 'vitest';
import { verifyToken } from '../auth';
const tokenNoSecret =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzUyMDU0Mzg4LCJleHAiOjE3NTIwNTc5ODh9.ldTz7ZZ5KXZUQHIDnf44vYMW9BOLfPZ5FgPzw4ZIRZs';

describe('verifyToken', () => {
  beforeEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('returns null for invalid token when secret is set', async () => {
    process.env.JWT_SECRET = 'test-secret';
    const res = await verifyToken('invalid.token');
    expect(res).toBeNull();
  });

  it('decodes without verification when secret missing', async () => {
    const res = await verifyToken(tokenNoSecret);
    expect(res?.sub).toBe('1');
  });
});
