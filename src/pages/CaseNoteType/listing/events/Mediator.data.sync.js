/* global $ */
export function dataSyncHandler (eventObj) {
  console.log('eventObj eventObj eventObj', eventObj)
  if (eventObj.success) {
    if (eventObj.entity === this.entity && eventObj.action === 'create') {
      this.documents.unshift(eventObj.data)
      // const doc = this.documents[0]
      const coloredRow = '#row' + this.grid.jqxGrid('getrowboundindexbyid', eventObj.data._id) + 'grid'
      const old = $(coloredRow).children().css('background-color')
      $(coloredRow).children().css('background-color', '#2d862d')
      window.setTimeout(() => {
        $(coloredRow).children().css('background-color', old)
      }, 2000)
    } else if (eventObj.entity === this.entity && eventObj.action === 'update') {
      this.documents.forEach((doc, i) => {
        if (doc._id === eventObj.data._id) {
          this.documents.splice(i, 1, eventObj.data)
          const coloredRow = '#row' + this.grid.jqxGrid('getrowboundindexbyid', eventObj.data._id) + 'grid'
          const old = $(coloredRow).children().css('background-color')
          $(coloredRow).children().css('background-color', '#2d862d')
          window.setTimeout(() => {
            $(coloredRow).children().css('background-color', old)
          }, 2000)
        }
      })
    } else if (eventObj.entity === this.entity && eventObj.action === 'add_sub_document') {
      this.documents.forEach((doc, i) => {
        if (doc._id === eventObj.data._id) {
          this.documents.splice(i, 1, eventObj.data)
          const coloredRow = '#row' + this.grid.jqxGrid('getrowboundindexbyid', eventObj.data._id) + 'grid'
          const old = $(coloredRow).children().css('background-color')
          $(coloredRow).children().css('background-color', '#2d862d')
          window.setTimeout(() => {
            $(coloredRow).children().css('background-color', old)
          }, 2000)
        }
      })
    } else if (eventObj.entity === this.entity && eventObj.action === 'edit_sub_document') {
      this.documents.forEach((doc, i) => {
        if (doc._id === eventObj.data._id) {
          this.documents.splice(i, 1, eventObj.data)
          const coloredRow = '#row' + this.grid.jqxGrid('getrowboundindexbyid', eventObj.data._id) + 'grid'
          const old = $(coloredRow).children().css('background-color')
          $(coloredRow).children().css('background-color', '#2d862d')
          window.setTimeout(() => {
            $(coloredRow).children().css('background-color', old)
          }, 2000)
        }
      })
    } else if (eventObj.entity === this.entity && eventObj.action === 'delete_sub_document') {
      this.documents.forEach((doc, i) => {
        if (doc._id === eventObj.data._id) {
          this.documents.splice(i, 1, eventObj.data)
          const coloredRow = '#row' + this.grid.jqxGrid('getrowboundindexbyid', eventObj.data._id) + 'grid'
          const old = $(coloredRow).children().css('background-color')
          $(coloredRow).children().css('background-color', '#2d862d')
          window.setTimeout(() => {
            $(coloredRow).children().css('background-color', old)
          }, 2000)
        }
      })
    } else if (eventObj.entity === this.entity && eventObj.action === 'delete') {
      this.documents.forEach((doc, i) => {
        if (doc._id === eventObj.data._id) {
          // console.log('FFFFOOOOOUUUNNNNNNDDDDD', doc);
          this.documents.splice(i, 1, eventObj.data)
          // this.documents.unshift(eventObj.data);
          const coloredRow = '#row' + this.grid.jqxGrid('getrowboundindexbyid', eventObj.data._id) + 'grid'
          const old = $(coloredRow).children().css('background-color')
          $(coloredRow).children().css('background-color', '#DB747A')
          window.setTimeout(() => {
            $(coloredRow).children().css('background-color', old)
          }, 2000)
        }
      })
    } else if (eventObj.entity === this.entity && eventObj.action === 'delete_hard') {
      this.selectedRow = false
      this.grid.jqxGrid('clearselection')
      this.documents.forEach((doc, i) => {
        if (doc._id === eventObj.data._id) {
          const coloredRow = '#row' + this.grid.jqxGrid('getrowboundindexbyid', eventObj.data._id) + 'grid'
          // const old = $(coloredRow).children().css('background-color')
          $(coloredRow).children().css('background-color', '#DB747A')
          window.setTimeout(() => {
            this.documents.splice(i, 1)
          }, 1000)
        }
      })
    } else if (eventObj.entity === this.entity && eventObj.action === 'restore') {
      this.documents.forEach((doc, i) => {
        if (doc._id === eventObj.data._id) {
          console.log('FFFFOOOOOUUUNNNNNNDDDDD', doc)
          console.log('FFFFOOOOOUUUNNNNNNDDDDD', eventObj.data)
          this.documents.splice(i, 1, eventObj.data)
          // this.documents.unshift(eventObj.data);
          const coloredRow = '#row' + this.grid.jqxGrid('getrowboundindexbyid', eventObj.data._id) + 'grid'
          const old = $(coloredRow).children().css('background-color')
          $(coloredRow).children().css('background-color', '#2d862d')
          window.setTimeout(() => {
            $(coloredRow).children().css('background-color', old)
          }, 2000)
        }
      })
    }
  }
}
