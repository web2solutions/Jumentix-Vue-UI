import {
  getForeignCollection,
  getFormType,
  getLocalCollection,
  setDataFields
} from '../../../../helpers/helpers'

/* global $ */
import Vue from 'vue'

export function busListBoxSelect (obj) {
  (async (obj) => {
    const {
      // entity,
      // name,
      // property,
      // swagger,
      definition,
      // selectedItem,
      // selectedDocument,
      selectedValue,
      // selectedLabel,
      dependents
    } = obj

    for (let x = 0; x < dependents.length; x++) {
      const dependency = dependents[x]
      const dependencyDefinition = definition.properties[dependency.targetField]
      const collConf = getForeignCollection(dependencyDefinition)
      const datafields = setDataFields(dependencyDefinition.properties)
      const xuiType = getFormType(dependencyDefinition)
      const {
        error,
        data
      } = await getLocalCollection(collConf.collection)
      if (error) {
        console.error(error)
        continue
      }
      const sdata = {}
      sdata[dependency.remoteKey] = selectedValue
      const source = {
        localdata: data || [],
        datatype: 'array',
        datafields: datafields,
        id: '_id',
        data: sdata
      }
      // eslint-disable-next-line
      let dataAdapter = new $.jqx.dataAdapter(source, {
        beforeLoadComplete: function (records) {
          const filteredRecords = []
          for (let i = 0; i < records.length; i++) {
            if (records[i][dependency.remoteKey] === selectedValue) {
              filteredRecords.push(records[i])
            }
          }
          return filteredRecords
        }
      })
      Vue.set(this.dataAdapters, collConf.collection, dataAdapter)
      // this.form
      const jqField = this.form.jqxForm('getComponentByName', dependency.targetField)
      // console.log(jqField);
      if (xuiType === 'autocomplete') {
        jqField.jqxInput({
          source: this.dataAdapters[collConf.collection]
        })
      } else if (xuiType === 'combobox' || xuiType === 'combo') {
        jqField.jqxComboBox({
          source: this.dataAdapters[collConf.collection],
          autoDropDownHeight: !(this.dataAdapters[collConf.collection].records.length > 10)
        })
      } else if (xuiType === 'grid') {
        //
      } else if (xuiType === 'multipleselect') {
        jqField.jqxListBox({
          source: this.dataAdapters[collConf.collection]
        })
      }
    }
  })(obj)
}
