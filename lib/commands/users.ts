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
 *
 * **Warning**: Using this function will reset the previous session
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

/**
 * Query list of users on the Nextcloud instance
 *
 * **Warning**: Using this function will reset the previous session
 * @returns list of user IDs
 */
export const listUsers = function(): Cypress.Chainable<string[]> {
	const url = `${Cypress.config('baseUrl')}/ocs/v2.php/cloud/users`.replace('index.php/', '')

	cy.clearCookies()
	return cy.request({
		method: 'GET',
		url,
		auth: {
			user: 'admin',
			pass: 'admin'
		},
		headers: {
			'OCS-ApiRequest': 'true',
		},
	}).then((response) => {
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(response.body, "text/xml");
		const users = Array.from(xmlDoc.querySelectorAll('users element')).map(v => v.textContent)

		return cy.wrap(users.filter(v => typeof v === 'string') as string[])
	})
}

/**
 * Delete an user on the Nextcloud instance
 *
 * **Warning**: Using this function will reset the previous session
 * @param user User to delete
 */
export const deleteUser = function(user: User): Cypress.Chainable<Cypress.Response<any>> {
	const url = `${Cypress.config('baseUrl')}/ocs/v2.php/cloud/users/${user.userId}`.replace('index.php/', '')

	cy.clearCookies()
	return cy.request({
		method: 'DELETE',
		url,
		form: true,
		auth: {
			user: 'admin',
			pass: 'admin'
		},
		headers: {
			'OCS-ApiRequest': 'true',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		failOnStatusCode: false,
	}).then((response) => {
		cy.log(`Deleted user ${user}`, response.status)
		cy.clearCookies()
		return cy.wrap(response)
	})
}

/**
 * Modify an attribute of a given user on the Nextcloud instance
 *
 * @param user User who performs the modification
 * @param key Attribute name
 * @param value New attribute value
 */
export const modifyUser = function(user: User, key: string, value: any): Cypress.Chainable<Cypress.Response<any>> {
	const url = `${Cypress.config('baseUrl')}/ocs/v2.php/cloud/users/${user.userId}`.replace('index.php/', '')

	return cy.request({
		method: 'PUT',
		url,
		form: true,
		body: {
			key,
			value
		},
		auth: {
			user: user.userId,
			password: user.password
		},
		headers: {
			'OCS-ApiRequest': 'true',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}).then((response) => {
		cy.log(`Updated user ${user} ${key} to ${value}`, response.status)
		return cy.wrap(response)
	})
}

/**
 * Query metadata for and in behalf of a given user
 */
export const getUserData = function(user: User): Cypress.Chainable<Cypress.Response<any>> {
	const url = `${Cypress.config('baseUrl')}/ocs/v2.php/cloud/users/${user.userId}`.replace('index.php/', '')

	return cy.request({
		method: 'GET',
		url,
		auth: {
			user: user.userId,
			pass: user.password
		},
		headers: {
			'OCS-ApiRequest': 'true',
		},
	}).then((response) => {
		cy.log(`Loaded metadata for user ${user}`, response.status)

		return cy.wrap(response)
	})
}