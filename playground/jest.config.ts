import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!(tailrix|tailrix_api_client)/)'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
    '^.+\\.jsx?$': 'babel-jest', // Ensure babel-jest is correctly referenced
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};

export default config;
