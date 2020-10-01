/* global session $ */
// import {  formatRecordBasedOnSwagger, update } from '../../../helpers/helpers';

export function tabRemoved (event) {
  console.log(event.args);
  if (event.args.title === 'Add document') {
    this.formCreate.jqxForm('destroy');
    this.formCreateIsOpen = false;
  }
}
