module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  collectCoverage: true,
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['<rootDir>/service/**/*..js'],

  // // The directory where Jest should output its coverage files
  coverageDirectory: '<rootDir>/../coverage',

  // An array of file extensions your modules use
  moduleFileExtensions: ['*', 'js', 'json'],

  moduleDirectories: ['node_modules', '../node_modules'],

  moduleNameMapper: {},

  transform: {
    '^.+\\.js?$': 'babel-jest'
  },

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ['./jest.setup.js'],

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: ['<rootDir>/test/**/*.test.js'],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],

  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  testURL: 'http://localhost',

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ['./node_modules/'],

  // Indicates whether each individual test should be reported during the run
  verbose: true
};
