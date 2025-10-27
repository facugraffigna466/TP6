import { createResponse, successResponse, errorResponse } from './response.js';

describe('Response Utils', () => {
  beforeEach(() => {
    // Mock Date to ensure consistent timestamps in tests
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('createResponse', () => {
    it('should create a response with all parameters', () => {
      // Arrange
      const success = true;
      const data = { id: 1, name: 'Test' };
      const message = 'Test message';

      // Act
      const result = createResponse(success, data, message);

      // Assert
      expect(result).toEqual({
        success: true,
        data: { id: 1, name: 'Test' },
        message: 'Test message',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should create a response with default values', () => {
      // Act
      const result = createResponse(false);

      // Assert
      expect(result).toEqual({
        success: false,
        data: null,
        message: '',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle null data', () => {
      // Act
      const result = createResponse(true, null, 'Success');

      // Assert
      expect(result).toEqual({
        success: true,
        data: null,
        message: 'Success',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle undefined data', () => {
      // Act
      const result = createResponse(true, undefined, 'Success');

      // Assert
      expect(result).toEqual({
        success: true,
        data: null,
        message: 'Success',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle empty string message', () => {
      // Act
      const result = createResponse(true, { id: 1 }, '');

      // Assert
      expect(result).toEqual({
        success: true,
        data: { id: 1 },
        message: '',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle complex data objects', () => {
      // Arrange
      const complexData = {
        users: [
          { id: 1, name: 'John', contacts: [{ email: 'john@example.com' }] },
          { id: 2, name: 'Jane', contacts: [{ email: 'jane@example.com' }] },
        ],
        metadata: {
          total: 2,
          page: 1,
          hasMore: false,
        },
      };

      // Act
      const result = createResponse(true, complexData, 'Complex data retrieved');

      // Assert
      expect(result).toEqual({
        success: true,
        data: complexData,
        message: 'Complex data retrieved',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle array data', () => {
      // Arrange
      const arrayData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];

      // Act
      const result = createResponse(true, arrayData, 'Array data retrieved');

      // Assert
      expect(result).toEqual({
        success: true,
        data: arrayData,
        message: 'Array data retrieved',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });
  });

  describe('successResponse', () => {
    it('should create a success response with data and default message', () => {
      // Arrange
      const data = { id: 1, name: 'Test' };

      // Act
      const result = successResponse(data);

      // Assert
      expect(result).toEqual({
        success: true,
        data: { id: 1, name: 'Test' },
        message: 'Success',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should create a success response with custom message', () => {
      // Arrange
      const data = { id: 1, name: 'Test' };
      const message = 'Custom success message';

      // Act
      const result = successResponse(data, message);

      // Assert
      expect(result).toEqual({
        success: true,
        data: { id: 1, name: 'Test' },
        message: 'Custom success message',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should create a success response without data', () => {
      // Act
      const result = successResponse();

      // Assert
      expect(result).toEqual({
        success: true,
        data: null,
        message: 'Success',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should create a success response with null data', () => {
      // Act
      const result = successResponse(null, 'Operation completed');

      // Assert
      expect(result).toEqual({
        success: true,
        data: null,
        message: 'Operation completed',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle empty string message', () => {
      // Act
      const result = successResponse({ id: 1 }, '');

      // Assert
      expect(result).toEqual({
        success: true,
        data: { id: 1 },
        message: '',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });
  });

  describe('errorResponse', () => {
    it('should create an error response with default message', () => {
      // Act
      const result = errorResponse();

      // Assert
      expect(result).toEqual({
        success: false,
        data: null,
        message: 'Error',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should create an error response with custom message', () => {
      // Arrange
      const message = 'Custom error message';

      // Act
      const result = errorResponse(message);

      // Assert
      expect(result).toEqual({
        success: false,
        data: null,
        message: 'Custom error message',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should create an error response with data', () => {
      // Arrange
      const message = 'Validation failed';
      const data = { errors: ['Name is required', 'Email is invalid'] };

      // Act
      const result = errorResponse(message, data);

      // Assert
      expect(result).toEqual({
        success: false,
        data: { errors: ['Name is required', 'Email is invalid'] },
        message: 'Validation failed',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should create an error response with null data', () => {
      // Act
      const result = errorResponse('Not found', null);

      // Assert
      expect(result).toEqual({
        success: false,
        data: null,
        message: 'Not found',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle empty string message', () => {
      // Act
      const result = errorResponse('');

      // Assert
      expect(result).toEqual({
        success: false,
        data: null,
        message: '',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });

    it('should handle complex error data', () => {
      // Arrange
      const message = 'Multiple validation errors';
      const data = {
        fieldErrors: {
          name: 'Name is required',
          email: 'Email format is invalid',
        },
        globalErrors: ['Database connection failed'],
        code: 'VALIDATION_ERROR',
      };

      // Act
      const result = errorResponse(message, data);

      // Assert
      expect(result).toEqual({
        success: false,
        data: data,
        message: 'Multiple validation errors',
        timestamp: '2024-01-01T00:00:00.000Z',
      });
    });
  });

  describe('Timestamp consistency', () => {
    it('should use the same timestamp for multiple calls in the same millisecond', () => {
      // Act
      const response1 = successResponse({ id: 1 });
      const response2 = errorResponse('Error');

      // Assert
      expect(response1.timestamp).toBe(response2.timestamp);
    });

    it('should generate different timestamps for calls in different milliseconds', () => {
      // Arrange
      const response1 = successResponse({ id: 1 });
      
      // Advance time by 1 millisecond
      jest.advanceTimersByTime(1);
      
      // Act
      const response2 = errorResponse('Error');

      // Assert
      expect(response1.timestamp).not.toBe(response2.timestamp);
    });
  });

  describe('Type safety', () => {
    it('should handle boolean success values correctly', () => {
      // Act
      const trueResponse = createResponse(true);
      const falseResponse = createResponse(false);

      // Assert
      expect(trueResponse.success).toBe(true);
      expect(falseResponse.success).toBe(false);
    });

    it('should handle string messages correctly', () => {
      // Act
      const response = createResponse(true, null, 'String message');

      // Assert
      expect(typeof response.message).toBe('string');
      expect(response.message).toBe('String message');
    });

    it('should handle any data type', () => {
      // Test with different data types
      const testCases = [
        { data: 'string', expected: 'string' },
        { data: 123, expected: 123 },
        { data: true, expected: true },
        { data: [], expected: [] },
        { data: {}, expected: {} },
        { data: null, expected: null },
      ];

      testCases.forEach(({ data, expected }) => {
        // Act
        const result = createResponse(true, data, 'Test');

        // Assert
        expect(result.data).toEqual(expected);
      });
    });
  });
});
