
export function gridRowExpand (event) {
  event.stopPropagation()
  // event arguments.
  // var args = event.args;
  // row details.
  // var details = args.details;
  // row's bound index.
  const rowIndex = event.args.rowindex
  // this.grid.jqxGrid('selectrow', event.args.rowindex)
  // console.log(event);
  // const id = this.grid.jqxGrid('getrowid', event.args.rowindex)
  // console.log(event.args.rowindex);
  // console.log(this.selectedRow);
  // console.log(id);
  // window.getApp.$emit('APP_NAVIGATE', `/${this.entity.toLowerCase()}/edit/${id}`)
  // this.startProgress()
  // window.setTimeout(() => {
  //  console.log(this.rowViewers)
  //  console.log(rowIndex)
  //  this.rowViewers[rowIndex].build()
  // }, 1000)
  if (this.itemExpanded) {
    // this.grid.jqxGrid('hiderowdetails', this.itemExpanded)
  }
  this.itemExpanded = rowIndex
}
