/* global session $ */
// import {  formatRecordBasedOnSwagger, update } from '../../../helpers/helpers';

export async function formSearchButtonClick (event) {
  if (event.args.name === 'submitButton')
  {
    await this.buildComplexQueryAndSearch();
  }
}
