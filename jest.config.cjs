/** @type {import("jest").Config} */
const tsJestTransform = [
  "ts-jest",
  {
    tsconfig: "<rootDir>/tsconfig.jest.json",
  },
];

module.exports = {
  testEnvironment: "node",
  projects: [
    {
      displayName: "unit",
      testMatch: ["<rootDir>/src/**/*.unit.test.ts"],
      transform: {
        "^.+\\.tsx?$": tsJestTransform,
      },
    },
    {
      displayName: "e2e",
      testMatch: ["<rootDir>/src/**/*.e2e.test.ts"],
      transform: {
        "^.+\\.tsx?$": tsJestTransform,
      },
    },
  ],
};
