import {
  createSubDocument,
  deleteSubDocument,
  formatRecordBasedOnSwagger,
  getDefaultFormWidth,
  getFormHash,
  putOnLocalCollection,
  setClearFormPayload,
  setDataFields,
  setField,
  setFormValidatorRules,
  setGridHeaders,
  setSchemaFormPayload,
  updateSubDocument
} from '../../../helpers/helpers'

/* eslint no-prototype-builtins: 0 */
/* global $  */
import Swal from 'sweetalert2/dist/sweetalert2.js'

export default class SchemaViewer {
  /**
   * Creates Job interface
   * @constructor
   * @param {object} application - the application object which this service is plugged to
   */
  constructor ({
    entity,
    swagger,
    bus,
    index,
    parentElement,
    gridElement,
    datarecord,
    schema = {},
    foreignDataAdapters = {},
    dataAdapters = {},
    height = 300,
    session,
    canEdit = false,
    isUploader = false
  }) {
    this.bus = bus
    this.swagger = swagger
    this.entity = entity
    this.schema = schema
    this.index = index
    this.parentElement = parentElement
    this.gridElement = gridElement
    this.datarecord = datarecord
    this._id = datarecord._id
    this.rootElement = $($(this.parentElement).children()[0])
    this.foreignDataAdapters = foreignDataAdapters
    this.height = height
    this.grid = null
    this.form = null
    this.layout = null
    this.tab = null
    this.progressInterval = null
    this.session = session
    this.splitter = null
    this.dataAdapter = null
    this.dataAdapters = dataAdapters
    this.formTemplate = []
    this.selectedRow = false
    this.selectedRowData = {}
    this.canEdit = canEdit
    this.isUploader = isUploader
    // console.log(this.schema.schema)
  }

  destroy () {
    this.bus = null
    this.swagger = null
    this.entity = null

    this.index = null
    this.gridElement = null
    this.datarecord = null

    // this.rootElement = $($(this.parentElement).children()[0])
    // this.parentElement = null

    this.schema = null
    this._id = null

    this.foreignDataAdapters = null
    this.height = null
    this.grid.jqxGrid('destroy')
    this.grid = null
    if (this.canEdit) this.form.jqxForm('destroy')
    this.form = null
    if (this.canEdit) this.splitter.jqxSplitter('destroy')
    this.layout = null
    this.tab = null
    if (this.progressInterval) window.clearInterval(this.progressInterval)
    this.progressInterval = null
    this.session = null
    this.mode = 'create'
    this.formTemplate = []
  }

  startProgress () {
    $('#progress').show()
    $('#progress').jqxProgressBar({
      animationDuration: 0,
      showText: false,
      renderText: function (text, value) {
        if (value < 55) {
          return `<span style='color: #333;'>${text}</span>`
        }
        return `<span style='color: #fff;'>${text}</span>`
      },
      template: 'success',
      width: 100,
      height: 15,
      value: 0
    })
    let count = 0
    this.progressInterval = window.setInterval(() => {
      count = count + 1
      $('#progress').val(count)
      if (count === 100) count = 0
    }, 1)
  }

  endProgress () {
    $('#progress').hide()
    if (this.progressInterval) window.clearInterval(this.progressInterval)
    $('#progress').val(0)
  }

  async setForeignForm (entity) {
    const template = []
    const definition = this.swagger.definitions[entity]
    const properties = definition.properties
    for (const name in properties) {
      if (properties.hasOwnProperty(name)) {
        if (name === '_id') continue
        const property = properties[name]

        const field = await setField({
          entity,
          name,
          property,
          swagger: this.swagger,
          bus: this.bus,
          dataAdapters: this.dataAdapters,
          mode: 'search',
          width: getDefaultFormWidth(-180)
        })
        // console.log(field);
        template.push(field)
      }
    }
    return template
  }

  buildSplitters (schema) {
    this.splitter = $(`#splitter_${schema.schemaName}`).jqxSplitter({
      width: '100%',
      height: this.height,
      orientation: 'horizontal',
      panels: [{
        size: this.height - 50
      },
      {
        size: this.height - 50
      }]
    })
  }

