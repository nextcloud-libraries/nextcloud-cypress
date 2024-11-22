/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { runCommand } from "./docker"

export function saveState(): Cypress.Chainable<string> {
	const snapshot = Math.random().toString(36).substring(7)

	runCommand(`rm /var/www/html/data-${snapshot}.tar`, { failOnNonZeroExit: false })
	runCommand(`tar cf /var/www/html/data-${snapshot}.tar ./data`)

	cy.log(`Created snapshot ${snapshot}`)

	return cy.wrap(snapshot)
}

export function restoreState(snapshot: string = 'init') {
	runCommand(`rm -vfr ./data/*`)
	runCommand(`tar -xf '/var/www/html/data-${snapshot}.tar'`)

	cy.log(`Restored snapshot ${snapshot}`)
}
