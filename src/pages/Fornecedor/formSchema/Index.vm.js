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
import 'jqwidgets-framework/jqwidgets/jqxdata.export.js'
import 'jqwidgets-framework/jqwidgets/jqxgrid.export.js'
import 'jqwidgets-framework/jqwidgets/jqxexport.js'
import 'jqwidgets-framework/jqwidgets/jqxtooltip.js'
import 'jqwidgets-framework/jqwidgets/jqxsplitter.js'
import 'jqwidgets-framework/jqwidgets/jqxexpander.js'
import 'jqwidgets-framework/jqwidgets/globalization/globalize.js'
import 'jqwidgets-framework/jqwidgets/jqxswitchbutton.js'
import 'jqwidgets-framework/jqwidgets/jqxeditor.js'
import 'jqwidgets-framework/jqwidgets/jqxdropdownbutton.js'
import 'jqwidgets-framework/jqwidgets/jqxprogressbar.js'

import * as is from 'is_js'

import {
  createSubDocument,
  formatFullRecordBasedOnSwagger,
  formatRecordBasedOnSwagger,
  getForeignCollection,
  getFormHash,
  getFormIsUploader,
  getFormLabel,
  getFormType,
  getGridLabel,
  getIsVirtual,
  getLocalCollection,
  getOnLocalCollection,
  getSchema,
  getSchemaName,
  isFormHide,
  putOnLocalCollection,
  setDataFields,
  setField,
  setFormValidatorRules,
  speak,
  updateSubDocument,
  xuploadFile
} from '../../../helpers/helpers'
import {
  generateIcon,
  getButtons
} from './toolbarButtons'

import Mediator from '../../../Mediator'
// import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import Swal from 'sweetalert2/dist/sweetalert2.js'
/* global session, FileReader, Promise, $ */
/* eslint no-prototype-builtins: 0 */
import Vue from 'vue'
import {
  busComboSelect
} from './events/bus.comboSelect'
import {
  busListBoxSelect
} from './events/bus.listBoxSelect'
import {
  dataSyncHandler
} from './events/data.sync'
import {
  formButtonClick
} from './events/form.buttonClick'
import {
  formChange
} from './events/form.change'
import {
  toolbarClick
} from './events/toolbar.click'
import {
  windowResize
} from './events/window.resize'

let winResize = windowResize

const interfaceTemplate = (entity, pageTitle) => {
  return `
<div id="tabs" style="100%;">
   <ul>
      <li style="margin-left: 5px;">${pageTitle}</li>
   </ul>
   <div style="width: 100%; padding-bottom: 20px; background-color: transparent; overflow: hidden;">
      <div id="toolbar"></div>
      <div id="form" style="width: 100%;"></div>
   </div>
</div>
`
}

