/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

import packageJSON from './package.json' assert { type: 'json' }

const external = [
	...Object.keys(packageJSON.dependencies),
	...Object.keys(packageJSON.peerDependencies ?? {})
]

const config = (input, output) => ({
	input,
	external,
	plugins: [
		nodeResolve(),
		typescript({ declaration: input === './lib/index.ts' }),
		commonjs(),
	],
	output: [output],
})

export default [
	config('./lib/index.ts', {
		file: 'dist/index.js',
		format: 'esm',
		sourcemap: true,
	}),
	config('./lib/index.ts', {
		file: 'dist/index.cjs',
		format: 'cjs',
		sourcemap: true,
	}),

	// Individual commands
	config('./lib/commands/index.ts', {
		file: 'dist/commands/index.js',
		format: 'esm',
		sourcemap: true,
	}),
	config('./lib/commands/index.ts', {
		file: 'dist/commands/index.cjs',
		format: 'cjs',
		sourcemap: true,
	}),

	// Individual selectors
	config('./lib/selectors/index.ts', {
		file: 'dist/selectors/index.js',
		format: 'esm',
		sourcemap: true,
	}),
	config('./lib/selectors/index.ts', {
		file: 'dist/selectors/index.cjs',
		format: 'cjs',
		sourcemap: true,
	}),

	// Docker tooling for the test server
	config('./lib/docker.ts', {
		file: 'dist/docker.mjs',
		format: 'esm',
	}),
	config('./lib/docker.ts', {
		file: 'dist/docker.js',
		format: 'cjs',
	}),

	// Cypress commands and utils
	config('./lib/cypress.ts', {
		file: 'dist/cypress.mjs',
		format: 'esm',
	}),
	config('./lib/cypress.ts', {
		file: 'dist/cypress.js',
		format: 'cjs',
	}),
]
