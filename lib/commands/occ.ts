/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { runCommand } from "./docker"

export function runOccCommand(command: string, options?: Partial<Cypress.ExecOptions>) {
	runCommand(`php ./occ ${command}`, options)
}
