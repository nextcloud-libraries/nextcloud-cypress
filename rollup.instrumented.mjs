/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import config from './rollup.config.mjs'
import istanbul from 'rollup-plugin-istanbul'

config.map(c => c.plugins.push(istanbul()))

export default config
