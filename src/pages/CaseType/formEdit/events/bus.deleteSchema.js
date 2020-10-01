/* global */
import Swal from 'sweetalert2/dist/sweetalert2.js'
// import {  formatRecordBasedOnSwagger } from '../../../../helpers/helpers';

export async function busDeleteSchema (schemaName) {
  console.warn({
    schemaName
  })
  if (!this.selectedRows[schemaName]) {
    Swal.fire({
      title: 'Invalid selection',
      type: 'error',
      html: 'Please select an item on the grid before.',
      showCloseButton: true,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: 'Close',
      timer: 2000
    })
    return
  }

  Swal.fire({
    title: `Delete ${schemaName}`,
    text: `Please cancel if you don't want to delete this ${schemaName}. It can not be reverted!`,
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.value) {
      await this.deleteSchema(schemaName, this.selectedRows[schemaName])
      // this.selectedRows[schemaName]
    }
  })
}
