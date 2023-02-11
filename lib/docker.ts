/* eslint-disable no-console */
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

import Docker from 'dockerode'
import waitOn from 'wait-on'

import type { Stream } from 'node:stream'
import { join, resolve, sep } from 'path'
import { existsSync, readFileSync } from 'fs'
import { XMLParser } from 'fast-xml-parser'

export const docker = new Docker()

const CONTAINER_NAME = 'nextcloud-cypress-tests'
const SERVER_IMAGE = 'ghcr.io/nextcloud/continuous-integration-shallow-server'

const TEXT_APP_GIT = 'https://github.com/nextcloud/text.git'

/**
 * Start the testing container
 *
 * @param branch server branch to use
 * @param mountApp bind mount app within server (`true` for autodetect, `false` to disable, or a string to force a path)
 * @return Promise resolving to the IP address of the server
 * @throws {Error} If Nextcloud container could not be started
 */
export const startNextcloud = async function(branch = 'master', mountApp: boolean|string = true): Promise<any> {
	let appPath = mountApp === true ? process.cwd() : mountApp
	let appId: string|undefined
	let appVersion: string|undefined
	if (appPath) {
		console.log('Mounting app directory')
		while (appPath) {
			const appInfoPath = resolve(join(appPath, 'appinfo', 'info.xml'))
			if (existsSync(appInfoPath)) {
				const parser = new XMLParser()
				const xmlDoc = parser.parse(readFileSync(appInfoPath))
				appId = xmlDoc.info.id
				appVersion = xmlDoc.info.version
				console.log(`└─ Found ${appId} version ${appVersion}`)
				break
			} else {
				// skip if root is reached or manual directory was set
				if (appPath === sep || typeof mountApp === 'string') {
					console.log('└─ No appinfo found')
					appPath = false
					break
				}
				appPath = join(appPath, '..')
			}
		}
	}

	try {
		// Pulling images
		console.log('Pulling images... ⏳')
		await new Promise((resolve, reject) => docker.pull(SERVER_IMAGE, (_err, stream: Stream) => {
			const onFinished = function(err: Error | null) {
				if (!err) {
					return resolve(true)
				}
				reject(err)
			}
			// https://github.com/apocas/dockerode/issues/357
			docker.modem.followProgress(stream, onFinished)
		}))
		console.log('└─ Done')

		// Getting latest image
		console.log('\nChecking running containers... 🔍')
		const localImage = await docker.listImages({ filters: `{"reference": ["${SERVER_IMAGE}"]}` })

		// Remove old container if exists and not initialized by us
		try {
			const oldContainer = docker.getContainer(CONTAINER_NAME)
			const oldContainerData = await oldContainer.inspect()
			if (oldContainerData.State.Running) {
				console.log('├─ Existing running container found')
				if (localImage[0].Id !== oldContainerData.Image) {
					console.log('└─ But running container is outdated, replacing...')
				} else {
					// Get container's IP
					console.log('├─ Reusing that container')
					const ip = await getContainerIP(oldContainer)
					return ip
				}
			} else {
				console.log('└─ None found!')
			}
			// Forcing any remnants to be removed just in case
			await oldContainer.remove({ force: true })
		} catch (error) {
			console.log('└─ None found!')
		}

		// Starting container
		console.log('\nStarting Nextcloud container... 🚀')
		console.log(`├─ Using branch '${branch}'`)
		const container = await docker.createContainer({
			Image: SERVER_IMAGE,
			name: CONTAINER_NAME,
			Env: [`BRANCH=${branch}`],
			HostConfig: {
				Binds: appPath !== false ? [`${appPath}:/var/www/html/apps/${appId}`] : undefined,
			},
		})
		await container.start()

		// Get container's IP
		const ip = await getContainerIP(container)

		console.log(`├─ Nextcloud container's IP is ${ip} 🌏`)
		return ip
	} catch (err) {
		console.log('└─ Unable to start the container 🛑')
		console.log(err)
		stopNextcloud()
		throw new Error('Unable to start the container')
	}
}

/**
 * Configure Nextcloud
 *
 * @param {string[]} apps List of default apps to install (default is ['viewer'])
 */
