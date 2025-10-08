/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { User } from '../../dist/cypress'

describe('Login and logout', function() {
	it('Login and see the default files list', function() {
		cy.visit('/apps/files')
		cy.url().should('include', '/login')

		const user = new User('admin', 'admin')
		cy.login(user)

		cy.visit('/apps/files')
		cy.url().should('include', '/apps/files')

		cy.window().then(window => {
			expect((window as any).OC?.currentUser).to.eq(user.userId)
		})
	})

	it('Login with a pre-existing user and logout', function() {
		cy.login(new User('test1', 'test1'))

		cy.visit('/apps/files')
		cy.url().should('include', '/apps/files')

		cy.window().then(window => {
			expect((window as any).OC?.currentUser).to.eq('test1')
		})

		cy.logout()

		cy.visit('/apps/files')
		cy.url().should('include', '/login')
	})

	it('Login with a different user without logging out', function() {
		cy.createRandomUser().then((user) => {
			cy.login(user)

			cy.visit('/apps/files')
			cy.url().should('include', '/apps/files')

			cy.window().then(window => {
				expect((window as any).OC?.currentUser).to.eq(user.userId)
			})
		})
	})

	it('Logout and see the login page', function() {
		cy.url().should('include', '/apps/files')

		cy.logout()

		cy.visit('/apps/files')
		cy.url().should('include', '/login')
	})
})
