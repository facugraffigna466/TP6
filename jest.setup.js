// Jest setup file for global test configuration
import '@testing-library/jest-dom';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

// Global test utilities
global.console = {
  ...console,
  // Uncomment to ignore console.log during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Mock fetch globally
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn();
}

if (typeof window !== 'undefined') {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

}

// Mock IntersectionObserver
if (typeof global.IntersectionObserver === 'undefined') {
  class IntersectionObserver {
    disconnect() {}
    observe() {}
    unobserve() {}
  }
  global.IntersectionObserver = IntersectionObserver;
  if (typeof window !== 'undefined') {
    window.IntersectionObserver = IntersectionObserver;
  }
}

// Mock ResizeObserver
if (typeof global.ResizeObserver === 'undefined') {
  class ResizeObserver {
    disconnect() {}
    observe() {}
    unobserve() {}
  }
  global.ResizeObserver = ResizeObserver;
  if (typeof window !== 'undefined') {
    window.ResizeObserver = ResizeObserver;
  }
}

// Mock TextEncoder and TextDecoder for React Router
const { TextEncoder, TextDecoder } = require('util');
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Setup and teardown for each test
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup after each test
  jest.restoreAllMocks();
});
