/**
 * @copyright Copyright (c) 2022 John Molakvoæ <skjnldsv@protonmail.com>
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import waitOn from 'wait-on'
import { startNextcloud } from './dockerNode'

// Would be simpler to start the container from cypress.config.ts,
// but when checking out different branches, it can take a few seconds
// Until we can properly configure the baseUrl retry intervals, 
// We need to make sure the server is already running before cypress
// https://github.com/cypress-io/cypress/issues/22676
const waitOnNextcloud = async function(ip: string) {
	console.log('> Waiting for Nextcloud to be ready',)
	await waitOn({ resources: [`http://${ip}/index.php`] })
}

// If used via cli
startNextcloud(process.env.BRANCH)
	.then(async ip => await waitOnNextcloud(ip))
