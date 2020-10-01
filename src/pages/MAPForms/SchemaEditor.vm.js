/* eslint no-prototype-builtins: 0 */
/* global session $ */

import { canFormat, canSetLength, isMultiOptionField, getParenWidth } from '../../helpers/helpers'

const vm = {
  components: {
    // VuePerfectScrollbar
  },
  name: 'SchemaEditor',
  props: [
    'selectedEntitySchemas',
    'bus',
    'selectedPageIndex',
    'store',
    'ftypes',
    'textFormats'
  ],
  data: () => ({
    activeSchemaEditorTab: 0,
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
            'selection-limit': 1
          },
          grid: {
            hide: true,
            label: '',
            width: 0
          }
        }
      }
    }
  }),
  computed: {
    swagger () {
      return this.$store.state.swagger
    },
    session () {
      return this.$store.state.session
    },
    selectedField () {
      return this.$store.state.FormBuilder ? this.$store.state.FormBuilder.selectedField : 'xxxxxxx'
    },
  },
  watch: {
    
  },
  created () {
    //
    this.bus.$on('selectField', (field) => { 
      console.error('SchemaEditor.vm selectField', field)
      this.startTreeFields()
      // this.store.commit('fmSetSelectedField', field)
      // this.selectedField = field
    })
  },
  mounted () {
    //
    
    // console.warn('mounted Schema Editor', this.selectedField)
    
    this.startTreeFields()
  },
  methods: {
    startTreeFields () {
      console.warn('startTreeFields ', this.selectedField)

      this.selectedField.fields.map(field => {
        return {
          label: field.name,
          id: field.id,
          value: field.id,
        }
      })
      /* this.formList.map(page => {
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
      }) */
      try {
        $('#schemaFieldsTree').jqxTree('destroy')
      } catch (error) {
        
      }

      const div = document.createElement('div'); 
      div.id = 'schemaFieldsTree'
      document.getElementById(`parent_schemaFieldsTree`).appendChild(div)
      
      $('#schemaFieldsTree').jqxTree({
        source: this.selectedField.fields.map(field => {
          return {
            label: `${field.spec['x-ui'].form.label} (${field.spec.type})` + (field.spec.format ? ` - ${field.spec.format}` : ''),
            id: field.id,
            value: field.name,
          }
        }),
        width: '100%',
        height: '100%'
      });
      $('#schemaFieldsTree').on('itemClick', event =>
      {
        this.activeSchemaEditorTab = 1
      });
      
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
}
export default vm
