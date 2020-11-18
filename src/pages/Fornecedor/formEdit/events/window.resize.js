export function windowResize (event) {
  (async () => {
    console.warn('--------> RESIZING')
    this.destroyInterface()
    await this.buildInterface()
  })()
}
