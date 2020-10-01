/* global */
// import {  formatRecordBasedOnSwagger, update } from '../../../helpers/helpers';

export function formCreateButtonClick (event) {
  const args = event.args
  const text = args.text // clicked button's text.;
  // const name = args.name // clicked button's name.;
  if (text === 'Save') {
    // todo mount vallidation based on swagger
    // if (!nameField.jqxValidator('validate')) return;
    const validators = this.setFormCreateValidators(this.formCreate)
    let isValid = true
    validators.forEach(field => {
      if (!field.jqxValidator('validate')) {
        isValid = false
      }
    })
    if (!isValid) return;
    (async () => {
      await this.addDocument()
    })()
  } else if (text === 'Close') {
    this.closeAddDocument()
  }
}
