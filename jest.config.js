/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
module.exports = {
	clearMocks: true,
	collectCoverageFrom: ['lib/**/*.ts'],
	testEnvironment: 'jsdom',
	preset: 'ts-jest/presets/js-with-ts',
	globals: {
		'ts-jest': {
			tsconfig: '__tests__/tsconfig.json',
		},
	},
	transformIgnorePatterns: [
		'node_modules/(?!(abcde|fghij)/)',
	],
}
