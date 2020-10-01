/* eslint no-prototype-builtins: 0 */
/* eslint new-cap: 0 */
/* eslint-disable no-tabs */
/* global session $ */

let template = [{
  bind: 'firstName',
  type: 'text',
  label: 'First name',
  required: true,
  labelWidth: '80px',
  width: '250px',
  info: 'Enter first name',
  infoPosition: 'right'
},
{
  bind: 'lastName',
  type: 'text',
  label: 'Last name',
  required: true,
  labelWidth: '80px',
  width: '250px',
  info: 'Enter last name'
},
{
  bind: 'company',
  type: 'text',
  label: 'Company',
  required: false,
  labelWidth: '80px',
  width: '250px'
},
{
  bind: 'address',
  type: 'text',
  label: 'Address',
  required: true,
  labelWidth: '80px',
  width: '250px'
},
{
  bind: 'city',
  type: 'text',
  label: 'City',
  required: true,
  labelWidth: '80px',
  width: '250px'
},
{
  bind: 'state',
  type: 'option',
  label: 'State',
  required: true,
  labelWidth: '80px',
  width: '250px',
  component: 'jqxDropDownList',
  options: [{
    value: 'California'
  },
  {
    value: 'New York'
  },
  {
    value: 'Oregon'
  },
  {
    value: 'Illinois'
  },
  {
    value: 'Texas'
  }
  ]
},
{
  bind: 'zip',
  type: 'text',
  label: 'Zip code',
  required: true,
  labelWidth: '80px',
  width: '250px'
},
{
  type: 'blank',
  rowHeight: '10px'
},
{
  columns: [{
    type: 'button',
    text: 'Sign up',
    width: '90px',
    height: '30px',
    rowHeight: '40px',
    columnWidth: '50%',
    align: 'right'
  },
  {
    type: 'button',
    text: 'Cancel',
    width: '90px',
    height: '30px',
    rowHeight: '40px',
    columnWidth: '50%'
  }
  ]
}
];
let sampleValue = {
  firstName: 'John',
  lastName: 'Scott',
  address: '1st Ave SW',
  company: 'N/A',
  city: 'San Antonio',
  state: 'Texas',
  zip: '78209'
};

import { getForeignCollection, isSchema, setGridHeaders } from '../../../helpers/helpers'

export default class ArraySchemaField {
  constructor ({
    vueComponent,
    config,
    entity
  }) {
    this.vueComponent = vueComponent
    this.config = config
    this.data = []
    this.source = {}
    this.datafields = []
    this.entity = entity
    this.grid = null
    this.source = null
    this.headers = []
    this.splitter = null
  }

  render () {
    this.startData()
    this.startDataSource()
    this.startDataAdapter()
    this.createWrapper()
    this.startSplitter()
    this.startForm()
    this.startGrid()
  }

  createWrapper () {
    const div_splitter = document.createElement('div')
    div_splitter.id = `splitter_${this.config.id}`
    div_splitter.addEventListener('click', event => event.stopPropagation())

    const div_grid = document.createElement('div')
    div_grid.id = this.config.id
    div_grid.addEventListener('click', event => event.stopPropagation())

    const div_form = document.createElement('div')
    div_form.id = `form_${this.config.id}`
    div_form.style.overflow = 'auto'
    div_form.addEventListener('click', event => event.stopPropagation())

    div_splitter.appendChild(div_grid)
    div_splitter.appendChild(div_form)

    document.getElementById(`parent_${this.config.id}`).appendChild(div_splitter)
  }

  startData () {
    this.data = []
  }

  setHeaders () {
    this.headers = setGridHeaders(this.config.spec.spec.properties)
  }

  setDataFields (properties) {
    const fields = []
    for (const name in properties) {
      if (properties.hasOwnProperty(name)) {
        // if (name === '_id') continue;
        const property = properties[name]
        const type = property.type
        const foreignCollection = getForeignCollection(property)
        const fieldConf = { name, type }
        fields.push(fieldConf)
      }
    }
    console.error(fields)
    return fields
  }

  startDataSource () {
    
    const fields = this.setDataFields(this.config.spec.spec.properties)
    fields.forEach(f => this.datafields.push(f))
    // console.log('startDataSource', this.config.spec.spec.properties)
    this.source = {
      localdata: this.data,
      datatype: 'array',
      id: '_id',
      datafields: this.datafields,
    }
  }

  startDataAdapter () {
    this.dataAdapter = new $.jqx.dataAdapter(this.source)
  }

  startSplitter () {
    this.splitter = $(`#splitter_${this.config.id}`)
    this.splitter.jqxSplitter({ 
      width: '100%', 
      height: 200, 
      orientation: 'horizontal', 
      panels: [{ size: 200 }, { size: 0 }] 
    })
  }

  startForm () {
    this.form = $(`#form_${this.config.id}`)
    this.form.jqxForm({
      template: template,
      value: sampleValue,
      padding: {
        left: 10,
        top: 10,
        right: 10,
        bottom: 10
      }
    })

    this.form.on('buttonClick', (event) => {
      let args = event.args;
      let text = args.text // clicked button's text.;
      let name = args.name // clicked button's name.;
      this.splitter.jqxSplitter('expand')
    });

    // 
  }

  gridToolbarRenderer (toolbar) {
    const self = this
    let container = $("<div style='padding: 5px'></div>")
    toolbar.append(container)
    container.append(`<input id="addrowbutton_${self.config.id}" type="button" value="add" />`)
    container.append(`<input style="margin-left: 5px;" id="updaterowbutton_${self.config.id}" type="button" value="update" />`)
    container.append(`<input style="margin-left: 5px;" id="deleterowbutton_${self.config.id}" type="button" value="delete" />`)
        
    $(`#addrowbutton_${self.config.id}`).jqxButton()
    $(`#deleterowbutton_${self.config.id}`).jqxButton()
    $(`#updaterowbutton_${self.config.id}`).jqxButton()

    $(`#updaterowbutton_${self.config.id}`).on('click', (event) => {
      event.stopPropagation()
      self.splitter.jqxSplitter('collapse')
    })

    $(`#addrowbutton_${self.config.id}`).on('click', (event) => {
      event.stopPropagation()
      self.splitter.jqxSplitter('collapse')
    })

    $(`#deleterowbutton_${self.config.id}`).on('click', (event) => {
      event.stopPropagation()
      self.splitter.jqxSplitter('expand')
    })
  }

  startGrid () {
    // console.log('startGrid', this.config)
    const self = this
    this.setHeaders()
    this.grid = $(`#${this.config.id}`)
    this.grid.jqxGrid({
      width: this.vueComponent.getParenWidth(this.config.id),
      height: 195,
      source: this.dataAdapter,
      showtoolbar: true,
      rendertoolbar: toolbar => self.gridToolbarRenderer(toolbar),
      columns: this.headers
    })
  }

  destroy () {
    $(`#${this.config.id}`).jqxGrid('destroy')
    $(`#form_${this.config.id}`).jqxForm('destroy')
    $(`#splitter_${this.config.id}`).jqxSplitter('destroy')
  }
}
