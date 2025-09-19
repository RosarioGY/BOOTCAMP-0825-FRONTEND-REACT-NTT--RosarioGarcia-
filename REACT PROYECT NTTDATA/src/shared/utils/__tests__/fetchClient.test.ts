// fetchClient.test.ts - Unit tests for fetchClient utility
import '@testing-library/jest-dom';
import { apiFetch } from '../fetchClient';
import { HttpError } from '../http';

// Mock the fetch function
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock the API constant
jest.mock('@/shared/constants/api', () => ({
  API: {
    baseUrl: 'https://api.test.com'
  }
}));

describe('apiFetch Function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const result = await apiFetch<typeof mockData>('/test');

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/test', {
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(mockData);
    });

    it('should make successful POST request with body', async () => {
      const mockData = { success: true };
      const requestBody = { name: 'Test' };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const result = await apiFetch<typeof mockData>('/test', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/test', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      expect(result).toEqual(mockData);
    });

    it('should handle custom headers', async () => {
      const mockData = { id: 1 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      await apiFetch<typeof mockData>('/test', {
        headers: {
          'Authorization': 'Bearer token123',
          'Custom-Header': 'value',
        },
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/test', {
        headers: {
          'Authorization': 'Bearer token123',
          'Custom-Header': 'value',
        },
      });
    });

    it('should override default Content-Type header', async () => {
      const mockData = { id: 1 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      await apiFetch<typeof mockData>('/test', {
        headers: {
          'Content-Type': 'text/plain',
        },
      });

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/test', {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    });
  });

  describe('Error handling', () => {
    it('should throw HttpError for 404 response', async () => {
      const errorText = 'Not Found';
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          text: jest.fn().mockResolvedValueOnce(errorText),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          text: jest.fn().mockResolvedValueOnce(errorText),
        });

      await expect(apiFetch('/nonexistent')).rejects.toThrow(HttpError);
      await expect(apiFetch('/nonexistent')).rejects.toThrow(errorText);
    });

    it('should throw HttpError for 500 response', async () => {
      const errorText = 'Internal Server Error';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: jest.fn().mockResolvedValueOnce(errorText),
      });

      await expect(apiFetch('/error')).rejects.toThrow(HttpError);
    });

    it('should handle empty error response text', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: jest.fn().mockResolvedValueOnce(''),
      });

      try {
        await apiFetch('/bad-request');
      } catch (error) {
        expect((error as HttpError).status).toBe(400);
        expect((error as HttpError).message).toBe('Algo salió mal, inténtelo más tarde');
      }
    });

    it('should handle error when text() fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        text: jest.fn().mockRejectedValueOnce(new Error('Failed to read text')),
      });

      try {
        await apiFetch('/unprocessable');
      } catch (error) {
        expect((error as HttpError).status).toBe(422);
        expect((error as HttpError).message).toBe('Algo salió mal, inténtelo más tarde');
      }
    });

    it('should handle different HTTP error status codes', async () => {
      const errorCases = [
        { status: 401, message: 'Unauthorized' },
        { status: 403, message: 'Forbidden' },
        { status: 409, message: 'Conflict' },
        { status: 422, message: 'Unprocessable Entity' },
        { status: 502, message: 'Bad Gateway' },
      ];

      for (const { status, message } of errorCases) {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status,
          text: jest.fn().mockResolvedValueOnce(message),
        });

        try {
          await apiFetch('/error');
        } catch (error) {
          expect((error as HttpError).status).toBe(status);
          expect((error as HttpError).message).toBe(message);
        }
      }
    });
  });

  describe('Different HTTP methods', () => {
    it('should handle PUT request', async () => {
      const mockData = { updated: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      await apiFetch('/test', { method: 'PUT' });

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/test', {
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      });
    });

    it('should handle DELETE request', async () => {
      const mockData = { deleted: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      await apiFetch('/test', { method: 'DELETE' });

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/test', {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      });
    });

    it('should handle PATCH request', async () => {
      const mockData = { patched: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      await apiFetch('/test', { method: 'PATCH' });

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/test', {
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      });
    });
  });

  describe('URL construction', () => {
    it('should construct URL with base path correctly', async () => {
      const mockData = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      await apiFetch('/api/v1/users');

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.com/api/v1/users', {
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should handle path without leading slash', async () => {
      const mockData = { success: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      await apiFetch('users');

      expect(mockFetch).toHaveBeenCalledWith('https://api.test.comusers', {
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });

  describe('Type safety', () => {
    it('should return typed response', async () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const mockUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockUser),
      });

      const result = await apiFetch<User>('/user');

      expect(result).toEqual(mockUser);
      expect(result.id).toBe(1);
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
    });
  });
});