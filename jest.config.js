module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  collectCoverage: true,

  testPathIgnorePatterns: ['models'],
  // An array of glob patterns indicating a set of files for which
  // coverage information should be collected
  collectCoverageFrom: ['src/**/*.js'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // Indicates whether each individual test should be reported during the run
  verbose: true,
};
