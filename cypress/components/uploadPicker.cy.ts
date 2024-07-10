/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Folder } from '@nextcloud/files'
import { UploadPicker as UploadPickerView } from '@nextcloud/upload'
import { UploadPicker, UploadPickerAddButton, UploadPickerInput } from '../../dist/selectors'

describe('UploadPicker', function() {
	it('Mount upload picker and check selectors', function() {
		cy.mount(UploadPickerView, {
			propsData: {
				// We need a fake folder as "destination" otherwise the component does not mount
				destination: new Folder({
					owner: 'test',
					root: '/dav',
					source: 'http://example.com/dav/folder',
				}),
			},
		})

		cy.getNc(UploadPicker).should('exist')
		cy.getNc(UploadPickerAddButton).should('exist')
		cy.getNc(UploadPickerInput).should('exist')
	})
})
