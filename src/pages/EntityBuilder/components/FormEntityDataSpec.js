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
// isChild,
// isSchema,
// getFieldCollectionSettings,
// getIconClass
} from '../../../helpers/helpers'

export default class FormEntityDataSpec {
  constructor ({
    wrapper = null,
    treeBuilderOnSelectItem = () => { }
  }) {
    this.wrapper = wrapper
    this.formConfig = [
      { type: 'settings', position: 'label-right' },
      {
        type: 'block',
        list: [
          { type: 'radio', label: 'Generate Mongoose Model', name: 'model', value: 'mongoose' },
          { type: 'radio', label: 'Generate Sequelize Model', name: 'model', value: 'sequelize' },
          { type: 'checkbox', label: 'Generate Cassandra Model', name: 'cassandra' },
          { type: 'checkbox', label: 'Generate Elastic Model', name: 'elastic' }
        ]
      }
    ]
    this.form = null
    console.error(' FormEntityDataSpec constructor() ')
  }

  buildForm () {
    this.form = this.wrapper.attachForm(this.formConfig)
  }

  render () {
    // this.formConfig = []
    this.buildForm()
    console.error(' FormEntityDataSpec render() ')
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
