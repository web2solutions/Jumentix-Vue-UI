import RowViewer from '../RowViewer'
import Vue from 'vue'
export function gridInitRowDetail (index, parentElement, gridElement, datarecord) {
  if (this.rowViewers[index]) return
  this.startProgress()
  const rowViewer = new RowViewer({
    entity: this.entity,
    swagger: this.swagger,
    bus: this.bus,
    index,
    parentElement,
    gridElement,
    datarecord,
    schemas: this.schemas,
    rowTab: this.rowTab,
    foreignDataAdapters: this.foreignDataAdapters,
    dataAdapters: this.dataAdapters,
    height: this.rowDetailHeight,
    session: this.session
  })
  window.setTimeout(async () => {
    await rowViewer.build()
    Vue.set(this.rowViewers, index, rowViewer)
  }, 200)
  // rowViewers
}
