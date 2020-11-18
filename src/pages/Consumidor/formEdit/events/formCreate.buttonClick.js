/* global session $ */
// import {  formatRecordBasedOnSwagger, update } from '../../../helpers/helpers';

export async function formCreateButtonClick (event) {
  let args = event.args;
  let text = args.text; // clicked button's text.;
  let name = args.name; // clicked button's name.;
  if (text === 'Save') {
    // todo mount vallidation based on swagger
    // if (!nameField.jqxValidator('validate')) return;
    let validators = this.setFormCreateValidators(this.formCreate);
    let isValid = true;
    validators.forEach(field => {
      if (!field.jqxValidator('validate')) {
        isValid = false;
      }
    });
    if (!isValid) return;
    await this.addDocument();
  }
  else if (text === 'Close')
  {
    this.closeAddDocument();
  }
}
