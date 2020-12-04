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

export default class FormPropertyGuiSpec {
  constructor ({
    wrapper = null,
    treeBuilderOnSelectItem = () => { }
  }) {
    this.wrapper = wrapper
    this.formConfig = [
      { type: 'settings', position: 'label-right' },
      // { type: 'checkbox', label: 'Generate CRUD', name: 'crud' },
      // { type: 'checkbox', label: 'Generate Dashboard', name: 'dashboard' }
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
