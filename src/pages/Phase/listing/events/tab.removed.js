export function tabRemoved (event) {
  if (event.args.title === 'Add document') {
    this.formCreate.jqxForm('destroy')
    this.formCreateIsOpen = false
  }
}
