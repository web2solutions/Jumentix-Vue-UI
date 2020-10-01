
// import Vue from 'vue';
// import {  formatRecordBasedOnSwagger } from '../../../../helpers/helpers';

export async function busAddSchema (schemaName) {
  // let { error, data } = await this.save();
  window.getApp.$emit('APP_NAVIGATE', `/${this.entity.toLowerCase()}/edit/${this._id}/schema/${schemaName}/create`);
}
