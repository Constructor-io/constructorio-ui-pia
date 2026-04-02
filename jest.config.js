// jest.config.js
module.exports = {
  projects: [
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['**/**/*.test.(js|jsx|ts|tsx)', '!**/**/*.server.test.(js|jsx|ts|tsx)'],
      setupFiles: ['<rootDir>/spec/jest.setup.js'],
      moduleNameMapper: {
        '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/spec/__mocks__/fileMock.js',
        'embla-carousel-react': '<rootDir>/spec/__mocks__/embla-carousel-react.js',
      },
    },
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['**/**/*.server.test.(js|jsx)'],
      moduleNameMapper: {
        '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/spec/__mocks__/fileMock.js',
        'embla-carousel-react': '<rootDir>/spec/__mocks__/embla-carousel-react.js',
      },
    },
  ],
};
