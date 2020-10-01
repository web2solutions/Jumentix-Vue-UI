/* eslint-disable no-tabs */
/* global session $ */

import { getLocalCollection } from '../../../helpers/helpers'

const jqxWidgetName = 'jqxDropDownList'

export default class SimpleSelectField {
  constructor ({
    vueComponent,
    config,
    source = [],
    collectionLink = false,
    collectionLinkValue = false,
    collectionLinkLabel = false
  }) {
    this.vueComponent = vueComponent
    this.config = config
    this.source = source
    this.collectionLink = collectionLink
    this.collectionLinkValue = collectionLinkValue
    this.collectionLinkLabel = collectionLinkLabel
  }

  async getData () {
    let {
      data,
      error
    } = await getLocalCollection(this.collectionLink)
    if (error) {
      console.error(`could not get ${this.entity} collection`)
    }
    return {
      data,
      error
    }
  }

  async render () {
    let jqConfig = {
      width: this.vueComponent.getParenWidth(this.config.id),
      selectedIndex: 0,
      source: this.source,
      // placeHolder: 'Select Item' 
      // spinButtons: true,
      // readOnly: !!this.config.spec.readOnly
    }

    if (typeof this.collectionLink === 'string')
    {
      if (this.collectionLink !== '' && this.collectionLink !== 'NONE')
      {
        if (this.collectionLinkValue !== false && this.collectionLinkLabel !== false)
        {
          let {
            data,
            error
          } = await getLocalCollection(this.collectionLink)
          if (error) {
            console.error(`could not get ${this.entity} collection`)
          }
          if (!error) {
            jqConfig.displayMember = this.collectionLinkLabel
            jqConfig.valueMember = this.collectionLinkValue
            this.source = data
          }
        }
      }
    }

    console.warn('-----> jqConfig', jqConfig)
    
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
    console.log('DESTROY', $(`#${this.config.id}`)[jqxWidgetName])
    $(`#${this.config.id}`)[jqxWidgetName]('destroy')
  }
}
