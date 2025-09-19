// http.test.ts - Unit tests for HttpError class
import '@testing-library/jest-dom';
import { HttpError } from '../http';

describe('HttpError Class', () => {
  describe('Constructor', () => {
    it('should create HttpError with status and message', () => {
      const error = new HttpError(404, 'Not Found');
      
      expect(error).toBeInstanceOf(HttpError);
      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(404);
      expect(error.message).toBe('Not Found');
      expect(error.name).toBe('HttpError');
    });

    it('should create HttpError with different status codes', () => {
      const error500 = new HttpError(500, 'Internal Server Error');
      const error401 = new HttpError(401, 'Unauthorized');
      const error403 = new HttpError(403, 'Forbidden');
      
      expect(error500.status).toBe(500);
      expect(error500.message).toBe('Internal Server Error');
      
      expect(error401.status).toBe(401);
      expect(error401.message).toBe('Unauthorized');
      
      expect(error403.status).toBe(403);
      expect(error403.message).toBe('Forbidden');
    });

    it('should handle empty message', () => {
      const error = new HttpError(400, '');
      
      expect(error.status).toBe(400);
      expect(error.message).toBe('');
      expect(error.name).toBe('HttpError');
    });

    it('should handle long messages', () => {
      const longMessage = 'This is a very long error message that contains multiple words and describes a complex error scenario';
      const error = new HttpError(422, longMessage);
      
      expect(error.status).toBe(422);
      expect(error.message).toBe(longMessage);
    });
  });

  describe('Error Properties', () => {
    it('should have correct name property', () => {
      const error = new HttpError(400, 'Bad Request');
      expect(error.name).toBe('HttpError');
    });

    it('should be throwable', () => {
      expect(() => {
        throw new HttpError(500, 'Server Error');
      }).toThrow(HttpError);
    });

    it('should be catchable', () => {
      try {
        throw new HttpError(404, 'Not Found');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpError);
        expect((error as HttpError).status).toBe(404);
        expect((error as HttpError).message).toBe('Not Found');
      }
    });
  });

  describe('Error Inheritance', () => {
    it('should inherit from Error', () => {
      const error = new HttpError(400, 'Bad Request');
      
      expect(error instanceof Error).toBe(true);
      expect(error instanceof HttpError).toBe(true);
    });

    it('should have stack trace', () => {
      const error = new HttpError(500, 'Internal Error');
      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });
  });

  describe('Common HTTP Status Codes', () => {
    const commonErrors = [
      { status: 400, message: 'Bad Request' },
      { status: 401, message: 'Unauthorized' },
      { status: 403, message: 'Forbidden' },
      { status: 404, message: 'Not Found' },
      { status: 409, message: 'Conflict' },
      { status: 422, message: 'Unprocessable Entity' },
      { status: 500, message: 'Internal Server Error' },
      { status: 502, message: 'Bad Gateway' },
      { status: 503, message: 'Service Unavailable' }
    ];

    commonErrors.forEach(({ status, message }) => {
      it(`should handle ${status} ${message} correctly`, () => {
        const error = new HttpError(status, message);
        
        expect(error.status).toBe(status);
        expect(error.message).toBe(message);
        expect(error.name).toBe('HttpError');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero status code', () => {
      const error = new HttpError(0, 'Network Error');
      expect(error.status).toBe(0);
      expect(error.message).toBe('Network Error');
    });

    it('should handle negative status code', () => {
      const error = new HttpError(-1, 'Unknown Error');
      expect(error.status).toBe(-1);
      expect(error.message).toBe('Unknown Error');
    });

    it('should handle very large status code', () => {
      const error = new HttpError(999999, 'Invalid Status');
      expect(error.status).toBe(999999);
      expect(error.message).toBe('Invalid Status');
    });

    it('should handle special characters in message', () => {
      const message = 'Error with símbolos especiales & números 123! @#$%^&*()';
      const error = new HttpError(400, message);
      expect(error.message).toBe(message);
    });
  });
});