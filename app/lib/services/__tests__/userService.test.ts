import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateUser } from '../userService';
import * as api from '../../openapi-client';
import type { UpdateCurrentUserData } from '../../openapi-client';

vi.mock('../../openapi-client');

const mockUpdate = api.updateCurrentUser as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('updateUser', () => {
  it('calls API with token and data', async () => {
    mockUpdate.mockResolvedValue({ data: { id: '1' } });
    const result = await updateUser('token', { name: 'John' } as UpdateCurrentUserData['body']);
    expect(mockUpdate).toHaveBeenCalledWith({
      headers: { Authorization: 'Bearer token' },
      body: { name: 'John' },
    });
    expect(result).toEqual({ id: '1' });
  });

  it('throws when API returns error', async () => {
    mockUpdate.mockResolvedValue({ error: { message: 'fail' } });
    await expect(updateUser('token', {} as UpdateCurrentUserData['body'])).rejects.toThrow('fail');
  });
});
