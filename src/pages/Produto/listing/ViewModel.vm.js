/* eslint no-prototype-builtins: 0 */
/* global session $ */
import 'jqwidgets-framework/jqwidgets/styles/jqx.base.css'
import 'jqwidgets-framework/jqwidgets/styles/jqx.arctic.css'
import 'jqwidgets-framework/jqwidgets/styles/jqx.material.css'
import 'jqwidgets-framework/jqwidgets/styles/jqx.dark.css'
import 'jqwidgets-framework/jqwidgets/styles/jqx.metrodark.css'
import 'jqwidgets-framework/jqwidgets/jqxcore.js'
import 'jqwidgets-framework/jqwidgets/jqxdata.js'
import 'jqwidgets-framework/jqwidgets/jqxmenu.js'
import 'jqwidgets-framework/jqwidgets/jqxbuttons.js'
import 'jqwidgets-framework/jqwidgets/jqxscrollbar.js'
import 'jqwidgets-framework/jqwidgets/jqxlistbox.js'
import 'jqwidgets-framework/jqwidgets/jqxdropdownlist.js'
import 'jqwidgets-framework/jqwidgets/jqxcombobox.js'
import 'jqwidgets-framework/jqwidgets/jqxinput.js'
import 'jqwidgets-framework/jqwidgets/jqxtoolbar.js'
import 'jqwidgets-framework/jqwidgets/jqxcheckbox.js'
import 'jqwidgets-framework/jqwidgets/jqxgrid.js'
import 'jqwidgets-framework/jqwidgets/jqxgrid.sort.js'
import 'jqwidgets-framework/jqwidgets/jqxgrid.pager.js'
import 'jqwidgets-framework/jqwidgets/jqxgrid.selection.js'
import 'jqwidgets-framework/jqwidgets/jqxgrid.edit.js'
import 'jqwidgets-framework/jqwidgets/jqxgrid.columnsresize.js'
import 'jqwidgets-framework/jqwidgets/jqxtabs.js'
import 'jqwidgets-framework/jqwidgets/jqxform.js'
import 'jqwidgets-framework/jqwidgets/jqxcalendar.js'
import 'jqwidgets-framework/jqwidgets/jqxdatetimeinput.js'
import 'jqwidgets-framework/jqwidgets/jqxmaskedinput.js'
import 'jqwidgets-framework/jqwidgets/jqxvalidator.js'
import 'jqwidgets-framework/jqwidgets/jqxradiobutton.js'
import 'jqwidgets-framework/jqwidgets/jqxpasswordinput.js'
import 'jqwidgets-framework/jqwidgets/jqxnumberinput.js'
import 'jqwidgets-framework/jqwidgets/jqxdata.export.js'
import 'jqwidgets-framework/jqwidgets/jqxgrid.export.js'
import 'jqwidgets-framework/jqwidgets/jqxexport.js'
import 'jqwidgets-framework/jqwidgets/jqxtooltip.js'
import 'jqwidgets-framework/jqwidgets/jqxsplitter.js'
import 'jqwidgets-framework/jqwidgets/jqxexpander.js'
import 'jqwidgets-framework/jqwidgets/globalization/globalize.js'
import 'jqwidgets-framework/jqwidgets/jqxgrid.filter.js'
import 'jqwidgets-framework/jqwidgets/jqxswitchbutton.js'
import 'jqwidgets-framework/jqwidgets/jqxeditor.js'
import 'jqwidgets-framework/jqwidgets/jqxdropdownbutton.js'
import 'jqwidgets-framework/jqwidgets/jqxprogressbar.js'
import 'jqwidgets-framework/jqwidgets/jqxpanel.js'

import * as JSZip from 'jszip'
// import * as ObjectID from 'bson-objectid'
import * as is from 'is_js'

import {
  clearMarks,
  getDefaultFormWidth,
  getForeignCollection,
  getFormSearchable,
  getFormType,
  getFromApi,
  getIsVirtual,
  getLocalCollection,
  getSchema,
  isSchema,
  mountFieldQuery,
  remove,
  restore,
  setDataFields,
  setField,
  setGridHeaders,
  speak
} from '../../../helpers/helpers'
import {
  generateIcon,
  getButtons
} from './toolbarButtons'

