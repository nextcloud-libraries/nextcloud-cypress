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
import { getNc } from "./commands"
import { login, logout } from "./commands/sessions"
import { User, createRandomUser, createUser, deleteUser, modifyUser, listUsers, getUserData, enableUser } from "./commands/users"
import type { Selector } from "./selectors"

declare global {
	namespace Cypress {
		interface Chainable {
			/**
			 * Get an element from the Nextcloud selector set.
			 * @example cy.getNc(FileList)
			 *          cy.getNc(FileRow, { id: fileInfo.id })
			 */
			getNc(selector: Selector, args?: Object): Cypress.Chainable<JQuery<HTMLElement>>

			/**
			 * Login on a Nextcloud instance
			 */
			login(user: User): void

			/**
			 * Logout from a Nextcloud instance
			 */
			logout(): void

			/**
			 * Create a random user on the Nextcloud instance
			 *
			 * **Warning**: Using this function will reset the previous session
			 */
			createRandomUser(): Cypress.Chainable<User>

			/**
			 * Create a user on the Nextcloud instance
			 *
			 * **Warning**: Using this function will reset the previous session
			 */
			createUser(user: User): Cypress.Chainable<Cypress.Response<any>>

			/**
			 * Delete a user on the Nextcloud instance
			 *
			 * **Warning**: Using this function will reset the previous session
			 */
			deleteUser(user: User): Cypress.Chainable<Cypress.Response<any>>

			/**
			 * Query list of users on the Nextcloud instance
			 *
			 * **Warning**: Using this function will reset the previous session
			 * 
			 * @param details Set to true to fetch users with detailed information (default false)
			 * @return List of user IDs or list of Users (if details was set to true)
			 */
			listUsers<b extends boolean>(details?: b): Cypress.Chainable<b extends true ? Record<string, string>[] : string[]>
			listUsers(details?: boolean): Cypress.Chainable<Record<string,string>[] | string[]>

			/**
			 * Modify an attribute of a given user on the Nextcloud instance
			 *
			 * @param user User who modifies their metadata
 			 * @param key Attribute name
 			 * @param value New attribute value
			 */
			modifyUser(user: User, key: string, value: any): Cypress.Chainable<Cypress.Response<any>>

			/**
			 * Enable or disable a given user
			 * 
			 * @param user user whom to enable or disable
			 * @param enable True to enable, false to disable (default is enable)
			 */
			enableUser(user: User, enable?: boolean): Cypress.Chainable<Cypress.Response<any>>
			/**
			 * 
			 * Query metadata for, and in behalf, of a given user
			 *
			 * @param user User whom metadata to query
			 */
			 getUserData(user: User): Cypress.Chainable<Cypress.Response<any>>
		}
	}
}

/**
 * Register all existing commands provided by this library
 *
 * You can also manually register those commands by importing them
 * @example import { getNc } from '@nextcloud/cypress/commands'
 *          Cypress.Commands.add('getNc', getNc)
 */
export const addCommands = function() {
	Cypress.Commands.add('getNc', getNc)
	Cypress.Commands.add('login', login)
	Cypress.Commands.add('logout', logout)
	Cypress.Commands.add('createRandomUser', createRandomUser)
	Cypress.Commands.add('createUser', createUser)
	Cypress.Commands.add('deleteUser', deleteUser)
	Cypress.Commands.add('listUsers', listUsers)
	Cypress.Commands.add('modifyUser', modifyUser)
	Cypress.Commands.add('enableUser', enableUser)
	Cypress.Commands.add('getUserData', getUserData)
}

export { User }
