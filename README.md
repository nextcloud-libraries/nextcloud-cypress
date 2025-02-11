<!--
  - SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
# \@nextcloud/e2e-test-server

[![REUSE status](https://api.reuse.software/badge/github.com/nextcloud-libraries/nextcloud-cypress)](https://api.reuse.software/info/github.com/nextcloud-libraries/nextcloud-cypress) [![npm last version](https://img.shields.io/npm/v/@nextcloud/e2e-test-server.svg?style=flat-square)](https://www.npmjs.com/package/@nextcloud/e2e-test-server) ![Codecov](https://img.shields.io/codecov/c/github/nextcloud/nextcloud-cypress?style=flat-square)

Nextcloud e2e test server and utils for cypress and playwright.

Automatically start a docker container providing a Nextcloud instance for testing.

## Status

This package is currently work in progress and will change significantly until version 1.0.
In particular cypress specific utils such as selectors will be dropped unless they are widely used.

## Starting Nextcloud Docker container

### Playwright

1. Copy `playwright.config.mjs` and `playwright` folder from this repository!
2. Add the `@playwright/test` dependency:
  ```
    npm install --save-dev '@playwright/test'
  ```
3. Add the `start:nextcloud` script to your package.json
  ```json
    {
      "start:nextcloud": "node playwright/start-nextcloud-server.mjs",
    }
  ```
4. Install chromium for playwright:
  ```
    npx playwright install chromium --only-shell
  ```
5. Run playwright tests:
  ```
    npx playwright test
  ```
6. Add `.github/workflows/playwright.yml` to your repository!
7. Write your own tests!



### Cypress

You can use the `cypress` folder and the `cypress.config.ts` in this repository as starting points or adjust your `cypress.config.ts` (or `.js`):

```js
import { configureNextcloud,  startNextcloud,  stopNextcloud, waitOnNextcloud } from '@nextcloud/e2e-test-server'

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

## Cypress commands

You can import individual commands or all at once
You can find [the list of all available commands here](https://nextcloud.github.io/nextcloud-cypress/modules/commands.html) 

```js
// cypress/support/commands.js
import { addCommands } from '@nextcloud/e2e-test-server/cypress'

addCommands()
```

```js
// cypress/support/commands.js
import { login } from '@nextcloud/e2e-test-server/commands'

Cypress.Commands.add('login', login)
```

## Selectors (:warn: deprecated)

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