export const configureNextcloud = async function(apps = ['viewer']) {
	console.log('\nConfiguring nextcloud...')
	const container = docker.getContainer(CONTAINER_NAME)
	await runExec(container, ['php', 'occ', '--version'], true)

	// Be consistent for screenshots
	await runExec(container, ['php', 'occ', 'config:system:set', 'default_language', '--value', 'en'], true)
	await runExec(container, ['php', 'occ', 'config:system:set', 'force_language', '--value', 'en'], true)
	await runExec(container, ['php', 'occ', 'config:system:set', 'default_locale', '--value', 'en_US'], true)
	await runExec(container, ['php', 'occ', 'config:system:set', 'force_locale', '--value', 'en_US'], true)
	await runExec(container, ['php', 'occ', 'config:system:set', 'enforce_theme', '--value', 'light'], true)

	// Build app list
	const json = await runExec(container, ['php', 'occ', 'app:list', '--output', 'json'], false)
	// fix dockerode bug returning invalid leading characters
	const applist = JSON.parse(json.substring(json.indexOf('{')))

	// Enable apps and give status
	for (const app of apps) {
		if (app in applist.enabled) {
			console.log(`├─ ${app} version ${applist.enabled[app]} already installed and enabled`)
		} else if (app in applist.disabled) {
			// built in
			await runExec(container, ['php', 'occ', 'app:enable', '--force', app], true)
		} else {
			if (app === 'text') {
				// text is vendored but not within the server package
				await runExec(container, ['apt', 'update'], false, 'root')
				await runExec(container, ['apt-get', '-y', 'install', 'git'], false, 'root')
				await runExec(container, ['git', 'clone', '--depth=1', TEXT_APP_GIT, 'apps/text'], true)
				await runExec(container, ['php', 'occ', 'app:enable', '--force', app], true)
			} else {
				// try appstore
				await runExec(container, ['php', 'occ', 'app:install', '--force', app], true)
			}
		}
	}
	// await runExec(container, ['php', 'occ', 'app:list'], true)

	console.log('└─ Nextcloud is now ready to use 🎉')
}

/**
 * Force stop the testing container
 */
export const stopNextcloud = async function() {
	try {
		const container = docker.getContainer(CONTAINER_NAME)
		console.log('Stopping Nextcloud container...')
		container.remove({ force: true })
		console.log('└─ Nextcloud container removed 🥀')
	} catch (err) {
		console.log(err)
	}
}

/**
 * Get the testing container's IP
 *
 * @param container name of the container
 */
export const getContainerIP = async function(
	container = docker.getContainer(CONTAINER_NAME)
): Promise<string> {
	let ip = ''
	let tries = 0
	while (ip === '' && tries < 10) {
		tries++

		await container.inspect((_err, data) => {
			ip = data?.NetworkSettings?.IPAddress || ''
		})

		if (ip !== '') {
			break
		}

		await sleep(1000 * tries)
	}

	return ip
}

// Would be simpler to start the container from cypress.config.ts,
// but when checking out different branches, it can take a few seconds
// Until we can properly configure the baseUrl retry intervals,
// We need to make sure the server is already running before cypress
// https://github.com/cypress-io/cypress/issues/22676
export const waitOnNextcloud = async function(ip: string) {
	console.log('├─ Waiting for Nextcloud to be ready... ⏳')
	await waitOn({ resources: [`http://${ip}/index.php`] })
	console.log('└─ Done')
}

const runExec = async function(
	container: Docker.Container,
	command: string[],
	verbose = false,
	user = 'www-data'
) {
	const exec = await container.exec({
		Cmd: command,
		AttachStdout: true,
		AttachStderr: true,
		User: user,
	})

	return new Promise<string>((resolve, reject) => {
		exec.start({}, (err, stream) => {
			if (stream) {
				const data = [] as string[]
				stream.setEncoding('utf8')
				stream.on('data', (str) => {
					data.push(str)
					const printable = str.replace(/\p{C}/gu, '').trim()
					if (verbose && printable !== '') {
						console.log(`├─ ${printable.replace(/\n/gi, '\n├─ ')}`)
					}
				})
				stream.on('end', () => resolve(data.join('')))
			} else {
				reject(err)
			}
		})
	})
}

const sleep = function(milliseconds: number) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
