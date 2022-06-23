import { Selector } from "."

export const UploadPicker: Selector = () => cy.get('[data-upload-picker]')
export const UploadPickerInput: Selector = () => UploadPicker().find('[data-upload-picker-input]')
export const UploadPickerAddButton: Selector = () => UploadPicker().find('[data-upload-picker-input]')
