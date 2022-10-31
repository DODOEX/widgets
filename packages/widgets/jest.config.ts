export default {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', '.*\\.d\\.ts$', 'spec.ts'],
  transform: {
    '^.+\\.svg$': 'svg-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        tsconfig: 'tsconfig-jest.json',
      },
    ],
  },
  preset: 'ts-jest',
  testTimeout: 20000,
  setupFiles: ['<rootDir>/e2e/setup.ts'],
};
