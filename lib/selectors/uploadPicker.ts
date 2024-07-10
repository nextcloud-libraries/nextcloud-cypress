/**
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import type { Selector } from "."

// This is a list of selectors for the @nextcloud/upload library
// @see https://github.com/nextcloud/nextcloud-upload

export const UploadPicker: Selector = () => cy.get('[data-cy-upload-picker]')
export const UploadPickerInput: Selector = () => UploadPicker().find('[data-cy-upload-picker-input]')
export const UploadPickerAddButton: Selector = () => UploadPicker().find('[data-cy-upload-picker-add]')
