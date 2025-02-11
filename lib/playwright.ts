/**
 * SPDX-FileCopyrightText: 2024 Ferdinand Thiessen <opensource@fthiessen.de>
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { User } from './User'
import { addUser } from './docker'
import type { APIRequestContext } from 'playwright'

/**
 * Create a new random user
 * @return The new user
 */
export async function createRandomUser(): Promise<User> {
	const user = User.createRandom()
	await addUser(user)
	return user
}

/**
 * Helper to login on the Nextcloud instance
 * @param request API request object
 * @param user The user to login
 */
export async function login(
	request: APIRequestContext,
	user: User,
) {
	const tokenResponse = await request.get('./csrftoken', {
		failOnStatusCode: true,
	})
	const requesttoken = (await tokenResponse.json()).token

	const loginResponse = await request.post('./login', {
		form: {
			user: user.userId,
			password: user.password,
			requesttoken,
		},
		headers: {
			Origin: tokenResponse.url().replace(/index.php.*/, ''),
		},
		failOnStatusCode: true,
	})

	const response = await request.get('apps/files', {
		failOnStatusCode: true,
	})
}
