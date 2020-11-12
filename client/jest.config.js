module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  collectCoverage: true,
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    '<rootDir>/actions/**/*.{js,jsx}',
    '<rootDir>/components/**/*.{js,jsx}',
    '<rootDir>/hoc/**/*.{js,jsx}',
    '<rootDir>/reducers/**/*.{js,jsx}',
    '<rootDir>/routes/**/*.{js,jsx}'
  ],

  // // The directory where Jest should output its coverage files
  coverageDirectory: '<rootDir>/../coverage',

  // An array of file extensions your modules use
  moduleFileExtensions: ['*', 'js', 'json', 'jsx'],

  moduleDirectories: ['node_modules', '../node_modules'],

  moduleNameMapper: {
    // Third Party
    'copy-text-to-clipboard':
      '<rootDir>/test/__mocks__/modules/copy-text-to-clipboard.js',
    'file-saver': '<rootDir>/test/__mocks__/modules/file-saver.js',
    'focus-trap-react': '<rootDir>/test/__mocks__/modules/return-children.js',
    'focus-trap': '<rootDir>/test/__mocks__/modules/return-children.js',
    'detect-browser': '<rootDir>/test/__mocks__/modules/detect-browser.js',
    'react-sortablejs': '<rootDir>/test/__mocks__/modules/react-sortablejs.js',
    'socket.io-client': '<rootDir>/test/__mocks__/modules/socket.io-client.js',
    suneditor: '<rootDir>/test/__mocks__/modules/suneditor.js',

    // 'moment': '<rootDir>/../node_modules/moment/moment.js',
    '@utils/Media': '<rootDir>/test/__mocks__/modules/media.js',
    '@utils/Moment': '<rootDir>/test/__mocks__/modules/moment.js',
    '@utils/Recorder': '<rootDir>/test/__mocks__/modules/recorder.js',

    // Mocked Assets
    // This matches '@alias/foo/bar/style.css'
    '@.*.css$': '<rootDir>/test/__mocks__/style.js',
    // This matches all other 'style.css'
    '.*\\.(css|less)$': '<rootDir>/test/__mocks__/style.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/test/__mocks__/file.js',

    // Application local
    '^@client(.*)': '<rootDir>/$1',
    '^@actions(.*)': '<rootDir>/actions/$1',
    '^@components(.*)': '<rootDir>/components/$1',
    '^@hoc(.*)': '<rootDir>/hoc/$1',
    '^@reducers(.*)': '<rootDir>/reducers/$1',
    '^@routes(.*)': '<rootDir>/routes/$1',
    '^@utils(.*)': '<rootDir>/util/$1',
    '^@server(.*)': '<rootDir>/../server/$1'
  },

  // transform: {
  //   "^.+\\.jsx?$": "babel-jest"
  // },

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ['./test/test.setup.js'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // The glob patterns Jest uses to detect test files
  testMatch: ['<rootDir>/test/**/*.test.js', '<rootDir>/test/**/*.test.jsx'],
  // testMatch: ['<rootDir>/test/**/User_UserSettings.test.jsx'],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],

  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  testURL: 'http://localhost',

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ['./node_modules/'],

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  snapshotSerializers: ['enzyme-to-json/serializer']
};
