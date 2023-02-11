# \@nextcloud/cypress [![npm last version](https://img.shields.io/npm/v/@nextcloud/cypress.svg?style=flat-square)](https://www.npmjs.com/package/@nextcloud/cypress) ![Codecov](https://img.shields.io/codecov/c/github/nextcloud/nextcloud-cypress?style=flat-square)

Nextcloud cypress helpers for Nextcloud apps and libraries

## Commands

You can import individual commands or all at once
You can find [the list of all available commands here](https://nextcloud.github.io/nextcloud-cypress/modules/commands.html) 

```js
// cypress/support/commands.js
import { addCommands } from '@nextcloud/cypress'

addCommands()
```

```js
// cypress/support/commands.js
import { getNc } from '@nextcloud/cypress/commands'

Cypress.Commands.add('getNc', getNc)
```

## Selectors

You can find [the list of all available selectors here](https://nextcloud.github.io/nextcloud-cypress/modules/selectors.html) 

```js
import { UploadPicker as UploadPickerComponent} from '../../dist/index.js'
import { UploadPicker, UploadPickerInput } from '@nextcloud/cypress/selectors'

describe('UploadPicker rendering', () => {
	it('Renders default UploadPicker', () => {
		cy.mount(UploadPickerComponent)
		cy.getNc(UploadPicker).should('exist')
			.should('have.class', 'upload-picker')
		cy.getNc(UploadPickerInput).should('exist')
	})
})
```

## Starting Nextcloud Docker container

It is possible to automatically start a docker container providing a Nextcloud instance for testing.
Therefor adjust your `cypress.config.ts` (or `.js`):

```js
import { configureNextcloud,  startNextcloud,  stopNextcloud, waitOnNextcloud } from '@nextcloud/cypress/docker'

export default defineConfig({
// ...
	e2e: {
		// other configuration

		setupNodeEvents(on, config) {
			// Remove container after run
			on('after:run', () => {
				stopNextcloud()
			})

			// starting Nextcloud testing container with specified server branch
			return startNextcloud(process.env.BRANCH)
				.then((ip) => {
					// Setting container's IP as base Url
					config.baseUrl = `http://${ip}/index.php`
					return ip
				})
				.then(waitOnNextcloud)
				// configure Nextcloud, also install and enable the `viewer` app
				.then(() => configureNextcloud(['viewer']))
				.then(() => {
					return config
				})
		},
	},
})
```
