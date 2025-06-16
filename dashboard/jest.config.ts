import type { Config } from 'jest';
import nextJest from 'next/jest.js'

// Add any custom config to be passed to Jest
const customJestConfig: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!(tailrix)/)'],
  transform: {
    '^.+\.tsx?$': ['ts-jest', { useESM: true, diagnostics: { ignoreCodes: ['TS151001'] } }], // Added ignoreCodes for ESM/CJS interop issues with ts-jest
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
const createJestConfig = nextJest({
  dir: './',
})

export default createJestConfig(customJestConfig);
