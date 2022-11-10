// Making sure we're forcing the development mode
process.env.NODE_ENV = 'development'
process.env.npm_package_name = 'nextcloud-cypress'

import { configureNextcloud,  startNextcloud,  stopNextcloud, waitOnNextcloud } from './cypress/dockerNode'
import { defineConfig } from 'cypress'
import webpackConfig from '@nextcloud/webpack-vue-config'
import webpackRules from '@nextcloud/webpack-vue-config/rules'

webpackRules.RULE_TS = {
	test: /\.ts$/,
	use: [{
		loader: 'ts-loader',
		options: {
			// skip typechecking for speed
			transpileOnly: true,
		},
	}],
}
webpackConfig.module.rules = Object.values(webpackRules)

// Cypress handle its own entry and output
delete webpackConfig.entry
delete webpackConfig.output
webpackConfig.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', '.cjs', '.vue']

export default defineConfig({
	projectId: 'h2z7r3',

	// Needed to trigger `after:run` events with cypress open
	experimentalInteractiveRunEvents: true,

	// faster video processing
	videoCompression: false,

	e2e: {
		// Enable session management and disable isolation
		experimentalSessionAndOrigin: true,
		testIsolation: 'off',

		setupNodeEvents(on, config) {
			// Remove container after run
			on('after:run', () => {
				stopNextcloud()
			})

			// Before the browser launches
			// starting Nextcloud testing container
			return startNextcloud(process.env.BRANCH)
				.then((ip) => {
					// Setting container's IP as base Url
					config.baseUrl = `http://${ip}/index.php`
					return ip
				})
				.then(waitOnNextcloud)
				.then(configureNextcloud)
				.then(() => {
					return config
				})
		},
	},

	component: {
		devServer: {
			framework: 'vue',
			bundler: 'webpack',
			webpackConfig,
		},
	},
})
