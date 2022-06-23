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
import { Selector } from "./selectors"

declare global {
	namespace Cypress {
		interface Chainable {
			/**
			 * Get an element from the Nextcloud selector set.
			 * @example cy.getNc(FileList)
			 *          cy.getNc(FileRow, { id: fileInfo.id })
			 */
			 getNc(selector: Selector, args?: Object): Cypress.Chainable<JQuery<HTMLElement>>
		}
	}
}

/**
 * Register all existing commands provided by this library
 * You can manually register those commands by importing them
 * @example import { getNc } from '@nextcloud/cypress'
 *          Cypress.Commands.add('getNc', getNc)
 */
export const addCommands = function() {
	Cypress.Commands.add('getNc', getNc)
}

export * from './commands'
export * from './selectors'
