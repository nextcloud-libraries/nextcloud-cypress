/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { basename } from 'path'

const getContainerName = function(): Cypress.Chainable<string> {
	return cy.exec('pwd').then(({ stdout }) => {
		const app = basename(stdout).replace(' ', '')
		return cy.wrap(`nextcloud-cypress-tests_${app}`)
	})
}

export const createDBSnapshot = function(snapshot?: string): Cypress.Chainable<string> {
	const hash = new Date().toISOString().replace(/[^0-9]/g, '')
	getContainerName().then(name => {
		cy.exec(`docker exec --user www-data ${name} cp /var/www/html/data/owncloud.db /var/www/html/data/owncloud.db-${snapshot ?? hash}`)
	})
	cy.log(`Created snapshot ${snapshot ?? hash}`)
	return cy.wrap(snapshot ?? hash)
}

export const restoreDBSnapshot = function(snapshot: string = 'init') {
	getContainerName().then(name => {
		cy.exec(`docker exec --user www-data ${name} cp /var/www/html/data/owncloud.db-${snapshot} /var/www/html/data/owncloud.db`)
	})
	cy.log(`Restored snapshot ${snapshot}`)
}
