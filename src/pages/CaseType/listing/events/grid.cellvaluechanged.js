/* global $ */
/* eslint no-prototype-builtins: 0 */
import {
  formatRecordBasedOnSwagger,
  getOnLocalCollection,
  update
} from '../../../../helpers/helpers'

export function gridCellValueChanged (event) {
  event.stopPropagation();
  (async () => {
    console.log(event)
    const args = event.args
    const column = this.grid.jqxGrid('getcolumn', args.datafield)
    console.error(column)
    let value = args.value
    let oldvalue = args.oldvalue
    if (column.displayfield !== column.datafield) {
      value = args.value.value
      oldvalue = args.oldvalue.value
    }
    if (value === oldvalue) return
    const dataField = event.args.datafield
    const rowBoundIndex = event.args.rowindex
    const coloredRow = '#row' + rowBoundIndex + 'grid'
    const old = $(coloredRow).children().css('background-color')
    const id = this.grid.jqxGrid('getrowid', rowBoundIndex)
    const response = await getOnLocalCollection(this.entity, id)
    if (response.error) {
      // this.grid.jqxGrid('setcellvaluebyid', id, dataField, oldvalue);
      this.grid.jqxGrid('showvalidationpopup', rowBoundIndex, dataField, response.error)
      $(coloredRow).children().css('background-color', '#D13534')
      window.setTimeout(() => {
        $(coloredRow).children().css('background-color', old)
      }, 2000)
      return
    }

    const record = {
      _id: id,
      ...response.data
    }

    record[dataField] = value

    const payload = formatRecordBasedOnSwagger(this.swagger.definitions[this.entity], record, 'edit', true)

    const {
      error
    } = await update(this.entity, payload, id)

    if (error) {
      this.grid.jqxGrid('setcellvaluebyid', id, dataField, oldvalue)
      this.grid.jqxGrid('showvalidationpopup', rowBoundIndex, dataField, error)
      $(coloredRow).children().css('background-color', '#D13534')
      window.setTimeout(() => {
        $(coloredRow).children().css('background-color', old)
      }, 2000)
    } else {
      this.grid.jqxGrid('hidevalidationpopups')
      $(coloredRow).children().css('background-color', '#9ae59a')
      window.setTimeout(() => {
        $(coloredRow).children().css('background-color', old)
      }, 2000)
    }
  })()
}
