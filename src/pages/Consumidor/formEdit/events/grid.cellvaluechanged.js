/* global session $ */
import { 
  formatRecordBasedOnSwagger, update
} from '../../../../helpers/helpers';

export async function gridCellValueChanged (event) {
  // event arguments.
  let args = event.args;
  // column data field.
  let dataField = event.args.datafield;
  // row's bound index.
  let rowBoundIndex = event.args.rowindex;
  // cell value
  let value = args.value;
  // cell old value.
  let oldvalue = args.oldvalue;
  let id = this.grid.jqxGrid('getrowid', rowBoundIndex);
  let record = {
    _id: id
  };
  record[dataField] = value;
  const payload = formatRecordBasedOnSwagger(this.swagger.definitions[this.$route.meta.entity], record);
  const {
    error,
    data
  } = await update(this.entity, payload, id);
  console.log({
    error,
    data
  });
  if (error) {
    this.grid.jqxGrid('setcellvaluebyid', id, dataField, oldvalue);
    // this.grid.jqxGrid('showvalidationpopup', rowBoundIndex, dataField, error);
    let coloredRow = '#row' + rowBoundIndex + 'grid';
    let old = $(coloredRow).children().css('background-color');
    console.log(old);
    $(coloredRow).children().css('background-color', '#D13534');
    window.setTimeout(() => {
      $(coloredRow).children().css('background-color', old);
    }, 2000);
    // this.grid.jqxGrid('hidevalidationpopup', rowBoundIndex, dataField, error);
  }
}
