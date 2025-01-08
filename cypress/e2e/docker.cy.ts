/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

describe('Run command', function() {

	it('yields the output as stdout', function() {
		cy.runCommand('ls')
			.its('stdout')
			.should('contain', 'data')
	})

	it('hands on the env', function() {
		cy.runCommand('env', { env: { DATA: 'Hello' } })
			.its('stdout')
			.should('contain', 'DATA')
			.should('contain', 'Hello')
	})

})
