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

beforeEach(() => cy.logout())

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

describe('List users and delete user', () => {
	const hash = 'user' + randHash()
	it(`Create '${hash}' user and delete them`, () => {
		const user = new User(hash, 'password')
		cy.createUser(user).then(() => {
			cy.login(user)
			cy.listUsers().then(users => {
				expect(users).to.contain(user.userId)
			})
		})

		cy.deleteUser(user).then(() => {
			cy.listUsers().then(users => {
				expect(users).to.not.contain(user.userId)
			})
		})
	})

	it('Fail deleting non existing user', () => {
		const hash = 'nouser' + randHash()
		const user = new User(hash, 'password')

		cy.deleteUser(user).then((response) => {
			cy.wrap(response).its('status').should('eq', 404)
		})
	})
})

describe('Write and read user metadata', () => {
	const hash = 'user' + randHash()
	it(`Create '${hash}' user and write user data`, () => {
		const user = new User(hash, 'password')
		cy.createUser(user).then(() => {
			cy.login(user)
		})

		cy.modifyUser(user, 'displayname', 'John Doe')
		cy.getUserData(user).then(response => {
			const parser = new DOMParser()
			const xmlDoc = parser.parseFromString(response.body, 'text/xml')
			expect(xmlDoc.querySelector('data displayname')?.textContent).to.eq('John Doe')
		})
	})
})

describe('Enable and disable users', () => {
	const hash = 'user' + randHash()
	let user = new User(hash, 'password')

	beforeEach(() => cy.createUser(user))
	afterEach(() => cy.deleteUser(user))

	it('can disable user', () => {
		cy.listUsers(true).then(details => {
			const usersDetails = details.filter(v => v.id === user.userId)
			expect(usersDetails.length).to.eq(1)
			expect(usersDetails[0].enabled).to.eq('1')
		})

		cy.enableUser(user, false).listUsers(true).then(details => {
			const usersDetails = details.filter(v => v.id === user.userId)
			expect(usersDetails.length).to.eq(1)
			expect(usersDetails[0].enabled).to.eq('')
		})
	})

	it('can enable a user', () => {
		cy.enableUser(user, false).listUsers(true).then(details => {
			const usersDetails = details.filter(v => v.id === user.userId)
			expect(usersDetails.length).to.eq(1)
			expect(usersDetails[0].enabled).to.eq('')
		})

		cy.enableUser(user).listUsers(true).then(details => {
			const usersDetails = details.filter(v => v.id === user.userId)
			expect(usersDetails.length).to.eq(1)
			expect(usersDetails[0].enabled).to.eq('1')
		})
	})
})
