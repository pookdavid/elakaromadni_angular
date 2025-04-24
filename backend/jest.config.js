module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.js'],
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/config/'
    ],
    testTimeout: 10000
  };