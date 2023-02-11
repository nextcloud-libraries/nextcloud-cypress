/**
 * @copyright Copyright (c) 2022 John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @author John Molakvoæ <skjnldsv@protonmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import { User } from '../../dist'

describe('Login and logout', function() {
	before(() => cy.logout())

	it('Login and see the default files list', function() {
		cy.visit('/apps/files')
		cy.url().should('include', '/login')

		const user = new User('admin', 'admin')
		cy.login(user)

		cy.visit('/apps/files')
		cy.url().should('include', '/apps/files')

		cy.window().then(window => {
			expect(window?.OC?.currentUser).to.eq(user.userId)
		})
	})

	it('Login with a different user without logging out', function() {
		cy.createRandomUser().then((user) => {
			cy.login(user)

			cy.visit('/apps/files')
			cy.url().should('include', '/apps/files')

			cy.window().then(window => {
				expect(window?.OC?.currentUser).to.eq(user.userId)
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
