/* eslint-disable no-tabs */
/* global session $ */

const jqxWidgetName = 'jqxNumberInput'

export default class NumberCurrencyField {
  constructor ({
    vueComponent,
    config
  }) {
    this.vueComponent = vueComponent
    this.config = config
  }

  render () {
    let jqConfig = {
      width: this.vueComponent.getParenWidth(this.config.id),
      spinButtons: true,
      // readOnly: !!this.config.spec.readOnly
    }
    if (this.config.spec['x-format'] === 'currency') {
      jqConfig.symbol = '$'
    } else if (this.config.spec['x-format'] === 'percentage') {
      jqConfig.symbol = '%'
      jqConfig.decimalDigits = 3
    } else {
      jqConfig.decimalDigits = 3
    }
    const div = document.createElement('div')
    div.id = this.config.id
    div.addEventListener('click', function (e) {
      e.stopPropagation()
    })
    document.getElementById(`parent_${this.config.id}`).appendChild(div)

    $(`#${this.config.id}`)[jqxWidgetName](jqConfig)
    // $(`#${this.config.id}`).jqxNumberInput('val', this.config.spec.example || 0.0)
  }

  destroy () {
    $(`#${this.config.id}`)[jqxWidgetName]('destroy')
  }
}
