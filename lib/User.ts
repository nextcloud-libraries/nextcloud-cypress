/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
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

