// jest.config.js
export default {
  verbose: true,
  testEnvironment: "node",
  // Enable experimental ESM support
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  // Set environment variables for tests
  setupFiles: ["<rootDir>/jest.env.js"],
  // Corrected path to setup file, relative to Backend/ (where this config is)
  setupFilesAfterEnv: ["./jest-tests/setupTests.js"],
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // The directory where Jest should output its coverage files (will be Backend/coverage/)
  coverageDirectory: "coverage",
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // Adjusted to match source file structure directly under Backend/
  collectCoverageFrom: [
    "*.js", // For files like app.js, db.js, scheduler.js
    "controllers/**/*.js",
    "middleware/**/*.js",
    "models/**/*.js",
    "routes/**/*.js",
    "!jest.config.js", // Exclude config itself
    "!jest-tests/**/*.js", // Exclude test files
    "!**/node_modules/**",
    "!coverage/**", // Exclude coverage output
    // Add any other specific files/dirs to exclude if necessary
    // '!fix-notification-setup.js', // Example, if these are scripts not part of main app logic
  ],
  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["json", "text", "lcov", "clover"],
  // Test matcher to find tests in jest-tests directory
  testMatch: ["<rootDir>/jest-tests/**/*.test.js"],
  // An array of regexp pattern strings that are matched against all test paths before executing the test
  // testPathIgnorePatterns: ['/node_modules/'],  // Indicates whether each individual test should be reported during the run
  // verbose: true,
};
