/* global  */

export function formSearchButtonClick (event) {
  if (event.args.name === 'submitButton') {
    (async () => {
      await this.buildComplexQueryAndSearch()
    })()
  }
}
