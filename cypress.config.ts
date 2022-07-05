import { defineConfig } from 'cypress'
import { configureNextcloud, getContainerIP, stopNextcloud } from './cypress/dockerNode'

export default defineConfig({
	projectId: 'h2z7r3',
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

	// Needed to trigger `before:run` events with cypress open
	experimentalInteractiveRunEvents: true,
})
