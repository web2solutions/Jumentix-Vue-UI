/* global session $ */
// import {  formatRecordBasedOnSwagger, update } from '../../../helpers/helpers';

export function gridPageChanged (event) {
  this.selectedRow = false;
  this.grid.jqxGrid('clearselection');
}
