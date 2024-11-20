/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { runCommand } from "./docker"

export function saveState(): Cypress.Chainable<string> {
	const snapshot = Math.random().toString(36).substring(7)

	// DB
	runCommand(`cp /var/www/html/data/owncloud.db /var/www/html/data/owncloud.db-${snapshot}`)

	// Data
	runCommand(`rm /var/www/html/data/data-${snapshot}.tar`, { failOnNonZeroExit: false })
	runCommand(`tar cf /var/www/html/data/data-${snapshot}.tar .`)

	cy.log(`Created snapshot ${snapshot}`)

	return cy.wrap(snapshot)
}

export function restoreState(snapshot: string = 'init') {
	// DB
	runCommand(`cp /var/www/html/data/owncloud.db-${snapshot} /var/www/html/data/owncloud.db`)

	// Data
	runCommand(`rm -vfr $(tar --exclude='*/*' -tf '/var/www/html/data/data-${snapshot}.tar')`)
	runCommand(`tar -xf '/var/www/html/data/data-${snapshot}.tar'`)

	cy.log(`Restored snapshot ${snapshot}`)
}
