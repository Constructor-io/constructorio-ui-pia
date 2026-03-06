// jest.config.js
module.exports = {
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['**/**/*.test.(js|jsx|ts|tsx)', '!**/**/*.server.test.(js|jsx|ts|tsx)'],
      moduleNameMapper: {
        '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/spec/__mocks__/fileMock.js',
      },
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['**/**/*.server.test.(js|jsx)'],
      moduleNameMapper: {
        '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/spec/__mocks__/fileMock.js',
      },
    },
  ],
};
