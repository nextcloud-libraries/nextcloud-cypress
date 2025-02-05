/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
// Making sure we're forcing the development mode
process.env.NODE_ENV = 'development'
process.env.npm_package_name = 'nextcloud-e2e-test-server'

/* eslint-disable import/first */
import { configureNextcloud, createSnapshot, setupUsers, startNextcloud, stopNextcloud, waitOnNextcloud } from './lib/docker'
import { defineConfig } from 'cypress'
import CodeCoverage from '@cypress/code-coverage/task'
import webpackConfig from '@nextcloud/webpack-vue-config'
import webpackRules from '@nextcloud/webpack-vue-config/rules'
/* eslint-enable import/first */

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
delete (webpackConfig as any).entry
delete (webpackConfig as any).output
webpackConfig.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', '.cjs', '.vue']

export default defineConfig({
	projectId: 'h2z7r3',

	// Needed to trigger `after:run` events with cypress open
	experimentalInteractiveRunEvents: true,

	// faster video processing
	videoCompression: false,

	e2e: {
		// Disable session isolation
		testIsolation: false,

		setupNodeEvents(on, config) {
			CodeCoverage(on, config)

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
				.then(waitOnNextcloud as (ip: string) => Promise<undefined>) // void !== undefined for Typescript
				.then(configureNextcloud as () => Promise<undefined>)
				.then(setupUsers as () => Promise<undefined>)
				.then(() => createSnapshot('init'))
				.then(() => {
					return config
				})
		},
	},

	component: {
		setupNodeEvents(on, config) {
			CodeCoverage(on, config)

			return config
		},
		devServer: {
			framework: 'vue',
			bundler: 'webpack',
			webpackConfig,
		},
	},
})
