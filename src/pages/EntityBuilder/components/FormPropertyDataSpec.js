import {
// getEntities,
// getEntityProperties,
// getFormType,
// getGridLabel,
// getGridWidth,
// getGridColAlign,
// isGridHide,
// getFormEditable,
// getFormMask,
// getFormat,
// getFormIsUploader,
// getSchema,
isChild
// isSchema,
// getFieldCollectionSettings,
// getIconClass
} from '../../../helpers/helpers'

export default class FormPropertyDataSpec {
  constructor ({
    wrapper = null,
    treeBuilderOnSelectItem = () => { },
    swagger = {}
  }) {
    this.wrapper = wrapper
    this.swagger = swagger
    this.formConfig = [
      { type: 'settings', position: 'label-left' },
      {
        type: 'block',
        list: [
          {
            type: 'combo',
            label: 'Data type',
            name: 'type',
            options: [
              { text: 'String', value: 'String', selected: true },
              { text: 'Number', value: 'Number' },
              { text: 'Date', value: 'Date' },
              { text: 'Boolean', value: 'Boolean' },
              { text: 'Array', value: '[]' },
              { text: 'Object', value: '{}' },
              { text: 'ObjectId', value: 'ObjectId' }
            ]
          },
          {
            type: 'combo',
            label: 'Reference collection',
            name: 'ref',
            options: [{ text: 'Please select', value: 'none' }, ...Object.keys(this.swagger.definitions).filter(key => { return key.indexOf('_') === -1 && !isChild(this.swagger.definitions[key]) }).map(key => { return { text: key, value: key } })]
          },
          { type: 'checkbox', label: 'Populate', name: 'populate', position: 'label-right' },
          { type: 'checkbox', label: 'Required', name: 'required', position: 'label-right' }
        ]
      }
      // ObjectId, ref
      // { type: 'radio', label: 'Generate Mongoose Model', name: 'model', value: 'mongoose' },
      // { type: 'radio', label: 'Generate Sequelize Model', name: 'model', value: 'sequelize' },
      // { type: 'checkbox', label: 'Generate Cassandra Model', name: 'cassandra' },
      // { type: 'checkbox', label: 'Generate Elastic Model', name: 'elastic' }
    ]
    this.form = null
    console.error(' FormPropertyDataSpec constructor() ')
  }

  buildForm () {
    this.form = this.wrapper.attachForm(this.formConfig)
  }

  render () {
    // this.formConfig = []
    this.buildForm()
    console.error(' FormPropertyDataSpec render() ')
  }

  destroy () {
    if (this.form) {
      try {
        this.form.unload()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
