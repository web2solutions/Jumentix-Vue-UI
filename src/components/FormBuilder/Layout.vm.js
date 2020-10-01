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
import 'jqwidgets-framework/jqwidgets/jqxribbon.js'
import 'jqwidgets-framework/jqwidgets/jqxlayout.js'

import * as is from 'is_js'

import session from '../../helpers/session'

window.drag = function (ev) {
  console.log('drag', ev)
  ev.dataTransfer.setData('text', ev.target.id);
}
window.dragging = function (event) {
   
}
window.allowDrop = function (event) {
  // console.log('allowDrop', event)
  event.preventDefault();
}
window.drop = function (ev) {
  console.log('drop', ev)
  ev.preventDefault();
  const data = ev.dataTransfer.getData('text');
  console.log(data)
  // ev.target.appendChild(document.getElementById(data));
}


const vm = {
  components: {
    // VuePerfectScrollbar
  },
  name: 'Form',
  data: () => ({
    propertyPanelWidth: 300,
    fieldTypes: [{ 
      id: 'text_field',
      type: 'text',
      label: 'Text field'
    }, { 
      id: 'text_field2',
      type: 'text',
      label: 'Text field 2'
    }]
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
      // return
      next({
        path: '/login'
      })
    } else {
      next()
    }
  },
  watch: {

  },
  created () {
    // 
  },
  mounted () {
    const fwidth = this.getWidth() - this.propertyPanelWidth
    console.log(this.getWidth())
    console.log(fwidth)
    const layout = [{
      type: 'layoutGroup',
      orientation: 'horizontal',
      items: [{
        type: 'layoutGroup',
        orientation: 'vertical',
        width: `${fwidth}px`,
        items: [{
          type: 'documentGroup',
          items: [{
            type: 'documentPanel',
            title: 'Document 1',
            contentContainer: 'Document1Panel'
          }]
        }]
      }, {
        type: 'tabbedGroup',
        width: `${this.propertyPanelWidth}px`,
        items: [{
          type: 'layoutPanel',
          title: 'Fields',
          contentContainer: 'FieldsPanel'
        }, {
          type: 'layoutPanel',
          title: 'Properties',
          contentContainer: 'PropertiesPanel'
        }]
      }]
    }];
    $('#builderLayout').jqxLayout({
      width: `${this.getWidth()}px`,
      height: `100%`,
      layout: layout
    })
    this.fieldTypes.forEach(fieldConf => this.setButtonField(fieldConf))
    this.startForm()
  },
  methods: {
    setButtonField (conf = {}) {
      const { id, label } = conf
      const parent = document.getElementById('button_fields')
      const input = document.createElement('input')
      input.value = `<span style='font-weight: bold;'>${label}</span>`
      input.type = 'button'
      input.id = id
      parent.appendChild(input)
      // <input value="" type="button" id="jqxHTMLButton" draggable="true" ondragstart="drag(event)" />
      $(`#${id}`).jqxButton({ width: ((this.propertyPanelWidth / 2) - 5), height: 40 })
      document.getElementById(id).setAttribute('draggable', true)
      document.getElementById(id).setAttribute('ondragstart', 'drag(event)')
      document.getElementById(id).style.position = 'relative'
      document.getElementById(id).style.float = 'left' 
    },
    getWidth (ss = 0) {
      if (is.mobile()) {
        const strW = $('#xApp').css('width').replace(/px/gi, '')
        let width = parseInt(strW, 10) - 110 + (ss)
        return width
      } else {
        const strW = $('#xApp').css('width').replace(/px/gi, '')
        const width = parseInt(strW, 10) - 110 + (ss)
        return width
      }
    },
    startForm () {
      let template = [
        {
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
          options: [
            { value: 'California' },
            { value: 'New York' },
            { value: 'Oregon' },
            { value: 'Illinois' },
            { value: 'Texas' }
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
          columns: [
            {
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
      $('#form_viewer').jqxForm({
        template: template,
        value: sampleValue,
        padding: { left: 10, top: 10, right: 10, bottom: 10 }
      });
    }
  }
}
export default vm
