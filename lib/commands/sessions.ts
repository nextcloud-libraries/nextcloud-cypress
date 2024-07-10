/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