import Mediator from '../../../Mediator'
// import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import Swal from 'sweetalert2/dist/sweetalert2'
import Vue from 'vue'
import { dataAdaptersSyncHandler } from './events/Mediator.dataAdapters.sync'
import { dataSyncHandler } from './events/Mediator.data.sync'
import { formSearchButtonClick } from './events/formSearch.buttonClick'
import { formSearchFormDataChange } from './events/formSearch.formdatachange'
import { gridCellValueChanged } from './events/grid.cellvaluechanged'
import { gridInitRowDetail } from './events/grid.initrowdetail'
import { gridPageChanged } from './events/grid.pagechanged'
import { gridPageSizeChanged } from './events/grid.pagesizechanged'
import { gridRowCollapse } from './events/grid.rowCollapse'
import { gridRowExpand } from './events/grid.rowExpand'
import { gridRowSelect } from './events/grid.rowselect'
import { tabRemoved } from './events/tab.removed'
import { toolbarClick } from './events/toolbar.click'
import { windowResize } from './events/window.resize'

window.JSZip = JSZip
let winResize = windowResize

const interfaceTemplate = function (entity, pageTitle) {
  return `
  <div id="toolbar"></div>
  <div id="tabs">
    <ul>
      <li style="margin-left: 5px;">Advanced Search</li>
      <li selected="true">Listing</li>
    </ul>
    <div>
      <div id ="formSearch"></div>
    </div>
    <div style="overflow: hidden;">
      <!-- <div id="progress" style="display: none;"></div> -->
      <div id="grid" style="border:none;"></div>
    </div>  
  </div>
`
}

