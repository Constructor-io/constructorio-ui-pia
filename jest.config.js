// jest.config.js
const commonConfig = {
  collectCoverageFrom: ['src/(components|hooks)/**/*.[jt]s?(x)'],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};

module.exports = {
  projects: [
    {
      ...commonConfig,
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
      ...commonConfig,
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
