/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import { Config } from 'jest';

const config: Config = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: 'src',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': '@swc/jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'.interface.ts',
		'-interface.ts',
		'shared/testing',
		'shared-module/testing',
		'validator-rules.ts',
		'-fixture.ts',
		'.input.ts',
		'.d.ts',
	],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./core/shared/infra/testing/expect-helpers.ts'],
	coverageProvider: 'v8',
	clearMocks: true,
  moduleNameMapper: {
    "^@core/(.*)$": "<rootDir>/core/$1"
  }
};

export default config;
