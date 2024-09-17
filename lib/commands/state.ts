/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { basename } from 'path'

const getContainerName = function(): Cypress.Chainable<string> {
	return cy.exec('pwd').then(({ stdout }) => {
		const app = basename(stdout).replace(' ', '')
		return cy.wrap(`nextcloud-cypress-tests_${app}`)
	})
}

export function saveState(): Cypress.Chainable<string> {
	const snapshot = Math.random().toString(36).substring(7)

	getContainerName().then(name => {
		// DB
		cy.exec(`docker exec --user www-data ${name} cp /var/www/html/data/owncloud.db /var/www/html/data/owncloud.db-${snapshot}`)

		// Data
		cy.exec(`docker exec --user www-data rm /var/www/html/data/data-${snapshot}.tar`, { failOnNonZeroExit: false })
		cy.exec(`docker exec --user www-data --workdir /var/www/html/data ${name} tar cf /var/www/html/data/data-${snapshot}.tar .`)
	})

	cy.log(`Created snapshot ${snapshot}`)

	return cy.wrap(snapshot)
}

export function restoreState(snapshot: string = 'init') {
	getContainerName().then(name => {
		// DB
		cy.exec(`docker exec --user www-data ${name} cp /var/www/html/data/owncloud.db-${snapshot} /var/www/html/data/owncloud.db`)

		// Data
		cy.exec(`docker exec --user www-data --workdir /var/www/html/data ${name} rm -vfr $(tar --exclude='*/*' -tf '/var/www/html/data/data-${snapshot}.tar')`)
		cy.exec(`docker exec --user www-data --workdir /var/www/html/data ${name} tar -xf '/var/www/html/data/data-${snapshot}.tar'`)
	})

	cy.log(`Restored snapshot ${snapshot}`)
}
