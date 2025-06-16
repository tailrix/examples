import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // No specific transformIgnorePatterns for tailrix needed if mocking.
  // Let next/jest use its defaults.
};

export default createJestConfig(customJestConfig);
