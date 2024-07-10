/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Selector } from "../selectors"

export const getNc = function(selector: Selector, args: Object = {}): Cypress.Chainable<JQuery<HTMLElement>> {
	if (typeof selector !== 'function') {
		console.error(selector)
		throw new Error('Invalid selector')
	}
	return selector(args)
}
