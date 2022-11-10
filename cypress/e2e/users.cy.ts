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
import { randHash } from '../utils'


describe('Create user and login', function() {
	it('Create random user and log in', function() {
		cy.createRandomUser().then(user => {
			cy.login(user)
		})

		cy.visit('/apps/files')
		cy.url().should('include', '/apps/files')
	})

	const hash = 'user' + randHash()
	it(`Create '${hash}' user and log in`, function() {
		const user = new User(hash, 'password')
		cy.createUser(user).then(() => {
			cy.login(user)
		})

		cy.visit('/apps/files')
		cy.url().should('include', '/apps/files')
	})

	it('Fail creating an existing user', function() {
		const user = new User('admin', 'password')
		cy.createUser(user).then(response => {
			cy.wrap(response).its('status').should('eq', 400)
			cy.wrap(response).its('body.ocs.meta.message').should('eq', 'User already exists')
		})
	})
})