const rowDetailTemplate = `
  <div style="">
    <ul style="" class="_tabs">
    </ul>
  </div>
`
const vm = {
  components: {
    // VuePerfectScrollbar
  },
  name: 'Produto',
  data: () => ({
    itemExpanded: false,
    mediatorDataSyncEvent: false,
    mediatorAdaptersDataSyncEvent: false,
    entity: '',
    itemLabel: '',
    loading: false,
    toolbarButtons: [],
    gridColumns: [],
    datafields: [],
    rowDetailHeight: 300,
    dataAdapters: {},
    formValidators: [],
    selectedRow: false,
    schemas: [],
    foreignSchemas: [],
    rowTab: [],
    formTemplate: [],
    rowViewers: {},
    formSearchTemplate:
    [
      {
        bind: 'matching_operator',
        type: 'option',
        label: 'Should match any or all filters?',
        labelPosition: 'left',
        labelWidth: '30%',
        align: 'left',
        width: '250px',
        required: true,
        component: 'jqxDropDownList',
        options:
        [
          {
            label: 'Any',
            value: 'any'
          },
          {
            label: 'All',
            value: 'all'
          }
        ]
      }, {
        name: 'submitButton',
        type: 'button',
        text: 'Search',
        align: 'right',
        padding: {
          left: 0,
          top: 5,
          bottom: 5,
          right: 40
        }
      }
    ],
    documents: [],
    foreignDocuments: {},
    foreignDataFields: {},
    foreignSources: {},
    foreignDataAdapters: {},
    foreignGridColumns: {},
    windoHeight: window.innerHeight,
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 30, // -1 for All
      totalItems: 0
    },
    query_operators: {
      text: [
        { label: 'Contains', value: 'contains' },
        { label: 'Does not contains', value: 'doesNotContains' },
        { label: 'Equal', value: 'eq' },
        { label: 'Ends with', value: 'endsWith' },
        { label: 'Is empty', value: 'isEmpty' },
        { label: 'Is not empty', value: 'isNotEmpty' },
        { label: 'Is not null', value: 'isNotNull' },
        { label: 'Is null', value: 'isNull' },
        { label: 'Not equal', value: 'ne' },
        { label: 'Starts with', value: 'startsWith' }
      ],
      combo: [
        { label: 'Equal', value: 'eq' },
        { label: 'Is not null', value: 'isNotNull' },
        { label: 'Is null', value: 'isNull' },
        { label: 'Not equal', value: 'ne' }
      ],
      date_number: [
        { label: 'Equal', value: 'eq' },
        { label: 'Not equal', value: 'ne' },
        { label: 'Is null', value: 'isNull' },
        { label: 'Is not null', value: 'isNotNull' },
        { label: 'Greater than', value: 'gt' },
        { label: 'Greather than and', value: 'gte' },
        { label: 'Lower than', value: 'lt' },
        { label: 'Lower than and', value: 'lte' },
        { label: 'Between', value: 'between' },
        { label: 'Not between', value: 'notBetween' }
      ]
    }
  }),
  computed: {
    swagger () {
      return this.store.state.swagger
    },
    session () {
      return this.store.state.session
    }
  },
  beforeRouteEnter (to, from, next) {
    if (!session.isOnline()) {
      // return;
      next({ path: '/login' })
    } else {
      next()
    }
  },
  beforeRouteLeave (to, from, next) {
    this.destroyInterface()
    // grid
    // formCreate
    // formSearch
    // tab
    next()
  },
  watch: {
    documents: {
      handler () {
        this.source.localdata = []
        this.source.localdata = this.documents
        // console.log(this.documents);
        if (this.grid !== null) this.grid.jqxGrid('updatebounddata', 'cells')
        // console.error('updating grid')
      },
      deep: true
    }
  },
  created () {
    console.warn('------------------->>>>>> CREATING VUE COMPONENT')
    this.entity = this.$route.meta.entity
    this.itemLabel = this.$route.meta.itemLabel
  },
  mounted () {
    (async () => {
      console.warn('------------------->>>>>> MOUNTING VUE COMPONENT')
      if (!this.canStart()) return
      winResize = winResize.bind(this)
      await this.buildInterface()
    })()
  },
  methods: {
    destroyInterface () {
      Mediator.client.destroyEvent(this.mediatorDataSyncEvent)
      Mediator.client.destroyEvent(this.mediatorAdaptersDataSyncEvent)

      if (is.mobile()) {
        window.removeEventListener('orientationchange', winResize)
      } else {
        window.removeEventListener('resize', winResize)
      }
      if (this.toolbar) {
        this.toolbar.jqxToolBar('destroy')
        this.toolbar = null
      }
      if (this.form) {
        this.form.jqxForm('destroy')
        this.form = null
      }

      for (const name in this.rowViewers) {
        if (this.rowViewers.hasOwnProperty(name)) {
          this.rowViewers[name].destroy()
        }
      }

      if (this.grid) {
        this.grid.jqxGrid('destroy')
        this.grid = null
      }

      if (this.tab) {
        this.tab.jqxTabs('destroy')
        this.tab = null
      }

      this.selectedRow = false

      // Vue.set(this, 'documents', [])
      Vue.set(this, 'toolbarButtons', [])
      Vue.set(this, 'formTemplate', [])
      Vue.set(this, 'formSearchTemplate', [])
      Vue.set(this, 'dataAdapters', {})
      Vue.set(this, 'formValidators', [])
      Vue.set(this, 'foreignSchemas', [])
      Vue.set(this, 'schemas', [])
      Vue.set(this, 'gridColumns', [])
      Vue.set(this, 'rowTab', [])
      Vue.set(this.source, 'localdata', [])

      this.bus = null
      $('#xWrapper').html('')
    },
    async buildInterface () {
      if (this.session.user.portal_isDark) $.jqx.theme = 'dark'
      if (!this.session.user.portal_isDark) $.jqx.theme = 'arctic'
      $('#xWrapper').html(interfaceTemplate(this.entity, this.pageTitle))
      // $('#xWrapper').html(interfaceTemplate(this.entity, this.pageTitle));
      this.bus = new Vue()

      // read toolbar buttons and put on data
      this.buildToolbar()
      this.buildLayout()

      await this.createDataAdapters()

      this.buildGridDataSource()
      this.buildGrid()

      await this.setForm()
      this.buildSearchForm()

      // capture changes on collection co-related to the entity managed into this CRUDER
      this.mediatorDataSyncEvent = Mediator.client.on('data:sync', dataSyncHandler.bind(this))

      this.mediatorAdaptersDataSyncEvent = Mediator.client.on('data:sync', dataAdaptersSyncHandler.bind(this))

      await this.feedGrid()

      if (is.mobile()) {
        window.addEventListener('orientationchange', winResize)
      } else {
        window.addEventListener('resize', winResize)
      }
    },
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
    },
    endProgress () {
      $('#progress').hide()
      if (this.progressInterval) window.clearInterval(this.progressInterval)
      $('#progress').val(0)
    },
    // called on every toolbar item init
    initJQToolbar (type, index, toolbar, menuToolIninitialization) {
      if (type === 'button') {
        toolbar.append(generateIcon(this.toolbarButtons[index].icon, this.toolbarButtons[index].text))
        toolbar.on('click', this.toolbarButtons[index].handler)
        // toolbar.disabled = true;
        toolbar.jqxTooltip({ content: `${this.toolbarButtons[index].text}`, position: 'mouse', name: 'movieTooltip' })
      } else if (type === 'input') {
        if (this.toolbarSimpleSearchfield) return
        this.toolbarSimpleSearchfield = toolbar
        this.toolbarSimpleSearchfield.jqxInput({ width: 200, placeHolder: this.toolbarButtons[index].text })
        toolbar.on('change', async (event) => {
          // let type = event.args.type; // keyboard, mouse or null depending on how the value was changed.
          // let value = this.toolbarSimpleSearchfield.val();
          if (event.args) {
            this.searchSimple()
          }
        })
        toolbar.jqxTooltip({ content: `${this.toolbarButtons[index].text} ${this.toolbarButtons[index].description}`, position: 'mouse', name: 'movieTooltip' })
      }
    },
    canStart () {
      if (typeof this.$route.meta.entity === 'undefined') {
        console.error('Can not start xCrud. Entity is undefined')
        return false
      }
      if (this.$route.meta.entity === '' || this.$route.meta.entity === null) {
        console.error('Can not start xCrud. Entity is undefined')
        return false
      }
      if (typeof this.swagger.definitions[this.$route.meta.entity] === 'undefined') {
        console.error('Can not start xCrud. There is no swagger schema defined for ' + this.$route.meta.entity)
        return false
      }
      return true
    },
    setDataFields (properties, isForeign = false) {
      const fields = []
      for (const name in properties) {
        if (properties.hasOwnProperty(name)) {
          // if (name === '_id') continue;
          const property = properties[name]
          const type = property.type
          // const xuiType = getFormType(property)
          // const isUploader = getFormIsUploader(property)
          // const isEditable = getFormEditable(property)
          // const formMask = getFormMask(property)
          const foreignCollection = getForeignCollection(property)
          const fieldConf = { name, type }

          if (isSchema(property)) {
            const refArray = property.items.$ref.split('/')
            const schemaName = refArray[refArray.length - 1]
            const schema = this.swagger.definitions[schemaName]
            // const fields = schema.properties;

            if (!isForeign) {
              // console.log(`LOCAL SCHEMA ${schemaName}`, property);
              this.schemas.push({ schemaName, schema, parentProperty: property, parentName: name })
            }
            if (isForeign) {
              // console.log(`FOREIGN SCHEMA ${schemaName}`, property);
              this.foreignSchemas.push({ schemaName, schema, parentProperty: property, parentName: name })
            }
          }

          if (foreignCollection) {
            let source = []
            if (this.dataAdapters[foreignCollection.collection]) {
              source = this.dataAdapters[foreignCollection.collection] ? this.dataAdapters[foreignCollection.collection]._source.localdata : []
            }
            const ffield = { name: foreignCollection.collection }
            ffield.value = name
            ffield.values = {
              source,
              name: foreignCollection.labelKey,
              value: foreignCollection.valueKey
            }
            fields.push(ffield)
            // // console.log('setDataFields', field);
          }
          // console.log('fieldConf', fieldConf);
          fields.push(fieldConf)
        }
      }
      console.error(fields)
      return fields
    },
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
            dataAdapters: this.foreignDataAdapters,
            mode: 'search',
            width: getDefaultFormWidth(-100)
          })
          // console.log(field);
          template.push(field)
        }
      }
      return template
    },
    async createDataAdapters () {
      Vue.set(this, 'dataAdapters', [])
      const definition = this.swagger.definitions[this.entity]
      const properties = definition.properties

      for (const name in properties) {
        if (properties.hasOwnProperty(name)) {
          if (name === '_id') continue
          const property = properties[name]
          const schema = getSchema(this.swagger, property)
          // getSchema
          // getSchemaName
          if (schema) {
            await this.createSchemaDataAdapters(schema)
          }
        }
      }

      for (const name in properties) {
        if (properties.hasOwnProperty(name)) {
          if (name === '_id') continue
          const property = properties[name]
          const foreignCollection = getForeignCollection(property)
          if (foreignCollection) {
            const properties = this.swagger.definitions[foreignCollection.collection].properties
            const datafields = setDataFields(properties, this.dataAdapters)

            const { data } = await getLocalCollection(foreignCollection.collection)
            const source =
            {
              localdata: data || [],
              datatype: 'array',
              datafields: datafields,
              id: '_id'
            }
            // eslint-disable-next-line
            let dataAdapter =  new $.jqx.dataAdapter(source, { autoBind: true });
            Vue.set(this.dataAdapters, foreignCollection.collection, dataAdapter)
          }
        }
      }
    },
    async createSchemaDataAdapters (definition) {
      const properties = definition.properties

      for (const name in properties) {
        if (properties.hasOwnProperty(name)) {
          if (name === '_id') continue
          const property = properties[name]
          const foreignCollection = getForeignCollection(property)
          if (foreignCollection) {
            const properties = this.swagger.definitions[foreignCollection.collection].properties
            const datafields = setDataFields(properties, this.dataAdapters)

            const { data } = await getLocalCollection(foreignCollection.collection)
            const source =
            {
              localdata: data || [],
              datatype: 'array',
              datafields: datafields,
              id: '_id'
            }
            // eslint-disable-next-line
            let dataAdapter =  new $.jqx.dataAdapter(source, { autoBind: true });
            Vue.set(this.dataAdapters, foreignCollection.collection, dataAdapter)
          }
        }
      }
    },
    async setForm () {
      // console.error('setForm')
      Vue.set(this, 'formTemplate', [])
      Vue.set(this, 'formSearchTemplate', [])
      const definition = this.swagger.definitions[this.$route.meta.entity]
      const properties = definition.properties
      for (const name in properties) {
        if (properties.hasOwnProperty(name)) {
          if (name === '_id') continue
          const property = properties[name]
          const xuiType = getFormType(property)
          // const readOnly = property.readOnly
          const isVirtual = getIsVirtual(property)
          const canSearch = getFormSearchable(property)
          if (xuiType === 'file') continue
          if (xuiType === 'base64') continue
          if (isVirtual) continue
          if (!canSearch) continue
          // if (readOnly) continue
          if (!isSchema(property)) {
            const field = await setField({
              entity: this.entity,
              name,
              property,
              swagger: this.swagger,
              bus: this.bus,
              dataAdapters: this.dataAdapters,
              mode: 'search',
              width: '250px'
            })

            const paramField = {
              bind: `operator_${name}`,
              type: 'option',
              label: 'Condition',
              labelPosition: 'top',
              labelWidth: '30%',
              align: 'left',
              width: '250px',
              required: true,
              component: 'jqxDropDownList',
              options: this.query_operators.text
            }

            if (xuiType === 'combo' || xuiType === 'combobox') {
              paramField.options = this.query_operators.combo
            }
            if (xuiType === 'date' || xuiType === 'date-time') {
              paramField.options = this.query_operators.date_number
            }
            if (xuiType === 'date' || xuiType === 'date-time') {
              paramField.options = this.query_operators.date_number
            }

            const col = {
              columns: [field, paramField]
            }

            // used on query
            this.formTemplate.push(field)

            this.formSearchTemplate.push(col)
          }
        }
      }
    },
    buildToolbar () {
      Vue.set(this, 'toolbarButtons', [])
      const self = this
      getButtons(self).forEach(button => self.toolbarButtons.push(button))
      // destroy toolbar if exist
      this.toolbar = $('#toolbar')

      // build JQ toolbar
      this.toolbar.jqxToolBar({
        width: '100%',
        height: 45,
        tools: self.toolbarButtons.map(elem => { return elem.type }).join(' | '),
        initTools: self.initJQToolbar
      })
      // set toolbar events
      self.bus.$on('toolbarClick', toolbarClick.bind(this))
    },
    buildLayout () {
      this.tab = $('#tabs')
      this.tab.jqxTabs({ width: '100%', position: 'top' })
      this.tab.jqxTabs('select', 1)
      this.tab.on('removed', tabRemoved.bind(this))
    },
    buildGridDataSource () {
      Vue.set(this, 'datafields', [])
      const fields = this.setDataFields(this.swagger.definitions[this.$route.meta.entity].properties)
      fields.forEach(f => this.datafields.push(f))

      // setDataFields
      this.source = {
        localdata: [],
        datatype: 'array',
        id: '_id',
        datafields: this.datafields,
        pagesize: this.pagination.rowsPerPage,
        pager: (pagenum, pagesize, oldpagenum) => {
          // callback called when a page or page size is changed.
          this.selectedRow = false
          this.grid.jqxGrid('clearselection')
        }
      }
      // eslint-disable-next-line
      this.dataAdapter = new $.jqx.dataAdapter(this.source);
    },
    async feedGrid (rebuild = false) {
      this.startProgress()
      const { data, error } = await getLocalCollection(this.entity, true)
      // // console.log({ data, error });
      if (!error) {
        this.source.localdata = []
        Vue.set(this, 'documents', [])
        // this.$set(this.items, index, val)
        data.forEach(doc => this.documents.unshift(doc))

        if (rebuild) {
          // // console.log('REBUILD');
          this.grid.jqxGrid('refreshdata')
          // this.grid.jqxGrid('refresh');
          this.grid.jqxGrid('render')
        }
        this.endProgress()
        // if (data.length < 1) return
        /* window.setTimeout(() => {
          this.grid.jqxGrid('selectrow', 0);
          this.grid.jqxGrid('showrowdetails', 0);
        }, 1000); */
      }
    },
    buildGrid () {
      Vue.set(this, 'gridColumns', [])
      // initialize jqxGrid
      const headers = setGridHeaders(this.swagger.definitions[this.$route.meta.entity].properties, this.dataAdapters)
      console.error(headers)
      headers.forEach(header => this.gridColumns.push(header))

      /* this.gridColumns.push({
        text: 'Edit',
        datafield: 'Edit',
        columntype: 'button',
        filterable: false,
        cellsrenderer: function () {
          return 'Edit'
        },
        buttonclick: function (row) {
          // open the popup window when the user clicks a button.
          const editrow = row
          const offset = $('#grid').offset()
          $('#popupWindow').jqxWindow({ position: { x: (parseInt(offset.left) + 60), y: (parseInt(offset.top) + 60) } })
          // get the clicked row's data and initialize the input fields.
          const dataRecord = $('#grid').jqxGrid('getrowdata', editrow)
          $('#firstName').val(dataRecord.firstname)
          $('#lastName').val(dataRecord.lastname)
          $('#product').val(dataRecord.productname)
          $('#quantity').jqxNumberInput({ decimal: dataRecord.quantity })
          $('#price').jqxNumberInput({ decimal: dataRecord.price })
          // show the popup window.
          $('#popupWindow').jqxWindow('open')
        }
      }) */

      headers.unshift({
        text: '#',
        sortable: false,
        filterable: false,
        editable: false,
        groupable: false,
        draggable: false,
        resizable: false,
        datafield: '',
        columntype: 'number',
        width: 50,
        cellsrenderer: (row, column, value) => {
          return `<div style='margin:4px;'>${(value + 1)}</div>`
        }
      })

      this.grid = $('#grid')

      let wrapperHeight = $('.page-wrapper').css('height').replace(/px/gi, '')
      const wrapperWidth = $('#xWrapper').css('width').replace(/px/gi, '')

      wrapperHeight = Number(wrapperHeight) - 120
      this.grid.jqxGrid({
        width: wrapperWidth,
        height: wrapperHeight,
        source: this.dataAdapter,
        pageable: true,
        pagesize: this.pagination.rowsPerPage,
        // autoheight: true,
        sortable: true,
        altrows: true,
        enabletooltips: true,
        editable: true,
        editmode: 'dblclick',
        columnsresize: true,
        adaptive: true,
        selectionmode: 'singlerow',
        showfilterrow: false,
        filterable: false,
        rowdetails: true,
        rowdetailstemplate: { rowdetails: rowDetailTemplate, rowdetailsheight: this.rowDetailHeight },
        initrowdetails: gridInitRowDetail.bind(this),
        // rowsheight: 35,
        ready: () => {

        },

        columns: this.gridColumns
      })

      this.grid.on('rowdoubleclick', (event) => {
        console.log(event)
        event.stopPropagation()
      })

      this.grid.on('rowexpand', gridRowExpand.bind(this))
      this.grid.on('rowcollapse', gridRowCollapse.bind(this))
      this.grid.on('pagechanged', gridPageChanged.bind(this))
      this.grid.on('pagesizechanged', gridPageSizeChanged.bind(this))
      this.grid.on('rowselect', gridRowSelect.bind(this))
      this.grid.on('cellendedit', gridCellValueChanged.bind(this))
    },

    buildSearchForm () {
      const col = {
        columns: [{
          bind: 'matching_operator',
          type: 'option',
          label: 'Should match any or all filters?',
          labelPosition: is.mobile() ? 'top' : 'left',
          labelWidth: '30%',
          align: 'left',
          width: '250px',
          required: true,
          component: 'jqxDropDownList',
          options: [{
            label: 'Any',
            value: 'any'
          },
          {
            label: 'All',
            value: 'all'
          }]
        }, {
          name: 'submitButton',
          type: 'button',
          text: 'Search',
          align: 'left',
          padding: {
            left: 0,
            top: 5,
            bottom: 5,
            right: 40
          }
        }]
      }
      this.formSearchTemplate.push(col)
      this.formSearch = $('#formSearch')
      this.formSearch.jqxForm({
        template: this.formSearchTemplate,
        // value: sampleValue,
        padding: {
          left: 10,
          top: 10,
          right: 10,
          bottom: 10
        }
      })

      if (this.session.user.portal_isDark) $('#formWrap').css('background-color', '#4d4d4d')
      if (this.session.user.portal_isDark) $('#formWrap').css('border', '0px')
      if (!this.session.user.portal_isDark) $('#formWrap').css('background-color', 'transparent')

      this.formSearch.on('formDataChange', formSearchFormDataChange.bind(this))
      this.formSearch.on('buttonClick', formSearchButtonClick.bind(this))
    },
    openAddDocument () {
      window.getApp.$emit('APP_NAVIGATE', `/${this.entity.toLowerCase()}/new`)
    },
    openEditDocument () {
      if (!this.isOneSelected()) {
        return
      }
      window.getApp.$emit('APP_NAVIGATE', `/${this.entity.toLowerCase()}/edit/${this.selectedRow}`)
    },
    preview () {
      if (!this.isOneSelected()) {
        return
      }
      this.grid.jqxGrid('showrowdetails', this.grid.jqxGrid('selectedrowindex'))
    },

    isOneSelected () {
      let selected = false
      if (!this.selectedRow) {
        const title = 'Invalid selection.'
        const message = 'Before proceed, please select an item on the grid.'
        speak(`${title} ${message}`)
        Swal.fire({
          title,
          type: 'error',
          html: message,
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText: 'Close',
          timer: 5000
        })
        selected = false
      } else {
        selected = true
      }
      return selected
    },
    async softDeleteSelected () {
      if (!this.isOneSelected()) {
        return
      }
      const title = `Soft delete ${this.entity}?`
      const text = `When you soft delete a record, it remains in the collection as inactive record. Please cancel if you don't want to delete this ${this.entity}!`
      speak(`${title} ${text}`)
      Swal.fire({
        title,
        text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.value) {
          this.startProgress()
          const { error } = await remove(this.entity, this.selectedRow, 'soft')
          if (error) return
          // this.selectedRow = false
          this.endProgress()
          // console.log({ error, data });
        }
      })
    },
    async restoreDeleted () {
      if (!this.isOneSelected()) {
        return
      }
      const title = `Restore ${this.entity}?`
      const text = `When you restore a record, it becomes available in the sytem again. Please cancel if you don't want to restore this ${this.entity}!`
      speak(`${title} ${text}`)
      Swal.fire({
        title,
        text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, restore it!'
      }).then(async (result) => {
        if (result.value) {
          this.startProgress()
          const { error } = await restore(this.entity, this.selectedRow)
          if (error) return
          // this.selectedRow = false
          this.endProgress()
          // console.log({ error, data });
        }
      })
    },
    async hardDeleteSelected () {
      if (!this.isOneSelected()) {
        return
      }
      const title = `Hard delete ${this.entity}?`
      const text = `When you hard delete a record, it will be completely deleted from the system. It can not be reverted! Please cancel if you don't want to hard delete this ${this.entity}!`
      speak(`${title} ${text}`)
      Swal.fire({
        title,
        text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.value) {
          this.startProgress()
          const { error } = await remove(this.entity, this.selectedRow, 'hard')
          if (error) return
          this.selectedRow = false
          this.endProgress()
          // console.log({ error, data });
        }
      })
    },
    async searchSimple (subAction = '') {
      const text = this.toolbarSimpleSearchfield.jqxInput('val')
      if (text === '') {
        await this.feedGrid(true)
      } else {
        this.startProgress()
        const query = {
          $text: {
            $search: text.toString()
          }
        }
        const { error, data } = await getFromApi(this.entity, this, query)
        if (error) {
          //
        } else {
          Vue.set(this, 'documents', [])
          data.forEach(doc => this.documents.push(doc))
          if (data.length > 0) {
            if (subAction === 'edit') {
              window.setTimeout(() => {
                this.grid.jqxGrid('selectrow', 0)
              }, 200)
              window.setTimeout(() => {
                this.openEditDocument()
              }, 300)
            }
          }
        }
        this.endProgress()
      }
    },
    async buildComplexQueryAndSearch () {
      const hash = this.formSearch.val()
      const logicalOperator = hash.matching_operator === 'any' ? '$or' : '$and'
      const objValues = {}
      const objOperators = {}
      this.formTemplate.forEach(field => {
        if (field.type !== 'button') {
          objValues[field.bind] = clearMarks(hash[field.bind])
          console.log(field.bind, objValues[field.bind])
          objOperators[`${field.bind}`] = hash[`operator_${field.bind}`]
        }
      })
      let queryObj = {}
      let innerQuery = {}
      innerQuery[logicalOperator] = []
      // // console.log(innerQuery);
      delete objValues._id
      delete objOperators._id
      for (const property in objValues) {
        if (objValues.hasOwnProperty(property)) {
          const objQuery = mountFieldQuery(objValues, objOperators, property, innerQuery, logicalOperator)
          innerQuery = objQuery.innerQuery
        }
      }
      queryObj = {
        $and: [innerQuery]
      }
      this.tab.jqxTabs('select', 1)
      // // console.log('queryObj', queryObj);

      await this.searchComplex(queryObj)
    },

    async searchComplex (query = {}) {
      if (!query) {
        await this.feedGrid(true)
        return
      }
      if (typeof query === 'undefined') {
        await this.feedGrid(true)
        return
      }
      if (typeof Object.keys(query) === 'undefined') {
        await this.feedGrid(true)
        return
      }
      if (Object.keys(query).length === 0) {
        await this.feedGrid(true)
        return
      }
      if (query.$and[0]) {
        if (query.$and[0].$or) {
          if (query.$and[0].$or.length > 0) {
            await this.doSearch(query)
            return
          }
        } else if (query.$and[0].$and) {
          if (query.$and[0].$and.length > 0) {
            await this.doSearch(query)
            return
          }
        }
      }
      await this.feedGrid(true)
    },
    async doSearch (query) {
      console.warn('doSearch', query)
      this.startProgress()
      const { error, data } = await getFromApi(this.entity, this, query)
      // // console.log({ error, data });
      if (!error) {
        Vue.set(this, 'documents', [])
        data.forEach(doc => this.documents.push(doc))
      }
      this.endProgress()
    },
    export2PDF () {
      this.grid.jqxGrid('exportdata', 'pdf', this.entity)
    },

    export2Excel () {
      this.grid.jqxGrid('exportdata', 'xlsx', this.entity)
    }
  }
}
export default vm
