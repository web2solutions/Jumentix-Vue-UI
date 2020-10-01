/* global  */
// import {  formatRecordBasedOnSwagger, update } from '../../../helpers/helpers';

export function toolbarClick (buttonId) {
  (async (buttonId) => {
    console.log('toolbarClick', buttonId)
    buttonId === 'back' && window.getApp.$emit('APP_NAVIGATE', `/${this.entity.toLowerCase()}/edit/${this._id}`)
    if (buttonId === 'save') {
      const { error } = await this.save()
      if (!error) window.getApp.$emit('APP_NAVIGATE', `/${this.entity.toLowerCase()}/edit/${this._id}`)
    }
  })(buttonId)
}
