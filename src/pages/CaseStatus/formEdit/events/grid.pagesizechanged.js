/* global session $ */
// import {  formatRecordBasedOnSwagger, update } from '../../../helpers/helpers';

export function gridPageSizeChanged (event) {
  this.selectedRow = false;
  this.grid.jqxGrid('clearselection');
}
