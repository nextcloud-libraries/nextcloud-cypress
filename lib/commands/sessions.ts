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

export const login = function(user: string, password: string, route: string = '/apps/files') {
	cy.clearCookies()
	Cypress.Cookies.defaults({
		preserve: /^(oc|nc)/,
	})
	cy.visit(route)
	cy.get('input[name=user]').type(user)
	cy.get('input[name=password]').type(password)
	cy.get('form[name=login] input[type=submit]').click()
	cy.url().should('include', route)
}

export const logout = function() {
	cy.document().then(document => {
		const tokenElement = document.getElementsByTagName('head')[0]
		const token = tokenElement.getAttribute('data-requesttoken') || ''

		cy.visit(`/logout?requesttoken=${encodeURIComponent(token)}`)
		cy.url().should('include', '/login')
	})
}