  buildGrid (schema, fields) {
    // console.warn(`=====building====> ${schema.schemaName}`, schema)
    const data = this.datarecord[schema.parentName]
    // prepare the data
    const source = {
      datatype: 'array',
      datafields: fields,
      localdata: data,
      updaterow: function (rowid, rowdata, commit) {
        // commit(true);
      }
    }

    const headers = setGridHeaders(schema.schema.properties, this.dataAdapters)
    // headers.forEach(header => this.foreignGridColumns[].push(header));

    // eslint-disable-next-line
    this.dataAdapter = new $.jqx.dataAdapter(source);

    let showToolbar = this.canEdit
    if (this.isUploader) {
      showToolbar = true
    }
    this.grid = $(`#grid_schema_${schema.schemaName}_${this._id}`)
    this.grid.jqxGrid({
      width: '100%',
      // height: 250,
      source: this.dataAdapter,
      columnsresize: true,
      columns: headers,
      showtoolbar: showToolbar,
      rendertoolbar: (statusbar) => {
        this.buildGridFieldToolbar(statusbar, schema.schemaName)
      }
    })

    this.grid.on('rowselect', (event) => {
      event.stopPropagation()
      const args = event.args
      // row's bound index.
      // const rowBoundIndex = args.rowindex
      // row's data. The row's data object or null(when all rows are being selected or unselected with a single action). If you have a datafield called 'firstName', to access the row's firstName, use let firstName = rowData.firstName;
      const rowData = args.row
      // console.log(rowData);
      this.selectedRow = rowData._id
      this.selectedRowData = rowData
    })
    this.grid.on('rowdoubleclick', (event) => {
      event.stopPropagation()
      if (this.isUploader) this.downloadFile()
    })
    this.grid.on('dblclick', (event) => {
      event.stopPropagation()
    })
    this.grid.on('pagechanged', (event) => {
      event.stopPropagation()
    })
    this.grid.on('pagesizechanged', (event) => {
      event.stopPropagation()
    })
    this.grid.on('rowselect', (event) => {
      event.stopPropagation()
    })
    this.grid.on('cellvaluechanged', (event) => {
      event.stopPropagation()
    })
    // console.info(schema)
  }

  buildGridFieldToolbar (statusbar, name) {
    // console.log('buildGridFieldToolbar', {isUploader})
    const container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>")
    const addButton = $(`<div style='float: left; margin-left: 5px;' title="Add ${name}"><i aria-hidden='true' class='material-icons'>add</i><span style='margin-left: 4px; position: relative; top: -3px;'></span></div>`)
    const editButton = $(`<div style='float: left; margin-left: 5px;' title="Edit ${name}"><i aria-hidden='true' class='material-icons'>edit</i><span style='margin-left: 4px; position: relative; top: -3px;'></span></div>`)
    const downloaderButton = $(`<div style='float: left; margin-left: 5px;' title="Download ${name}"><i aria-hidden='true' class='material-icons'>cloud_download</i><span style='margin-left: 4px; position: relative; top: -3px;'></span></div>`)
    const deleteButton = $(`<div style='float: left; margin-left: 5px;' title="Delete ${name}"><i aria-hidden='true' class='material-icons'>delete</i><span style='margin-left: 4px; position: relative; top: -3px;'></span></div>`)
    if (this.canEdit) container.append(addButton)
    if (this.canEdit) container.append(editButton)
    if (this.canEdit) container.append(deleteButton)
    if (this.isUploader) container.append(downloaderButton)
    editButton.jqxButton({
      width: 30,
      height: 20
    })
    deleteButton.jqxButton({
      width: 30,
      height: 20
    })
    addButton.jqxButton({
      width: 30,
      height: 20
    })

    addButton.click(() => {
      this.mode = 'create'
      this.openForm()
    })
    editButton.click(() => {
      this.mode = 'update'
      this.updateSchema()
    })
    downloaderButton.click(() => {
      this.downloadFile()
    })
    deleteButton.click(() => {
      this.deleteSchema()
    })
    // add new row.
    statusbar.append(container)
  }

