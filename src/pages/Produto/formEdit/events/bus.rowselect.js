/* global  */
import Vue from 'vue'
// import {  formatRecordBasedOnSwagger } from '../../../../helpers/helpers';

export async function busRowselect (obj) {
  const { event, name /* entity, property, swagger, mode, definition, schema */ } = obj
  // let { error, data } = await this.save();
  const selectedId = event.args.row._id
  Vue.set(this.selectedRows, name, selectedId)
}
