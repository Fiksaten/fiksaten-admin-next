import { describe, it, expect, beforeEach } from 'vitest';
import Cookies from 'js-cookie';
import { resolveToken } from '../util';

describe('resolveToken', () => {
  beforeEach(() => {
    Cookies.remove('accessToken');
  });

  it('returns provided token', () => {
    expect(resolveToken('abc')).toBe('abc');
  });

  it('returns cookie token when no param', () => {
    document.cookie = 'accessToken=xyz';
    expect(resolveToken(undefined)).toBe('xyz');
  });

  it('returns null when no token available', () => {
    expect(resolveToken(undefined)).toBeNull();
  });
});
