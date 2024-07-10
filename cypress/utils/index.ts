/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export const randHash = (): string => Math.random().toString(36).replace(/[^a-z]+/g, '').slice(0, 10)
