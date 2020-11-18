import 'jqwidgets-framework/jqwidgets/styles/jqx.base.css'
// eslint-disable-next-line
// import 'jqwidgets-framework/jqwidgets/styles/jqx.arctic.css';
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
import 'jqwidgets-framework/jqwidgets/jqxgrid.columnsreorder.js'
import 'jqwidgets-framework/jqwidgets/jqxtabs.js'
import 'jqwidgets-framework/jqwidgets/jqxform.js'
import 'jqwidgets-framework/jqwidgets/jqxcalendar.js'
import 'jqwidgets-framework/jqwidgets/jqxdatetimeinput.js'
import 'jqwidgets-framework/jqwidgets/jqxmaskedinput.js'
import 'jqwidgets-framework/jqwidgets/jqxvalidator.js'
import 'jqwidgets-framework/jqwidgets/jqxradiobutton.js'
import 'jqwidgets-framework/jqwidgets/jqxpasswordinput.js'
import 'jqwidgets-framework/jqwidgets/jqxnumberinput.js'
import 'jqwidgets-framework/jqwidgets/jqxtooltip.js'
import 'jqwidgets-framework/jqwidgets/jqxsplitter.js'
import 'jqwidgets-framework/jqwidgets/jqxexpander.js'
import 'jqwidgets-framework/jqwidgets/jqxswitchbutton.js'
import 'jqwidgets-framework/jqwidgets/jqxeditor.js'
import 'jqwidgets-framework/jqwidgets/jqxdropdownbutton.js'
import 'jqwidgets-framework/jqwidgets/jqxprogressbar.js'
import 'jqwidgets-framework/jqwidgets/globalization/globalize.js'

import * as is from 'is_js'

import {
  create,
  formatRecordBasedOnSwagger,
  getForeignCollection,
  getFormHash,
  getIsVirtual,
  getLocalCollection,
  getSchema,
  isFormHide,
  putOnLocalCollection,
  setDataFields,
  setField,
  setFormValidatorRules,
  speak
} from '../../../helpers/helpers'
import { generateIcon, getButtons } from './toolbarButtons'

import Mediator from '../../../Mediator'
// import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import Swal from 'sweetalert2/dist/sweetalert2.js'
/* global session $ */
/* eslint no-prototype-builtins: 0 */
import Vue from 'vue'
import { dataSyncHandler } from './events/data.sync'
import { formButtonClick } from './events/form.buttonClick'
import { formChange } from './events/form.change'
import { toolbarClick } from './events/toolbar.click'
import { windowResize } from './events/window.resize'

// import * as ObjectID from 'bson-objectid'

let winResize = windowResize

