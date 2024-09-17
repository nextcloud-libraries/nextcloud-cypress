/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { User } from '../../dist'
import { randHash } from '../utils'

describe('Create a snapshot and a user', function() {
	let snapshot: string

	it('Create a snapshot', function() {
		cy.saveState().then(_snapshot => {
			snapshot = _snapshot
		})
	})

	const hash = 'user' + randHash()
	const user = new User(hash, 'password')
	it('Create a user and login', function() {
		cy.createUser(user).then(() => {
			cy.login(user)
		})

		cy.visit('/apps/files')
		cy.url().should('include', '/apps/files')

		cy.listUsers().then(users => {
			expect(users).to.contain(user.userId)
		})
	})

	it('Restore the snapshot', function() {
		cy.restoreState(snapshot)
	})

	it('Fail login with the user', function() {
		cy.visit('/apps/files')
		cy.url().should('include', '/login')

		cy.listUsers().then(users => {
			expect(users).to.not.contain(user.userId)
		})
	})
})
