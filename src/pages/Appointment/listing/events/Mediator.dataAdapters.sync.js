/* global */
export function dataAdaptersSyncHandler (eventObj) {
  const trackedEntities = [...Object.keys(this.dataAdapters)]
  trackedEntities.push(this.entity)
  console.log(eventObj, this.dataAdapters[eventObj.entity])
  if (!eventObj.success) return
  if (trackedEntities.indexOf(eventObj.entity) === -1) return
  if (!this.dataAdapters[eventObj.entity]) return

  if (eventObj.action === 'create') {
    this.dataAdapters[eventObj.entity]._source.localdata.push(eventObj.data)
    this.dataAdapters[eventObj.entity].dataBind()
  } else {
    for (let x = 0; x < this.dataAdapters[eventObj.entity]._source.localdata.length; x++) {
      const document = this.dataAdapters[eventObj.entity]._source.localdata[x]
      if (document._id === eventObj.data._id) {
        if (eventObj.action === 'delete_hard') {
          this.dataAdapters[eventObj.entity]._source.localdata.splice(x, 1)
        } else {
          this.dataAdapters[eventObj.entity]._source.localdata.splice(x, 1, eventObj.data)
        }
        this.dataAdapters[eventObj.entity].dataBind()
      }
    }
  }
}
