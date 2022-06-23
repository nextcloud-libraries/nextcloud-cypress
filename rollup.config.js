import { nodeResolve } from '@rollup/plugin-node-resolve'
import clean from '@rollup-extras/plugin-clean';
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

const external = []

const config = output => ({
	input: './lib/index.ts',
	external,
	plugins: [
		nodeResolve(),
		typescript({
			compilerOptions: output.format === 'cjs'
				? { target: 'es5' }
				: {},
		}),
		commonjs(),
		clean(),
	],
	output: [output],
})

export default [
	config({
		file: 'dist/index.js',
		format: 'cjs',
		sourcemap: true,
	}),
	config({
		file: 'dist/index.esm.js',
		format: 'esm',
		sourcemap: true,
	}),
]
