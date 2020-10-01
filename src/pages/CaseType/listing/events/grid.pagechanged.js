
export function gridPageChanged (event) {
  event.stopPropagation()
  this.selectedRow = false
  this.grid.jqxGrid('clearselection')
}