const vm = {
  components: {
    // VuePerfectScrollbar
  },
  name: 'Form',
  data: () => ({
    isUploader: false,
    mediatorDataSyncEvent: false,
    document: {},
    subDocument: {},
    schema: false,
    schemaName: false,
    pageTitle: false,
    itemLabel: false,
    entity: false,
    _id: false,
    isDirty: false,
    toolbarButtons: [],
    formTemplate: [],
    formValidators: [],
    dataAdapters: {},
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 30, // -1 for All
      totalItems: 0
    },
    windoHeight: window.innerHeight
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
      next({
        path: '/login'
      })
    } else {
      next()
    }
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
          this.destroyInterface()
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
    console.warn('------------------->>>>>> CREATING VUE COMPONENT')
    this.entity = this.$route.meta.entity
    this.itemLabel = this.$route.meta.itemLabel
    this._id = this.$router.currentRoute.params.id
    this.schemaName = this.$router.currentRoute.params.schemaName

    this.mode = this.$router.currentRoute.params.mode

    this.schemaid = this.$router.currentRoute.params.schemaid || false

    const mainEntityDefinition = this.swagger.definitions[this.entity]
    const mainEntityProperties = mainEntityDefinition.properties
    const mainDocumentField = mainEntityProperties[this.schemaName]
    // console.log('mainEntityDefinition', mainEntityDefinition)

    this.isUploader = getFormIsUploader(mainDocumentField)

    // console.log(this.schemaName, mainDocumentField)
    // console.log('this.isUploader', this.isUploader)
    this.schemaLabel = getFormLabel(mainDocumentField)
    this.schemaGridLabel = getGridLabel(mainDocumentField)
    this.schema = getSchema(this.swagger, mainDocumentField)
    this.refSchemaName = getSchemaName(this.swagger, mainDocumentField)
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

      this.bus = null

      Vue.set(this, 'toolbarButtons', [])
      Vue.set(this, 'formTemplate', [])
      Vue.set(this, 'dataAdapters', [])
      Vue.set(this, 'formValidators', [])

      $('#xWrapper').html('')
      // // console.log(this.toolbarButtons);
      // // console.log(this.formTemplate);
    },
    async buildInterface () {
      // console.error('buildInterface')
      if (this.session.user.portal_isDark) $.jqx.theme = 'dark'
      if (!this.session.user.portal_isDark) $.jqx.theme = 'arctic'
      await this.setDocument()
      $('#xWrapper').html(interfaceTemplate(this.entity, this.pageTitle, this.schemaGridLabel))
      this.bus = new Vue()
      this.buildToolbar()
      this.startProgress()
      this.buildLayout()

      await this.createDataAdapters()

      await this.setForm()

      this.mediatorDataSyncEvent = Mediator.client.on('data:sync', dataSyncHandler.bind(this))

      this.buildForm()
      // console.error('this.mode', this.mode)

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
    initJQToolbar (type, index, toolbar) {
      if (type === 'button') {
        toolbar.append(generateIcon(this.toolbarButtons[index].icon, this.toolbarButtons[index].text))
        toolbar.on('click', this.toolbarButtons[index].handler)
        // toolbar.disabled = true;
        toolbar.jqxTooltip({
          content: `${this.toolbarButtons[index].text}`,
          position: 'mouse',
          name: 'movieTooltip'
        })
      } else if (type === 'input') {
        if (this.toolbarSimpleSearchfield) return
        this.toolbarSimpleSearchfield = toolbar
        this.toolbarSimpleSearchfield.jqxInput({
          width: 200,
          placeHolder: this.toolbarButtons[index].text
        })
        toolbar.on('change', async (event) => {
          // let type = event.args.type; // keyboard, mouse or null depending on how the value was changed.
          // let value = this.toolbarSimpleSearchfield.val();
          if (event.args) {
            this.searchSimple()
          }
        })
        toolbar.jqxTooltip({
          content: `${this.toolbarButtons[index].text} ${this.toolbarButtons[index].description}`,
          position: 'mouse',
          name: 'movieTooltip'
        })
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
      if (!this.schema) {
        console.error('Can not start xCrud. There is no swagger schema defined for ' + this.schemaName)
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
        tools: self.toolbarButtons.map(elem => {
          return elem.type
        }).join(' | '),
        initTools: self.initJQToolbar
      })
      // set toolbar events
      self.bus.$on('toolbarClick', toolbarClick.bind(this))
    },
    buildLayout () {
      this.tab = $('#tabs')
      this.tab.jqxTabs({
        width: '100%',
        position: 'top'
      })
      this.tab.jqxTabs('select', 0)
      // this.tab.on('removed', tabRemoved.bind(this));
    },

    async createDataAdapters () {
      Vue.set(this, 'dataAdapters', [])
      const definition = this.schema
      const properties = definition.properties

      for (const name in properties) {
        if (properties.hasOwnProperty(name)) {
          if (name === '_id') continue
          const property = properties[name]
          const foreignCollection = getForeignCollection(property)
          if (foreignCollection) {
            const properties = this.swagger.definitions[foreignCollection.collection].properties
            const datafields = setDataFields(properties)

            const {
              data
            } = await getLocalCollection(foreignCollection.collection)
            const source = {
              localdata: data || [],
              datatype: 'array',
              datafields: datafields,
              id: '_id'
            }
            // eslint-disable-next-line
            let dataAdapter = new $.jqx.dataAdapter(source);
            Vue.set(this.dataAdapters, foreignCollection.collection, dataAdapter)
          }
        }
      }
    },
    async setForm () {
      Vue.set(this, 'formTemplate', [])
      Vue.set(this, 'formValidators', [])
      const definition = this.schema
      const properties = definition.properties
      const mode = this.mode

      for (const name in properties) {
        if (properties.hasOwnProperty(name)) {
          if (name === '_id') continue
          const property = properties[name]
          const foreignCollection = getForeignCollection(property)
          const isHide = isFormHide(property)
          const isVirtual = getIsVirtual(property)
          const readOnly = property.readOnly
          if (isVirtual) continue
          if (isHide) continue
          if (this.mode === 'create') {
            if (readOnly) continue
          }
          const fConf = {
            entity: this.refSchemaName,
            name,
            property,
            swagger: this.swagger,
            mode,
            bus: this.bus
          }
          if (foreignCollection) {
            fConf.dataAdapters = this.dataAdapters
          }
          // console.warn(fConf);
          const field = await setField(fConf)
          // entity, name, property, swagger
          this.formTemplate.push(field)
          // console.warn(field);
        }
      }
    },
    buildForm () {
      const definition = this.schema
      this.form = $('#form')
      // // console.log(this.formTemplate);
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
          text: is.mobile() ? 'Close' : `Go back to edit ${this.entity}.`,
          align: 'left',
          // width: 120
          padding: {
            left: 20,
            right: 20
          }
        }, {
          name: 'save',
          type: 'button',
          text: is.mobile() ? 'Save' : `Save ${this.schemaName}`,
          align: 'left',
          padding: {
            left: 20,
            right: 20
          }
        }]
      })
      const formConf = {
        template: this.formTemplate,
        value: {},
        padding: {
          left: 10,
          top: 10,
          right: 10,
          bottom: 10
        }
      }

      if (this.mode === 'edit') {
        // console.error(this.document[this.schemaName]);
        const schemaDoc = this.document[this.schemaName].filter(doc => {
          return doc._id === this.schemaid
        })[0]
        formConf.value = formatFullRecordBasedOnSwagger(definition, schemaDoc)
      }

      this.form.jqxForm(formConf)

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

      this.form.on('buttonClick', formButtonClick.bind(this))
      this.form.on('change', formChange.bind(this))
      this.bus.$on('comboSelect', busComboSelect.bind(this))
      this.bus.$on('listBoxSelect', busListBoxSelect.bind(this))

      if (this.session.user.portal_isDark) $('#formWrap').css('background-color', '#4d4d4d')
      if (this.session.user.portal_isDark) $('#formWrap').css('border', '0px')
      if (!this.session.user.portal_isDark) $('#formWrap').css('background-color', 'transparent')
    },
    async setDocument () {
      const {
        data,
        error
      } = await getOnLocalCollection(this.entity, this._id)
      // // console.log({ data, error });
      if (error) {
        console.error(`could not get ${this.entity} collection`)
        return
      }
      // // console.log(data);
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          Vue.set(this.document, key, data[key])
        }
      }
      // console.warn(data[this.itemLabel]);
      if (data[this.itemLabel]) {
        this.pageTitle = `<b>Edit ${this.schemaLabel}:</b> ${data[this.itemLabel]}`
      }
    },
    getFileField (schema) {
      let fileField = false
      // console.log('=========================', schema)
      const properties = schema.properties
      for (const name in properties) {
        // console.log('=========================', name)
        if (properties.hasOwnProperty(name)) {
          const property = properties[name]
          const xuiType = getFormType(property)
          if (xuiType === 'file') {
            fileField = name
          }
        }
      }
      return fileField
    },
    readFile (file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader()
        reader.addEventListener('load', (e) => {
          resolve(reader.result)
        }, false)
        if (file) {
          reader.readAsDataURL(file)
        } else {
          reject(new Error('no file'))
        }
      })
    },
    async save () {
      // save document
      const definition = this.schema
      if (!this.form.jqxValidator('validate')) {
        return {
          data: null,
          error: 'Not valid fields'
        }
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
      if (this.isUploader) {
        // get file field
        // const fiedlDefinition = this.schema.properties[prop]
        const fileField = this.getFileField(this.schema)
        // console.log(fileField)

        try {
          const file = document.getElementById(`xfile_${fileField}`).files[0]
          const result = await this.readFile(file)
          console.log(result)

          hash[fileField] = result

          response = await xuploadFile({
            entity: this.entity,
            main_record_id: this._id,
            bus: this.bus,
            swagger: this.swagger,
            schemaName: this.schemaName,
            newRecord: hash
          })
        } catch (e) {
          console.error(e)
          response = {
            error: e,
            data: null
          }
        }
      } else {
        if (this.mode === 'create') {
          response = await createSubDocument(this.entity, this._id, this.schemaName, hash)
        } else {
          hash._id = this.schemaid
          response = await updateSubDocument(this.entity, this._id, this.schemaName, hash)
        }
      }

      const {
        data,
        error
      } = response
      // updateSubDocument(this.entity, this._id, this.schemaName, payload)
      if (error) {
        return {
          data: null,
          error
        }
      }

      response = await putOnLocalCollection(this.entity, data, this._id)
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
