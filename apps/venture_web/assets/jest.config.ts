/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  modulePaths: ["<rootDir>/../../../deps", "<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": [
      "esbuild-jest",
      {
        sourcemap: "inline"
      }
    ]
  }
};
