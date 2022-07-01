import * as Docker from 'dockerode'

const docker = new Docker()
const CONTAINER_NAME = 'nextcloud-cypress-tests'

// TODO: use branch ?
export const startNextcloud = async function(branch = 'master') {
	try {
		// Remove old container if exists
		try {
			const oldContainer = docker.getContainer(CONTAINER_NAME)
			await oldContainer.remove({ force: true })
		} catch (error) {}

		console.log('Starting Nextcloud container...')
		const container = await docker.createContainer(
			{
				Image: 'ghcr.io/nextcloud/continuous-integration-shallow-server',
				name: CONTAINER_NAME,
			}
		)
		await container.start()

		// Get container's IP
		let ip = ''
		let tries = 0
		while (ip === '' && tries < 10) {
			tries++

			await container.inspect(function (err, data) {
				ip = data?.NetworkSettings?.IPAddress || ''
			})

			await sleep(1000 * tries)
			console.log('> Waiting for Nextcloud container\'s IP...')
		}

		console.log(`> Nextcloud container's IP is ${ip} 🌏`)
		return ip
	} catch(err) {
		console.log(err)
	}
}

export const configureNextcloud = async function() {
	console.log('Configuring nextcloud...')
	const container = docker.getContainer(CONTAINER_NAME)
	runExec(container, ['php', 'occ', 'config:system:set', 'force_language', '--value', 'en_US'])
	runExec(container, ['php', 'occ', 'config:system:set', 'enforce_theme', '--value', 'light'])
	console.log('> Nextcloud is now ready to use 🎉')
}

export const stopNextcloud = async function() {
	try {
		const container = docker.getContainer(CONTAINER_NAME)
		console.log('Stopping Nextcloud container...')
		container.remove({ force: true })
		console.log('> Nextcloud container removed 🥀')
	} catch(err) {
		console.log(err)
	}
}

const runExec = async function(container, command) {
    const exec = await container.exec({
        Cmd: command,
        AttachStdout: true,
        AttachStderr: true,
		User: 'www-data'
    })

    exec.start()
}

const sleep = function(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}
  
