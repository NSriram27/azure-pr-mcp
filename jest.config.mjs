const config = {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
    }],
  },
  testMatch: [
    '**/test/**/*.test.ts',
    '**/__tests__/**/*.ts',
    '**/*.test.ts'
  ],
  testEnvironment: 'node',
  setupFilesAfterEnv: [],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
};

export default config;
