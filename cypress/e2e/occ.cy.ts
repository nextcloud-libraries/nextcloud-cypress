/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

describe('Run occ command', function() {
	it('yields the output as stdout', function() {
		cy.runOccCommand('app:list')
			.its('stdout')
			.should('contain', 'Enabled:')
			.should('contain', 'files:')
			.should('contain', 'settings:')
	})
})
