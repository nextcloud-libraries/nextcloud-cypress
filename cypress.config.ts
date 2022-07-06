// Making sure we're forcing the development mode
process.env.NODE_ENV = 'development'

import { configureNextcloud,  getContainerIP,  stopNextcloud } from './cypress/dockerNode'
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

// Cypress handle its own output
delete webpackConfig.output
webpackConfig.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', '.cjs', '.vue']

export default defineConfig({
	projectId: 'h2z7r3',

	// Needed to trigger `before:run` events with cypress open
	experimentalInteractiveRunEvents: true,

	e2e: {
		async setupNodeEvents(on, config) {
			await getContainerIP().then((ip) => {
				// Setting container's IP as base Url
				config.baseUrl = `http://${ip}/index.php`
			})

			// Configure Nextcloud when ready
			on('before:run', async () => {
				configureNextcloud()
			})

			// Remove container after run
			on('after:run', () => {
				stopNextcloud()
			})

			return config
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
