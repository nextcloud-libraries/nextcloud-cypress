/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { User } from "../User"

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
export function listUsers<b extends boolean>(details?: b): Cypress.Chainable<b extends true ? Record<string, string>[] : string[]>;
export function listUsers(details = false): Cypress.Chainable<Record<string, string>[] | string[]> {
	const url = `${Cypress.config('baseUrl')}/ocs/v2.php/cloud/users${details ? '/details' : ''}`.replace('index.php/', '')

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

		if (!details) {
			const users = Array.from(xmlDoc.querySelectorAll('users element')).map(v => v.textContent)
			return users.filter(v => typeof v === 'string') as string[]
		} else {
			const list = Array.from(xmlDoc.querySelectorAll('users > *')).map(v => {
				//  We only handle simple text properties for the moment
				const properties = Array.from(v.childNodes).filter(c => c.childNodes.length <= 1)

				return Object.fromEntries(properties.map(p => [p.nodeName, p.textContent || '']))
			})
			return list as Record<string, string>[]
		}
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
 *
 * @param user User to change
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

/**
 * Enable or disable a user
 *
 * @param {User} user the user to dis- / enable
 * @param {boolean} enable True if the user should be enable, false to disable
 */
export const enableUser = function(user: User, enable = true): Cypress.Chainable<Cypress.Response<any>> {
	const url = `${Cypress.config('baseUrl')}/ocs/v2.php/cloud/users/${user.userId}/${enable ? 'enable' : 'disable'}`.replace('index.php/', '')

	return cy.request({
		method: 'PUT',
		url,
		form: true,
		auth: {
			user: 'admin',
			password: 'admin',
		},
		headers: {
			'OCS-ApiRequest': 'true',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}).then((response) => {
		cy.log(`Enabled user ${user}`, response.status)
		return cy.wrap(response)
	})
}
