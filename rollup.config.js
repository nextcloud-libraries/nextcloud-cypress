import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

const external = []

const config = (input, output) => ({
	input,
	external,
	plugins: [
		nodeResolve(),
		typescript({
			compilerOptions: output.format === 'cjs'
				? { target: 'es5' }
				: {},
		}),
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
]
