/* global  */
export function formButtonClick (event) {
  event.stopPropagation();
  (async (event) => {
    console.log(event)
    if (event.args.name === 'close') {
      window.getApp.$emit('APP_NAVIGATE', `/${this.entity.toLowerCase()}/edit/${this._id}`)
    } else if (event.args.name === 'save') {
      // do what here
      const { error } = await this.save()
      if (!error) window.getApp.$emit('APP_NAVIGATE', `/${this.entity.toLowerCase()}/edit/${this._id}`)
    } else {
      if (event.args.name.indexOf('add_') > -1) {
        const entity = event.args.name.split('add_')[1]
        window.getApp.$emit('APP_NAVIGATE', `/${entity.toLowerCase()}/new?back=true`)
      }
    }
  })(event)
}
