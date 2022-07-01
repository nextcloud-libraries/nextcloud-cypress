const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')

export default {
	input: 'cypress/dockerNode.ts',
	output: {
		file: 'dist/index.js',
		exports: 'auto',
		format: 'cjs',
		sourcemap: true,
	},
	plugins: [
		nodeResolve(),
		typescript({
			compilerOptions: {
				target: 'es5',
			},
		}),
		commonjs(),
	],
}
