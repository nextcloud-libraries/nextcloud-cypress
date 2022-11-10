/**
 * @copyright 2022 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

 export class User {
	userId: string
	password: string
	language: string

	constructor(user: string, password: string = user, language = 'en') {
		this.userId = user
		this.password = password
		this.language = language
	}
}

export const randHash = () => Math.random().toString(36).replace(/[^a-z]+/g, '').slice(0, 10)

/**
 * Create a random user
 */
export const createRandomUser = function(): Cypress.Chainable<User> {
	const user = new User(randHash())
	cy.log(`Generated user ${user.userId}`)

	createUser(user)
	return cy.wrap(user)
}

/**
 * Create a user
 */
export const createUser = function(user: User): Cypress.Chainable<Cypress.Response<any>> {
	const url = `${Cypress.config('baseUrl')}/ocs/v2.php/cloud/users?format=json`.replace('index.php/', '')

	cy.clearCookies()
	return cy.request({
		method: 'POST',
		url,
		body: { 
			userid: user.userId, 
			password: user.password
		},
		auth: {
			user: 'admin',
			pass: 'admin'
		},
		headers: {
			'OCS-ApiRequest': 'true',
		},
		followRedirect: false,
		// Allow us to test
		failOnStatusCode: false,
	}).then((response) => {
		cy.log(`Created user ${user.userId}`)

		// Avoid that any follow up request reuses the admin cookies
		cy.clearCookies()

		return cy.wrap(response)
	})
}