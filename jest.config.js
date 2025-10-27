export default {
  // Test environment
  testEnvironment: 'jsdom',

  // Test file patterns - Backend and Frontend
  testMatch: [
    '<rootDir>/src/server/**/*.test.js',
    '<rootDir>/src/client/**/*.test.{js,jsx}'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/server/**/*.js',
    'src/client/**/*.{js,jsx}',
    '!src/server/**/*.test.js',
    '!src/client/**/*.test.{js,jsx}',
    '!src/server/index.js'
  ],
  
  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'json'],
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module name mapping for absolute imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Test timeout
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Verbose output
  verbose: true
};
