module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '__tests__/.*.tests\\.ts$',
  setupFilesAfterEnv: ['./jest.setup.js'],
};
