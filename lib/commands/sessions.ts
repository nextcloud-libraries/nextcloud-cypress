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

import type { User } from "./users"

/**
 * You should always upload files and/or create users
 * before login, so that the cookies are NOT YET defined.
 * 
 * @see https://docs.cypress.io/api/commands/session
 */
export const login = function(user: User) {
	cy.session(user, function() {
		cy.request('/csrftoken').then(({ body }) => {
			const requestToken = body.token
			cy.request({
				method: 'POST',
				url: '/login',
				body: { 
					user: user.userId, 
					password: user.password, 
					requesttoken: requestToken
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				followRedirect: false,
			})
		})
	}, {
		validate() {
			cy.request('/apps/files').its('status').should('eq', 200)
		},
	})
}

/**
 * Theoretically, should rarely be needed as we
 * are either login in with another user, which
 * change the active session, or changing specs
 * which reset active sessions too
 *
 * @see https://docs.cypress.io/api/commands/session#Session-caching
 */
export const logout = function() {
	cy.request('/csrftoken').then(({ body }) => {
		const requestToken = body.token
		cy.visit(`/logout?requesttoken=${encodeURIComponent(requestToken)}`)
	})
	cy.clearCookies()
}
