export function gridRowSelect (event) {
  event.stopPropagation()
  // event arguments.
  const args = event.args
  // row's bound index.
  // const rowBoundIndex = args.rowindex
  // row's data. The row's data object or null(when all rows are being selected or unselected with a single action). If you have a datafield called 'firstName', to access the row's firstName, use let firstName = rowData.firstName;
  const rowData = args.row
  // console.log(rowData);
  this.selectedRow = rowData._id
}