const interfaceTemplate = function (entity, pageTitle) {
  return `
<div id="tabs" style="100%;">
   <ul>
      <li style="margin-left: 5px;" id="tab_title"><b>Create new:</b> ${entity}</li>
   </ul>
   <div style="width: 100%; padding-bottom: 20px; background-color: transparent; overflow: hidden;">
      <div id="toolbar"></div>
      <div id="form" style="width: 100%;"></div>
   </div>
</div>
`
}
let _from = null
const vm = {
  components: {
    // VuePerfectScrollbar
  },
  name: 'Form',
  data: () => ({
    _from,
    back: false,
    mediatorDataSyncEvent: false,
    mode: 'create',
    document: {},
    pageTitle: false,
    itemLabel: false,
    entity: false,
    _id: false,
    isDirty: false,
    toolbarButtons: [],
    formTemplate: [],
    formValidators: [],
    dataAdapters: {}
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
    _from = from
    if (!session.isOnline()) {
      // return;
      next({ path: '/login' })
    } else {
      next()
    }
  },
  beforeDestroy () {
    this.destroyInterface()
  },
  beforeRouteLeave (to, from, next) {
    if (this.isDirty) {
      Swal.fire({
        title: 'Unsaved changes',
        text: 'You are going to lose the entered information if you proceed.',
        type: 'error',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#33cc33',
        showCancelButton: true,
        confirmButtonText: `Yes, proceed to ${this.entity} listing`,
        calcelButtonText: `Yes, proceed to ${this.entity} listing`
      }).then(async (result) => {
        if (result.value) {
          // this.destroyInterface()
          next()
        }
      })
      return
    }
    this.destroyInterface()
    next()
  },
  watch: {

  },
  created () {
    // let self = this;
    console.warn('------------------->>>>>> CREATING VUE COMPONENT')
    this.entity = this.$route.meta.entity
    this.itemLabel = this.$route.meta.itemLabel
    this._id = this.$router.currentRoute.params.id

    if (this.$route) {
      if (this.$route.query) {
        if (this.$route.query.back) {
          this.back = true
          this._from = _from.path
        }
      }
    }

    // window.document.documentElement.style.overflow = 'hidden';
  },
  mounted () {
    (async () => {
      console.warn('------------------->>>>>> MOUNTING VUE COMPONENT')
      if (!this.canStart()) return

      winResize = winResize.bind(this)
      await this.buildInterface()
    })()
    // window.document.documentElement.style.overflow = 'hidden';
  },
  methods: {
    destroyInterface () {
      Mediator.client.destroyEvent(this.mediatorDataSyncEvent)
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

      if (this.tab) {
        this.tab.jqxTabs('destroy')
        this.tab = null
      }

      Vue.set(this, 'toolbarButtons', [])
      Vue.set(this, 'formTemplate', [])
      Vue.set(this, 'dataAdapters', {})

      // Vue.set(this, 'selectedRows', {});

      this.bus = null
      $('#xWrapper').html('')
    },
    async buildInterface () {
      if (this.session.user.portal_isDark) $.jqx.theme = 'dark'
      if (!this.session.user.portal_isDark) $.jqx.theme = 'arctic'
      $('#xWrapper').html(interfaceTemplate(this.entity, this.pageTitle))
      this.bus = new Vue()
      this.buildToolbar()
      this.startProgress()
      this.buildLayout()

      await this.createDataAdapters()

      await this.setForm()

      this.mediatorDataSyncEvent = Mediator.client.on('data:sync', dataSyncHandler.bind(this))

      this.buildForm()
      if (is.mobile()) {
        window.addEventListener('orientationchange', winResize)
      } else {
        window.addEventListener('resize', winResize)
      }
      this.endProgress()
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
      if (typeof this.swagger.definitions[this.entity] === 'undefined') {
        console.error('Can not start xCrud. There is no swagger schema defined for ' + this.$route.meta.entity)
        return false
      }
      return true
    },

    buildToolbar () {
      const self = this
      Vue.set(this, 'toolbarButtons', [])
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
      this.tab.jqxTabs('select', 0)
      // this.tab.on('removed', tabRemoved.bind(this));
    },
    getAvailableWidth () {
      console.log(window.screen.width)
      return window.screen.width - 70
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
      Vue.set(this, 'formTemplate', [])
      Vue.set(this, 'formValidators', [])
      const definition = this.swagger.definitions[this.entity]
      const properties = definition.properties

      for (const name in properties) {
        if (properties.hasOwnProperty(name)) {
          if (name === '_id') continue
          const property = properties[name]
          // const isEditable = getFormEditable(property)
          const readOnly = property.readOnly
          const isHide = isFormHide(property)
          const isVirtual = getIsVirtual(property)
          if (isHide) continue
          if (isVirtual) continue
          if (readOnly) continue

          const field = await setField({
            entity: this.entity,
            name,
            property,
            swagger: this.swagger,
            mode: this.mode,
            bus: this.bus,
            dataAdapters: this.dataAdapters
          })
          // entity, name, property, swagger
          this.formTemplate.push(field)
        }
      }
    },
    buildForm () {
      const definition = this.swagger.definitions[this.entity]

      this.form = $('#form')
      this.formTemplate.push({
        align: 'left',
        padding: {
          left: 0,
          top: 5,
          bottom: 5,
          right: 40
        },
        columns: [{
          name: 'close',
          type: 'button',
          text: `Go back to ${this.entity} listing.`,
          align: 'left'
          // width: 120
        }, {
          name: 'save',
          type: 'button',
          text: `Save ${this.entity}`,
          align: 'left',
          width: 120
        }]
      })
      this.form.jqxForm({
        template: this.formTemplate,
        // width: this.getAvailableWidth() + 'px',
        // value: this.document,
        padding: {
          left: 10,
          top: 10,
          right: 10,
          bottom: 10
        }
      })

      $('.jqx-info-icon').each(function () {
        console.log(this)
        $(this).click((event) => {
          const message = $(this).attr('title')
          speak(message)
        })
      })

      this.form.jqxValidator({
        hintType: 'label',
        rules: setFormValidatorRules(this.form, definition, this.mode)
      })

      // jqx form must be created before to set validators

      //
      this.form.on('buttonClick', formButtonClick.bind(this))

      this.form.on('change', formChange.bind(this))

      this.bus.$on('saveAndAddSchema', async (schemaName) => {
        const { error, data } = await this.save()
        console.log({ error, data })
        if (!error) window.getApp.$emit('APP_NAVIGATE', `/${this.entity.toLowerCase()}/edit/${data._id}/schema/${schemaName}/new`)
      })

      if (this.session.user.portal_isDark) $('#formWrap').css('background-color', '#4d4d4d')
      if (this.session.user.portal_isDark) $('#formWrap').css('border', '0px')
      if (!this.session.user.portal_isDark) $('#formWrap').css('background-color', 'transparent')
    },
    async save () {
      // save document
      // save document
      const definition = this.swagger.definitions[this.entity]
      if (!this.form.jqxValidator('validate')) return { data: null, error: 'Not valid fields' }
      this.startProgress()
      Swal.fire({
        title: 'Saving document',
        text: `Please wait while ${this.entity} is saved.`
      })

      let hash = getFormHash({ form: this.form, definition, mode: this.mode })
      const payload = formatRecordBasedOnSwagger(definition, hash, this.mode, true)

      hash = {
        // _id: this._id,
        ...payload
      }

      console.log(hash)

      const { data, error } = await create(this.entity, hash)
      if (error) {
        return {
          data: null,
          error
        }
      }
      const response = await putOnLocalCollection(this.entity, data, this._id)
      console.log(response)
      this.endProgress()
      Swal.close()
      this.isDirty = false
      return {
        data,
        error: null
      }
    }
  }
}
export default vm
