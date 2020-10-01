export function formButtonClick (event) {
  console.log('formButtonClick')
  event.stopPropagation();
  (async (event) => {
    console.log(event)
    if (event.args.name === 'close') {
      if (this.back) {
        window.getApp.$emit('APP_NAVIGATE', this._from)
      } else {
        window.getApp.$emit('APP_NAVIGATE', `/${this.entity.toLowerCase()}`)
      }
    } else if (event.args.name === 'save') {
      const {
        error
      } = await this.save()
      if (!error) {
        if (this.back) {
          window.getApp.$emit('APP_NAVIGATE', this._from)
        } else {
          window.getApp.$emit('APP_NAVIGATE', `/${this.entity.toLowerCase()}`)
        }
      }
    } else {
      if (event.args.name.indexOf('add_') > -1) {
        const entity = event.args.name.split('add_')[1]
        window.getApp.$emit('APP_NAVIGATE', `/${entity.toLowerCase()}/new?back=true`)
      }
    }
  })(event)
}
