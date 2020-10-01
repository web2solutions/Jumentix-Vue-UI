import * as is from 'is_js'

import {
  getDefaultFormWidth,
  getForeignCollection,
  getFormFileType,
  getFormIsUploader,
  getIsVirtual,
  isFormHide,
  isSchema,
  setField,
  setFormPayload
} from '../../../helpers/helpers'

/* eslint no-prototype-builtins: 0 */
/* global $  */
import SchemaViewer from './SchemaViewer'
import Vue from 'vue'

export default class PanelButtons {
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
    schemas = {},
    foreignDataAdapters = {},
    dataAdapters = {},
    height = 300,
    session
  }) {
    this.bus = bus
    this.swagger = swagger
    this.entity = entity
    this.schemas = schemas
    this.index = index
    this.parentElement = parentElement
    this.gridElement = gridElement
    this.datarecord = datarecord
    this._id = datarecord._id
    this.rootElement = $($(parentElement).children()[0])
    this.foreignDataAdapters = foreignDataAdapters
    this.tab = {}
    this.height = height
    this.layout = {}
    // this.tab = {}
    this.SchemaViewer = {}
    this.progressInterval = null
    this.session = session
    this.tabComponent = null
    this.dataAdapters = dataAdapters
  }

  destroy () {
    this.bus = null
    this.swagger = null
    this.entity = null
    this.schemas = null
    this.index = null
    this.parentElement = null
    this.gridElement = null
    this.datarecord = null
    this._id = null
    // this.rootElement = $($(parentElement).children()[0])

    this.foreignDataAdapters = null
    this.height = null

    for (const key in this.SchemaViewer) {
      if (this.SchemaViewer.hasOwnProperty(key)) {
        this.SchemaViewer[key].destroy()
      }
    }
    this.SchemaViewer = null
    this.tabComponent.jqxTabs('destroy')
    this.layout = null
    this.tab = null
    if (this.progressInterval) window.clearInterval(this.progressInterval)
    this.progressInterval = null
    this.session = null
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

  getLayout (name, _id) {
    return $(`
        <div id="splitter_${name}" style="width: 100%;">
          <div class="splitter-panel">
              <div style="border: none; width: ${getDefaultFormWidth(is.mobile() ? 0 : -100)}" id="grid_schema_${name}_${_id}">
              </div>
          </div>
          <div class="splitter-panel" style="width: ${getDefaultFormWidth(is.mobile() ? 0 : -100)};">
              <form id="form_schema_${name}_${_id}" style="position:absolute;  width: 100%; height: 100%;">
              </form>
          </div>
        </div>
      `)
  }

  async setForm () {
    Vue.set(this, 'formTemplate', [])
    const properties = this.swagger.definitions[this.entity].properties
    // console.error('properties', properties)
    const mode = 'view'

    for (const name in properties) {
      if (properties.hasOwnProperty(name)) {
        if (name === '_id') continue
        const property = properties[name]
        // console.log(name, property)
        // console.warn(name, property)
        const foreignCollection = getForeignCollection(property)
        const mediaType = getFormFileType(property)
        const isHide = isFormHide(property)
        const isVirtual = getIsVirtual(property)
        // const readOnly = property.readOnly
        if (isSchema(property)) continue
        if (isVirtual) continue
        if (isHide) continue
        const fConf = {
          entity: this.entity,
          name,
          property,
          swagger: this.swagger,
          mode,
          bus: this.bus,
          width: getDefaultFormWidth(is.mobile() ? -60 : -180)
        }
        if (foreignCollection) {
          fConf.dataAdapters = this.dataAdapters
        }
        // console.warn(fConf);
        const field = await setField(fConf)
        // entity, name, property, swagger
        if (mediaType === 'avatar') {
          this.formTemplate.unshift(field)
        } else {
          this.formTemplate.push(field)
        }
        // console.warn(field);
      }
    }
  }

  buildFormViewer () {
    this.form = $(`#form_Overview_${this._id}`)
    // // console.log(this.formTemplate);

    this.form.jqxForm({
      template: this.formTemplate,
      value: this.datarecord,
      padding: {
        left: 20,
        top: 20,
        right: 10,
        bottom: 40
      }
    })

    if (this.session.user.portal_isDark) this.form.find('table').css('background-color', '#4d4d4d')
    if (this.session.user.portal_isDark) this.form.find('table').css('border', '0px')
    if (!this.session.user.portal_isDark) this.form.find('table').css('background-color', 'transprent');
    (async () => {
      await setFormPayload(this.form, this.swagger.definitions[this.entity].properties, this.datarecord)
    })()
  }

  async build () {
    this.startProgress()
    // console.error($(this.rootElement))
    const _tabs = $(this.rootElement).find('._tabs')
    this.tab.Overview = $('<li>Overview</liv>')
    this.tab.Overview.appendTo($(_tabs))
    this.layout.Overview = $(`
        <div style="width: ${getDefaultFormWidth(is.mobile() ? -60 : -180)}; overflow: hidden;">
          <form id="form_Overview_${this._id}" style="position:absolute; width: ${getDefaultFormWidth(is.mobile() ? -60 : -100)}; height: 100%; overflow: auto;">
          </form>
        </div>
    `)
    this.layout.Overview.appendTo($(this.rootElement))

    // oh hell, some jquery dirty magic code to build the layouts for each schema
    // lets build the dom to build the tabs
    this.schemas.forEach(schema => {
      // console.log('schema schema schema', schema)
      this.tab[schema.schemaName] = $(`<li>${schema.parentProperty.description}</liv>`)
      this.tab[schema.schemaName].appendTo($(_tabs))
      this.layout[schema.schemaName] = this.getLayout(schema.schemaName, this._id)
      this.layout[schema.schemaName].appendTo($(this.rootElement))
    })

    this.tabComponent = this.rootElement.jqxTabs({
      width: getDefaultFormWidth(is.mobile() ? 0 : -100),
      height: this.height
    })

    await this.setForm()
    this.buildFormViewer()

    this.tabComponent.on('expanded', function (event) {
      if (this.session.user.portal_isDark) $('#formWrap').css('background-color', '#4d4d4d')
      if (this.session.user.portal_isDark) $('#formWrap').css('border', '0px')
      if (!this.session.user.portal_isDark) $('#formWrap').css('background-color', 'transparent')
    })

    this.schemas.forEach(schema => {
      const conf = { ...this }
      conf.schema = schema
      //  console.log(schema)
      const properties = this.swagger.definitions[this.entity].properties
      conf.isUploader = getFormIsUploader(properties[schema.parentName])
      this.SchemaViewer[schema.schemaName] = new SchemaViewer(conf)
      window.setTimeout(async () => {
        await this.SchemaViewer[schema.schemaName].build()
      }, 200)
    })

    this.endProgress()
  }
}
