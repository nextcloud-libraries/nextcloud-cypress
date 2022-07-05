import * as waitOn from 'wait-on'
import { startNextcloud } from './dockerNode'

// Would be simpler to start the container from cypress.config.ts,
// but when checking out different branches, it can take a few seconds
// Until we can properly configure the baseUrl retry intervals, 
// We need to make sure the server is already running before cypress
// https://github.com/cypress-io/cypress/issues/22676
const waitOnNextcloud = async function(ip: string) {
	console.log('> Waiting for Nextcloud to be ready',)
	await waitOn({ resources: [`http://${ip}/index.php`] })
}

// If used via cli
startNextcloud(process.env.BRANCH)
	.then(async ip => await waitOnNextcloud(ip))