  deleteSchema () {
    if (!this.selectedRow) {
      Swal.fire({
        title: 'Invalid selection',
        type: 'error',
        html: 'Please select an item on the grid before.',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: 'Close',
        timer: 2000
      })
      return
    }

    Swal.fire({
      title: `Delete ${this.schema.schemaName}`,
      text: `Please cancel if you don't want to delete this ${this.schema.schemaName}. It can not be reverted!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.value) {
        await this.deleteSubDocument(this.schema.schemaName, this.selectedRow)
        // this.selectedRows[schemaName]
      }
    })
  }

  updateSchema () {
    if (!this.selectedRow) {
      Swal.fire({
        title: 'Invalid selection',
        type: 'error',
        html: 'Please select an item on the grid before.',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: 'Close',
        timer: 2000
      })
      return
    }

    this.mode = 'update'
    this.openForm()
    setSchemaFormPayload(this.form, this.formTemplate, this.selectedRowData)
    this.form.jqxForm('value', this.selectedRowData)
    // setFormPayload
    // selectedRowData
  }

  downloadFile () {
    if (!this.selectedRow) {
      Swal.fire({
        title: 'Invalid selection',
        type: 'error',
        html: 'Please select a file on grid before.',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: 'Close',
        timer: 2000
      })
      return
    }
    window.open(this.selectedRowData.webPath, this.selectedRowData.label)
    console.log(this.selectedRowData)
    // setFormPayload
    // selectedRowData
  }

  async deleteSubDocument (schemaName, schemaId) {
    const {
      error,
      data
    } = await deleteSubDocument(this.entity, this._id, schemaName, {
      _id: schemaId
    })
    if (error) return
    const source = {
      localdata: data ? data[schemaName] : [],
      datatype: 'array',
      datafields: setDataFields(this.schema.schema.properties, this.dataAdapters),
      id: '_id'
    }
    // eslint-disable-next-line
    let dataAdapter = new $.jqx.dataAdapter(source)
    // jqField.source = dataAdapter
    this.grid.jqxGrid('source', dataAdapter)
    this.grid.jqxGrid('updatebounddata')
    this.selectedRow = false
    this.selectedRowData = {}
    return {
      data,
      error: null
    }
  }

  async buildForm (schema, fields) {
    this.formTemplate = await this.setForeignForm(schema.schemaName)
    this.formTemplate.push({
      align: 'left',
      padding: {
        left: 0,
        top: 5,
        bottom: 5,
        right: 40
      },
      columns: [{
        name: 'new',
        type: 'button',
        text: 'New',
        align: 'left',
        width: 120
      }, {
        name: 'save',
        type: 'button',
        text: 'Save',
        align: 'left',
        width: 120
      }]
    })

    this.form = $(`#form_schema_${schema.schemaName}_${this._id}`)
    this.form.jqxForm({
      template: this.formTemplate,
      // value: sampleValue,
      padding: {
        left: 10,
        top: 10,
        right: 10,
        bottom: 10
      }
    })

    if (this.session.user.portal_isDark) this.form.find('table').css('background-color', '#4d4d4d')
    if (this.session.user.portal_isDark) this.form.find('table').css('border', '0px')
    if (!this.session.user.portal_isDark) this.form.find('table').css('background-color', 'transprent')

    this.form.jqxValidator({
      hintType: 'label',
      rules: setFormValidatorRules(this.form, schema.schema, 'create')
    })
    this.form.on('buttonClick', async (event) => {
      // console.log(event.args.name);
      if (event.args.name === 'save') {
        await this.save()
      } else {
        //
      }
    })
  }

  openForm () {
    console.warn('openForm', this.mode)
    this.splitter.jqxSplitter('collapse')
  }

  closeForm () {
    this.splitter.jqxSplitter('expand')
    this.mode = 'create'
    setClearFormPayload(this.form, this.formTemplate)
  }

  async build () {
    this.startProgress()
    const fields = setDataFields(this.schema.schema.properties, this.dataAdapters)

    if (this.canEdit) this.buildSplitters(this.schema)
    this.buildGrid(this.schema, fields)
    if (this.canEdit) await this.buildForm(this.schema, fields)

    this.endProgress()
  }

  async save () {
    const definition = this.schema.schema
    if (!this.form.jqxValidator('validate')) {
      return
    }
    this.startProgress()
    Swal.fire({
      title: 'Saving document',
      text: `Please wait while ${this.entity} is saved.`
    })

    let hash = getFormHash({
      form: this.form,
      definition,
      mode: this.mode
    })
    console.log(hash)
    const payload = formatRecordBasedOnSwagger(definition, hash)
    console.log(payload)
    // console.log('payload', payload);
    // console.log(this.subDocument);

    hash = {
      // _id: (ObjectID()).toString(),
      ...payload
    }
    let response = {}
    if (this.mode === 'create') {
      console.log('create')
      console.log(this.entity)
      console.log(this._id)
      console.log(this.schema.schemaName)
      console.log(hash)
      response = await createSubDocument(this.entity, this._id, this.schema.schemaName, hash)
    } else {
      hash._id = this.selectedRow
      console.log('update')
      console.log(this.entity)
      console.log(this._id)
      console.log(this.schema.schemaName)
      console.log(hash)
      response = await updateSubDocument(this.entity, this._id, this.schema.schemaName, hash)
    }

    const {
      data,
      error
    } = response
    // updateSubDocument(this.entity, this._id, this.schema.schemaName, payload)
    if (error) {
      return {
        data: null,
        error
      }
    }

    response = await putOnLocalCollection(this.entity, data, this._id)
    console.log(response)

    const source = {
      localdata: data ? data[this.schema.schemaName] : [],
      datatype: 'array',
      datafields: setDataFields(this.schema.schema.properties, this.dataAdapters),
      id: '_id'
    }
    // eslint-disable-next-line
    let dataAdapter = new $.jqx.dataAdapter(source)
    // jqField.source = dataAdapter
    this.grid.jqxGrid('source', dataAdapter)
    this.grid.jqxGrid('updatebounddata')
    this.selectedRow = false
    Swal.close()
    this.closeForm()
    this.endProgress()
    return {
      data,
      error: null
    }
  }
}
