/* global session $ */
import Vue from 'vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
// import {  formatRecordBasedOnSwagger } from '../../../../helpers/helpers';

export async function busSaveAndAddSchema (schemaName) {
  // let { error, data } = await this.save();
  if (!this.selectedRows[schemaName]) {
    Swal.fire({
      title: `Invalid selection`,
      type: 'error',
      html: `Please select an item on the grid before.`,
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: 'Close',
      timer: 2000
    });
    return;
  }

  window.getApp.$emit('APP_NAVIGATE', `/${this.entity.toLowerCase()}/edit/${this._id}/schema/${schemaName}/edit/${this.selectedRows[schemaName]}`);
}
