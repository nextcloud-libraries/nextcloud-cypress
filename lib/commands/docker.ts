/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { basename } from '@nextcloud/paths'

function getContainerName(): Cypress.Chainable<string> {
	return cy.exec('pwd').then(({ stdout }) => {
		const name = basename(stdout).replace(' ', '')
		return cy.wrap(`nextcloud-e2e-test-server_${name}`)
	})
}

export function runCommand(command: string, options?: Partial<Cypress.ExecOptions>) {
	const env = Object.entries(options?.env ?? {})
		.map(([name, value]) => `-e '${name}=${value}'`)
		.join(' ')

	getContainerName()
		.then((containerName) => {
			// Wrapping command inside bash -c "..." to allow using '*'.
			return cy.exec(`docker exec --user www-data --workdir /var/www/html ${env} ${containerName} bash -c "${command}"`, options)
		})

}
