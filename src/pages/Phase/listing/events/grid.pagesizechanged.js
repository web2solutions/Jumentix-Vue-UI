
export function gridPageSizeChanged (event) {
  event.stopPropagation()
  this.selectedRow = false
  this.grid.jqxGrid('clearselection')
}
