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

import { UploadPicker as UploadPickerView } from '@nextcloud/upload'
import { UploadPicker, UploadPickerAddButton, UploadPickerInput } from '../../lib/selectors/uploadPicker'

describe('UploadPicker', function() {
	it('Mount upload picker and check selectors', function() {
		cy.mount(UploadPickerView)
		cy.getNc(UploadPicker).should('exist')
		cy.getNc(UploadPickerAddButton).should('exist')
		cy.getNc(UploadPickerInput).should('exist')
	})
})
