/* eslint-disable no-tabs */
/* global session $ */

const jqxWidgetName = 'jqxInput'

export default class SimpleTextField {
  constructor ({
    vueComponent,
    config
  }) {
    this.vueComponent = vueComponent
    this.config = config
    
  }

  render () {
    let jqConfig = {
      placeHolder: this.config.spec.example || '',
      width: this.vueComponent.getParenWidth(this.config.id),
      disabled: !!this.config.spec.readOnly
    }
    if (this.config.spec.maxLength > 0) {
      jqConfig.maxLength = this.config.spec.maxLength
    }
    if (this.config.spec.minLength > 0) {
      jqConfig.minLength = this.config.spec.minLength
    }
    const input = document.createElement('input')
    input.id = this.config.id
    input.type = 'text'
    input.addEventListener('click', function (e) {
      e.stopPropagation()
    })
    document.getElementById(`parent_${this.config.id}`).appendChild(input)
  
    $(`#${this.config.id}`)[jqxWidgetName](jqConfig)
    // $(`#${this.config.id}`).jqxInput('val', this.config.spec.example || '')
  }

  destroy () {
    $(`#${this.config.id}`)[jqxWidgetName]('destroy')
  }
}
