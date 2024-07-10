/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * A Selector is a function that returns a cypress get or find chain.
 * You can pass an object to use its data and narrow down
 * tests against the various elements.
 */
export interface Selector {
	(args?: Object): Cypress.Chainable<JQuery>
}

export * from './uploadPicker'
