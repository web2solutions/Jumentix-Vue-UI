/* eslint no-prototype-builtins: 0 */
/* eslint-disable no-tabs */
/* global session $ */
import Vue from 'vue'
import draggable from 'vuedraggable';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
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
import 'jqwidgets-framework/jqwidgets/jqxtree.js'

import SchemaEditor from './SchemaEditor.vue'

import Mediator from '../../Mediator'

import { getSchema, getSchemaName, convertFromSwagger, canFormat, canSetLength, isMultiOptionField, getParenWidth } from '../../helpers/helpers'

import swaggerCollections from '../../helpers/mediator/hideCollections'

// DnD buttons
import SimpleTextFieldButton from './controls_button/simple.text'
import NumberCurrencyFieldButton from './controls_button/number.currency'
import SimpleSelectFieldButton from './controls_button/simple.select'

// field renderers
import ArraySchemaField from './control_renderers/array.schema.renderer'
import SimpleTextField from './control_renderers/simple.text.renderer'
import NumberCurrencyField from './control_renderers/number.currency.renderer'
import SimpleSelectField from './control_renderers/simple.select.renderer'

let idGlobal = 0;

// vue component vm
export default {
  components: {
    VuePerfectScrollbar,
    draggable,
    SchemaEditor
  },
  name: 'FormBuilder',
  data: () => ({
    bus: false,
    entities: ['NONE', 'Case', 'Family', 'Human', 'User'],
    newOptionText: '',
    selectedPageIndex: 0,
    selectedFieldIndex: false,
    selectedFieldType: false,
    selectedEntityProperties: [],
    renderedFields: {},
    selectedEntityRequiredProperties: [],
    selectedFieldStaticOptions: [
      {
        value: 'my_value',
        label: 'My Label'
      }
    ],
    genericSchemas: [],
    selectedEntitySchemas: [],
    selectedEntityFields: [],
    activePanelTab: 0,
    activeAddFieldTab: 0,
    activePage: 0,
    field_tab: null,
    field_multiselect_tab: null,
    sformats: ['ssn', 'int32', 'int64', 'float', 'double', 'date', 'date-time', 'byte', 'binary', 'password', 'email'],
    textFormats: ['none', 'ssn', 'password', 'email'],
    numberFormats: ['none', 'currency'],
    /*
      //integer	integer	int32	signed 32 bits
      long	integer	int64	signed 64 bits
      float	number	float	
      double	number	double	
      string	string		
      byte	string	byte	base64 encoded characters
      binary	string	binary	any sequence of octets
      boolean	boolean		
      date	string	date	As defined by full-date - RFC3339
      dateTime	string	date-time	As defined by date-time - RFC3339
      password	string	password	Used to hint UIs the input needs to be obscured.
    */
    stypes: ['string', 'number', 'integer', 'array', 'object', 'boolean'],
    mtypes: ['String', 'Number', 'Array', 'Object', 'Boolean', 'Date', 'ObjectId'],
    ftypes: ['select', 'number', 'combobox', 'text', 'radio', 'checkbox', 'switch', 'textarea', 'autocomplete', 'date', 'time', 'grid', 'date-time'],
    elementsList: [
      SimpleTextFieldButton,
      NumberCurrencyFieldButton,
      SimpleSelectFieldButton
      // ->>
    ],
    formList: [
      { 
        title: 'Page Name',
        name: 'page_0',
        id: 0,
        fields: []
      },
    ],
    formData: {
      title: 'Untitled Form',
      description: 'This is your form description. Click here to edit.',
      fields: []
    },
    fieldProps: {
      name: '',
      spec: {
        type: 'string',
        format: '',
        description: '',
        example: '',
        minLength: 0,
        maxLength: 0,
        readOnly: false,
        'x-editable': true,
        'x-format': 'none',
        'x-required': false,
        'x-dom': {
          type: 'String',
          required: [false, 'Field is required.'],
          // ref: ''
        },
        'x-ui': {
          'collection-link': false,
          'collection-link-value': false,
          'collection-link-label': false,
          form: {
            type: 'text',
            hide: false,
            label: '',
            'selection-limit': 1,
            options: []
          },
          grid: {
            hide: true,
            label: '',
            width: 0
          }
        }
      }
    },
    editActive: ''
  }),
  computed: {
    swagger () {
      return this.store.state.swagger
    },
    session () {
      return this.store.state.session
    },
    getEntities () {
      return Object.keys(Mediator.client.collectionDefinitions)
    },
    selectedField () {
      return this.store.FormBuilder.selectedField
    },
  },
  beforeRouteEnter (to, from, next) {
    if (!session.isOnline())
    {
      // return;
      next({ path: '/login' });
    }
    else
    {
      next();
    }
  },
  watch: {
    activePanelTab (e) {
      if (e !== 2) this.editActive = '';
      if (e !== 1) this.formList[this.selectedPageIndex].fields.forEach((element, i) => { this.formList[this.selectedPageIndex].fields[i].selected = false });
    },
    activePage (e) {
      // console.log(e)
      this.selectedFieldIndex = false
      this.selectedEntityProperties.splice(0, this.selectedEntityProperties.length)
      this.selectedEntityRequiredProperties.splice(0, this.selectedEntityRequiredProperties.length)
      this.activePanelTab = 1
      this.selectedPageIndex = e
      $('#pagesTree').jqxTree('collapseAll')
      $('#pagesTree').jqxTree('selectItem', $('#' + e)[0])
      const top = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0)
      $('#xtools').animate({
        top: top
      }, 500)
    },
    formList: {
      handler () {
        // console.log(this.formList[this.selectedPageIndex].fields[this.selectedFieldIndex])
        this.startPagesTree()
        if (!this.formList[this.selectedPageIndex].fields[this.selectedFieldIndex]) return
        
        let config = this.formList[this.selectedPageIndex].fields[this.selectedFieldIndex]
        // console.log('------------------> config config', config)
        this.destroyJQcomponent(config)
        this.renderJQcomponent(config)

        // refresh pages tree
        
      },
      deep: true
    }
  },
  created () {
    // let self = this;
    this.bus = new Vue()
  },
  mounted () {
    // let self = this;
    // // console.log(this.swagger)
    // // console.log(Mediator.client.collectionDefinitions)
    // this.entities.push('NONE')
    // Object.keys(Mediator.client.collectionDefinitions).forEach(k => this.entities.push(k))
    // console.log(this.swagger.definitions)
    swaggerCollections.schemas.forEach(schemaName => {
      schemaName = schemaName.replace(/schema/gi, '')
      // // console.log(schemaName)
      // // console.log(this.swagger.definitions[schemaName])
      this.genericSchemas.push({
        name: schemaName,
        spec: this.swagger.definitions[schemaName]
      })
    })
    this.bus.$on('selectField', (field) => { 
      // console.log(field)
      // this.selectedField = field
      this.store.commit('fmSetSelectedField', field)
    })
    this.startPagesTree()
  },
  methods: {
    startPagesTree () {

      this.formList.map(page => {
        return {
          label: page.title
        }
      })

      let source = this.formList.map(page => {
        return {
          label: page.title,
          id: page.id,
          value: page.name,
          items: page.fields.map(field => {
            // console.log(field)
            if (field.type === 'arrayOfSchema')
            {
              return {
                label: `${field.name} - arrayOfSchema`,
                id: `xf_${field.name}`,
                items: []
              }
            }
            return {
              label: `${field.name} - ${field.spec['x-ui'].form.label}`,
              id: `xf_${field.name}`
            }
          })
        }
      })
      try {
        $('#pagesTree').jqxTree('destroy')
      } catch (error) {
        
      }

      const div = document.createElement('div'); 
      div.id = 'pagesTree'
      document.getElementById(`parent_pagesTree`).appendChild(div)
      
      $('#pagesTree').jqxTree({
        source: source,
        width: '100%',
        height: '100%'
      });
      $('#pagesTree').on('itemClick', event =>
      {
        let args = event.args;
        let item = $('#pagesTree').jqxTree('getItem', args.element);
        let label = item.label;
        // console.log(item.id)

        if (item.id.toString().indexOf('xf_') > -1)
        {
          // 
          const fieldId = item.id.toString().replace(/xf\_/gi, '')
          // console.log(fieldId)
          // console.log(this.formList[this.selectedPageIndex].fields)
          let found = 0
          this.formList[this.selectedPageIndex].fields.forEach((f, index) => {
            if (f.id === fieldId) found = index
          })
          // console.log(found, this.formList[this.selectedPageIndex].fields[found])
          this.selectField(this.formList[this.selectedPageIndex].fields[found], found)
          return true;
        }

        this.activePage = Number(item.id)
        this.selectedPageIndex = Number(item.id)

        this.selectedFieldIndex = false
        this.selectedEntityProperties.splice(0, this.selectedEntityProperties.length)
        this.selectedEntityRequiredProperties.splice(0, this.selectedEntityRequiredProperties.length)
        
      });
      $('#pagesTree').jqxTree('selectItem', $('#' + this.selectedPageIndex)[0])
      $('#pagesTree').jqxTree('expandItem', $('#' + this.selectedPageIndex)[0])
    },
    addPage () {
      const newId = this.formList.length
      this.formList.push({ 
        title: 'Page Name',
        name: `page_${newId}`,
        id: newId,
        fields: []
      })
      
    },
    editPage () {
      // 
      const title = window.prompt('Type the page title', this.formList[this.selectedPageIndex].title)
      if (title) this.formList[this.selectedPageIndex].title = title
      
    },
    removePage () {
      // 
    },
    setPropertiesOfSelectedEntity (e) {
      
      // console.log(Mediator.client.collectionDefinitions[e])
      this.selectedEntityProperties.splice(0, this.selectedEntityProperties.length)
      this.selectedEntityRequiredProperties.splice(0, this.selectedEntityRequiredProperties.length)
      if (e !== 'NONE')
      {
        Mediator.client.collectionDefinitions[e].required.forEach(f => this.selectedEntityRequiredProperties.push(f))
        Object.keys(Mediator.client.collectionDefinitions[e].properties).forEach(p => {
          // console.log(Mediator.client.collectionDefinitions[e].properties[p])
          const type = Mediator.client.collectionDefinitions[e].properties[p].type
          if (type === 'array') return
          if (type === 'object') return
          this.selectedEntityProperties.push(p)
        })
      }
      
      // this.selectedEntityProperties
      // this.selectedEntityRequiredProperties
    },
    setFieldsOfSelectedEntity (e) {
      console.log('==============>', e)
      this.selectedEntitySchemas.splice(0, this.selectedEntitySchemas.length)
      this.selectedEntityFields.splice(0, this.selectedEntityFields.length)
      if (e !== 'NONE')
      {
        Object.keys(Mediator.client.collectionDefinitions[e].properties).forEach(p => {
          if (p === '_id') return
          const fieldSpec = Mediator.client.collectionDefinitions[e].properties[p]
          const type = fieldSpec.type
          // // console.log(type, p)
          // // console.log('setFieldsOfSelectedEntity fieldSpec', fieldSpec)
          if (type === 'array')
          {
            if (fieldSpec.items.$ref)
            {
              const schemaPath = fieldSpec.items.$ref
              const schema = getSchema(this.swagger, fieldSpec)
              const schemaName = getSchemaName(this.swagger, fieldSpec)
              console.log(' schema ----> ', fieldSpec)
              // // console.log(`is schema: ${schemaName}`, schema)
              // // console.log('-----------')
              
              this.selectedEntitySchemas.push({
                name: schemaName,
                label: fieldSpec.description || `Please provide a descrition field for ${p}`,
                spec: schema,
                entity: e
              })
            }
          }
          else if (type === 'object' || !!fieldSpec.$ref)
          {
            // 
          }
          else {
            console.log(' field ----> ', fieldSpec)
            this.selectedEntityFields.push({
              name: p,
              label: fieldSpec.description || `Please provide a descrition field for ${p}`,
              spec: fieldSpec,
              entity: e
            })
          }
          // if (type === 'array') return
          // if (type === 'object') return
          // this.selectedEntityFields.push(p)
        })
      }
    },
    cloneSchema (e) {
      window.console.log('Clone schema', e);
      let config = JSON.parse(JSON.stringify(e))
      this.formList[this.selectedPageIndex].fields.forEach((element, i) => { this.formList[this.selectedPageIndex].fields[i].selected = false })
      const fields = []
      
      for (let fieldName in e.spec.properties)
      {
        if (config.spec.properties.hasOwnProperty(fieldName))
        {
          if (fieldName === '_id') continue
          // console.log(e.spec.required.indexOf(fieldName) > -1)
          const required = !!(e.spec.required.indexOf(fieldName) > -1)
          const field = convertFromSwagger(fieldName, e.spec.properties[fieldName], required)
          // console.log(field)
          fields.push(field)
        }
      }
      idGlobal += 1
      return {
        id: `${config.name}${this.selectedPageIndex}_${idGlobal}`,
        name: `${config.name}${this.selectedPageIndex}_${idGlobal}`,
        type: 'arrayOfSchema',
        icon: config.icon,
        selected: false,
        label: config.spec.description,
        spec: config,
        entity: config.entity,
        fields
      };
    },
    cloneItem (e) {
      // window.console.log('Clone', e);
      let config = JSON.parse(JSON.stringify(e))
      this.formList[this.selectedPageIndex].fields.forEach((element, i) => { this.formList[this.selectedPageIndex].fields[i].selected = false })
      idGlobal += 1
      return {
        id: `${config.name}${this.selectedPageIndex}_${idGlobal}`,
        name: `${config.name}${this.selectedPageIndex}_${idGlobal}`,
        type: config.spec['x-ui'].form.type,
        icon: config.icon,
        selected: false,
        spec: config.spec
      };
    },
    log: function (evt) {
      window.console.log('-------- log', evt);
      // window.console.log('this.formList[this.selectedPageIndex].fields', this.formList[this.selectedPageIndex].fields);
      this.formData.fields = this.formList[this.selectedPageIndex].fields;
      this.editActive = '';
      if (evt.added)
      {
        if (evt.added.element)
        {
          this.renderJQcomponent(evt.added.element)
          // $('body').scrollTo(`#${evt.added.element.id}`)
          $('html, body').animate({
            scrollTop: $(`#${evt.added.element.id}`).offset().top
          }, 2000);
          // $('#xtools').scrollTo($(`#${evt.added.element.id}`).offset().top)
          
          let div = document.getElementById(evt.added.element.id)
          $('#xtools').animate({
            top: $(`#${evt.added.element.id}`).offset().top - 200
          }, 500);
        }
      }
    },
    logSchema: function (evt) {
      // window.console.log('--------', evt);
      /*
      // window.console.log('this.formList[this.selectedPageIndex].fields', this.formList[this.selectedPageIndex].fields);
      this.formData.fields = this.formList[this.selectedPageIndex].fields;
      this.editActive = '';
      if (evt.added)
      {
        if (evt.added.element)
        {
          this.renderJQcomponent(evt.added.element)
          // $('body').scrollTo(`#${evt.added.element.id}`)
          $('html, body').animate({
            scrollTop: $(`#${evt.added.element.id}`).offset().top
          }, 2000);
          // $('#xtools').scrollTo($(`#${evt.added.element.id}`).offset().top)
          
          let div = document.getElementById(evt.added.element.id)
          $('#xtools').animate({
            top: $(`#${evt.added.element.id}`).offset().top - 200
          }, 500);
        }
      }
      
      */
    },
    selectField (component, index) {
      // console.log(component, index)
      // console.log(index, this.formList[this.selectedPageIndex].fields[index])
      this.selectedFieldIndex = index;
      this.selectedFieldType = component.type;
      this.formList[this.selectedPageIndex].fields.forEach((element, i) => { this.formList[this.selectedPageIndex].fields[i].selected = false });
      this.formList[this.selectedPageIndex].fields[index].selected = true;
      this.activePanelTab = 3;
      this.editActive = '';


      this.bus.$emit('selectField', this.formList[this.selectedPageIndex].fields[index])
      
      const top = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0)
      $('#xtools').animate({
        top: top
      }, 500)
      if (component.type === 'arrayOfSchema')
      {
        console.warn(' return')
        return
      }
      this.fieldProps = Object.assign({}, this.formList[this.selectedPageIndex].fields[index]);
    },

    editProps (component) {
      // console.log('editProps', component)
      this.editActive = component;
      this.activePanelTab = 0;
    },
    
    renderJQcomponent (config) {
      console.log('renderJQcomponent')
      console.log(config)
      console.log(this.selectedPageIndex)
      console.log(this.selectedFieldIndex)
      
      let source = []
      let collectionLink = false
      let collectionLinkValue = false
      let collectionLinkLabel = false
      
      if (this.selectedPageIndex >= 0 && this.selectedFieldIndex !== false)
      {
        console.log(this.formList[this.selectedPageIndex].fields[this.selectedFieldIndex].spec['x-ui'].form.options)
        source = this.formList[this.selectedPageIndex].fields[this.selectedFieldIndex].spec['x-ui'].form.options
      }
      if (config.type === 'number') {
        const control = new NumberCurrencyField({
          vueComponent: this,
          config
        })
        Vue.set(this.renderedFields, config.id, control)
        this.renderedFields[config.id].render()
        // createNumberField
      } 
      else if (config.type === 'text') {
        // createSimpleTextField.bind(this)
        const control = new SimpleTextField({
          vueComponent: this,
          config
        })
        Vue.set(this.renderedFields, config.id, control)
        this.renderedFields[config.id].render()
        
      }
      else if (config.type === 'select') {
        // createSimpleTextField.bind(this)
        const control = new SimpleSelectField({
          vueComponent: this,
          config,
          source: source,
          collectionLink: collectionLink,
          collectionLinkValue: collectionLinkValue,
          collectionLinkLabel: collectionLinkLabel
        })
        Vue.set(this.renderedFields, config.id, control);

        (async () => {
          await this.renderedFields[config.id].render()
        })()
        
        
      }
      else if (config.type === 'arrayOfSchema') {
        // createArraySchemaField.bind(this)
        const control = new ArraySchemaField({
          vueComponent: this,
          config,
          entity: config.entity
        })
        Vue.set(this.renderedFields, config.id, control)
        this.renderedFields[config.id].render()
      }
    },
    addNewOption (selectedPageIndex, selectedFieldIndex) {
      let found = false
      // newOptionText
      if (this.newOptionText === '') return
      console.log(this.formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form)
      console.log(this.formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.options)
      this.formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.options.forEach(o => {
        if (o === this.newOptionText) found = true
      })
      if (found) return
      this.formList[this.selectedPageIndex].fields[this.selectedFieldIndex].spec['x-ui'].form.options.push(this.newOptionText)
      this.newOptionText = ''
    },
    deleteOption (selectedPageIndex, selectedFieldIndex, value) {
      let found = -1
      // newOptionText
      
      console.log(this.formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form)
      console.log(this.formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.options)
      this.formList[selectedPageIndex].fields[selectedFieldIndex].spec['x-ui'].form.options.forEach((o, i) => {
        if (o === value) found = i
      })
      if (found < 0) return
      this.formList[this.selectedPageIndex].fields[this.selectedFieldIndex].spec['x-ui'].form.options.splice(found, 1)
    },
    destroyJQcomponent (config) {
      // console.log('destroy', config)
      if (!$(`#${config.id}`)) return
      this.renderedFields[config.id].destroy()
    },
    isMultiOptionField (type) {
      return isMultiOptionField(type)
    },
    canFormat (type) {
      return canFormat(type)
    },
    canSetLength (type) {
      return canSetLength(type)
    },
    getParenWidth (id) {
      return getParenWidth(id)
    }
  }
};
