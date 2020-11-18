/* global */
// import {  formatRecordBasedOnSwagger, update } from '../../../helpers/helpers';

export function formEditButtonClick (event, _id) {
  const args = event.args
  const text = args.text // clicked button's text.;
  // const name = args.name // clicked button's name.;
  if (text === 'Save') {
    // todo mount vallidation based on swagger
    // if (!nameField.jqxValidator('validate')) return;
    console.log(_id)

    const validators = this.setFormCreateValidators(this.formEdit[_id])
    let isValid = true
    validators.forEach(field => {
      if (!field.jqxValidator('validate')) {
        isValid = false
      }
    })
    if (!isValid) return
    (async () => {
      await this.editDocument(_id)
    })()
  } else if (text === 'Close') {
    this.closeEditDocument(_id)
  }
}
