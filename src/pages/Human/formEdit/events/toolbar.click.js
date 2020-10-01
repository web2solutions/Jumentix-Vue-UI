/* global  */
// import {  formatRecordBasedOnSwagger, update } from '../../../helpers/helpers';

export function toolbarClick (buttonId) {
  console.log('toolbarClick', buttonId)
  buttonId === 'back' && window.getApp.$emit('APP_NAVIGATE', `/${this.entity.toLowerCase()}`)
  if (buttonId === 'save') {
    (async () => {
      const {
        error
      } = await this.save()
      if (!error) {
        if (this.back) {
          window.getApp.$emit('APP_NAVIGATE', this._from)
        } else {
          window.getApp.$emit('APP_NAVIGATE', `/${this.entity.toLowerCase()}`)
        }
      }
    })()
  }
}
