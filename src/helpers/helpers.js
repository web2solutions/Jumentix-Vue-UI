/* global $ flatpickr */
/* eslint-disable */
/* eslint no-prototype-builtins: 0 */
import * as ObjectID from 'bson-objectid'
import * as is from 'is_js'

import Mediator from '../Mediator'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import Vue from 'vue'
import moment from 'moment-timezone'
import session from './session'

// import translate from 'translate'


// export const bus = new Vue();
export function isNumber (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}
export function isGridHide (property) {
  if (!property) return true
  if (property['x-ui']) {
    if (property['x-ui'].grid) {
      return property['x-ui'].grid.hide === true
    }
  }
  return true
}
export function getGridWidth (property) {
  if (!property) return 0
  if (property['x-ui']) {
    if (property['x-ui'].grid) {
      if (typeof property['x-ui'].grid.width !== 'undefined') {
        return property['x-ui'].grid.width === '*' ? '100%' : property['x-ui'].grid.width
      }
    }
  }
  return 0
}
export function getGridColAlign (property) {
  if (!property) return 'left'
  const type = getFormType(property)
  if (type === 'currency' || type === 'number' || type === 'integer') {
    return 'right'
  }
  if (property['x-ui']) {
    if (property['x-ui'].grid) {
      if (typeof property['x-ui'].grid.align !== 'undefined') {
        return property['x-ui'].grid.align
      }
    }
  }
  return 'left'
}
export function getGridLabel (property) {
  if (!property) return ''
  if (property['x-ui']) {
    if (property['x-ui'].grid) {
      return property['x-ui'].grid.label ? property['x-ui'].grid.label : property.description
    }
  }
  return property.description
}
export function getDefaultGridColumnSettings (prop, property = false) {
  const settings = {
    text: property ? property.description : 'no description',
    align: getGridColAlign(property),
    sortable: true,
    id: prop,
    hide: isGridHide(property),
    width: getGridWidth(property),
    label: getGridLabel(property) !== '' ? getGridLabel(property) : prop,
    $collection: getFieldCollectionSettings(property)
  }
  return settings
}
export function setGriHeaders (component, properties) {
  if (!component.hideFields) component.hideFields = []
  if (!component.hideSubFields) component.hideSubFields = {}
  for (const prop in properties) {
    if (properties.hasOwnProperty(prop)) {
      const property = properties[prop]
      const settings = getDefaultGridColumnSettings(prop, property)
      if (property.type === 'boolean') {
        component.forms.crud.user_values[prop] = false
        component.forms.crud.defaultItem[prop] = false
        component.form_search.user_values[prop] = false
      } else if (property.type === 'date') {
        const d = null
        component.forms.crud.user_values[prop] = d
        component.forms.crud.defaultItem[prop] = d
        component.form_search.user_values[prop] = d
        component.form_search.user_values[prop + '_2'] = d
      } else if (property.type === 'base64') {
        const d = null // '/static/avatar.png';
        component.forms.crud.user_values[prop] = d
        component.forms.crud.defaultItem[prop] = d
        // component.form_search.user_values[prop] = d;
        // component.form_search.user_values[prop + '_2'] = d;
      } else if (property.type === 'date-time') {
        const d = null
        component.forms.crud.user_values[prop] = d
        component.forms.crud.defaultItem[prop] = d
        component.form_search.user_values[prop] = d
        component.form_search.user_values[prop + '_2'] = d
      } else if (property.type === 'number') {
        component.forms.crud.user_values[prop] = ''
        component.forms.crud.defaultItem[prop] = ''
        component.form_search.user_values[prop] = ''
        component.form_search.user_values[prop + '_2'] = ''
      } else if (property.type === 'array') {
        component.forms.crud.user_values[prop] = []
        component.forms.crud.defaultItem[prop] = []
        component.form_search.user_values[prop] = []
      } else {
        component.forms.crud.user_values[prop] = ''
        component.forms.crud.defaultItem[prop] = ''
        component.form_search.user_values[prop] = ''
      }
      component.forms.crud.newItem[prop] = ''
      component.form_search.operators[prop] = 'eq'
      component.headers.push(settings)
    }
  }
}
export function mountDataForGrid (_headers, data = []) {
  // const data = JSON.parse(JSON.stringify(_data));
  const headers = JSON.parse(JSON.stringify(_headers))
  const hide = headers.filter(column => {
    return column.hide === true
  })
  const notHide = headers.filter(column => {
    return column.hide !== true
  })
  // // // console.log('mountDataForGrid --------------->', data);
  // // // console.log('headers', headers);
  const records = !data.map ? [] : data.map(doc => {
    for (let x = 0; x < hide.length; x++) {
      const column = hide[x]
      delete doc[column.id]
    }
    for (let x = 0; x < notHide.length; x++) {
      const column = notHide[x]
      // // // console.log('column', column);
      // flatpickr.formatDate(new Date(value), 'F j, Y')
      doc[column.id] = doc[column.id] || ''
    }
    // format record
    return doc
  })
  // // // console.log('records', records);
  return records
}
export async function mountLabelsForGrid (subFieldDefinition, _headers = [], data = []) {
  // const data = JSON.parse(JSON.stringify(_data));
  const headers = JSON.parse(JSON.stringify(_headers))
  const hide = headers.filter(column => {
    return column.hide === true
  })
  const notHide = headers.filter(column => {
    return column.hide !== true
  })
  const nDocs = []
  // // // console.log('mountDataForGrid --------------->');
  // // // console.log('headers', headers);
  for (let y = 0; y < data.length; y++) {
    const doc = data[y]
    for (let x = 0; x < hide.length; x++) {
      const column = hide[x]
      delete doc[column.id]
    }
    for (let x = 0; x < notHide.length; x++) {
      const column = notHide[x]
      // // // console.log('column', column);
      const definition = subFieldDefinition.properties[column.id]
      // // // console.log(definition);
      doc[column.id] = doc[column.id] || ''
      if (definition['x-ui']) {
        /** if (definition['x-ui']['collection-link']) {
          let collection = definition['x-ui']['collection-link'];
          let labelField = definition['x-ui']['collection-link-label'];
          let valueField = definition['x-ui']['collection-link-value'];

          let {
            error,
            data
          } = await getOnLocalCollection(collection, doc[column.id]);
          // // // console.log(error, data);
          // // // console.log('labelField', labelField);
          if (data) {
            let keys = labelField.split(',');
            let text = '';
            keys.forEach(k => {
              text += ' ' + data[k.toString().trim()].toString().trim()
            });
            doc[column.id] = text.toString().trim();
          }
        } */
      }
      // // // console.log('>>>>>>>>>>>>>>>>', definition);
      // // // console.log('>>>>>>>>>>>>>>>>', definition.type);
      if (definition.format === 'date-time') {
        if (isDate(doc[column.id])) doc[column.id] = flatpickr.formatDate(new Date(doc[column.id]), 'F j, Y H:i')
      }
      if (definition.format === 'date') {
        if (isDate(doc[column.id])) doc[column.id] = flatpickr.formatDate(new Date(doc[column.id]), 'F j, Y')
      }
    }
    // // // console.log('XXXXXXXXXXXXXXX', doc);
    nDocs.push(doc)
  }
  // // // console.log('records', records);
  return nDocs
}
export function mountDataForGridBasedOnSawgger (swagger, entity, _headers, _data) {
  // // // console.log('mountDataForGridBasedOnSawgger', entity);
  // // // console.log('_headers', _headers);
  const data = JSON.parse(JSON.stringify(_data))
  const headers = typeof _headers !== 'undefined' ? JSON.parse(JSON.stringify(_headers)) : []
  // const headers = JSON.parse(JSON.stringify(_headers));
  const hide = headers.filter(column => {
    return column.hide === true
  })
  const entityDefinition = swagger.definitions[entity]
  const entityProperties = entityDefinition.properties
  const records = data.map(doc => {
    for (const columnName in entityProperties) {
      if (entityProperties.hasOwnProperty(columnName)) {
        const fieldDefinition = entityProperties[columnName]
        const formatedValue = formatGridValueBasedOnDefinition(fieldDefinition, doc[columnName])
        doc[columnName] = formatedValue
      } else {
        if (doc[columnName]) {
          // // // console.log('delete', columnName);
          delete doc[columnName]
        }
      }
    }
    for (let x = 0; x < hide.length; x++) {
      const column = hide[x]
      if (typeof doc[column.id] !== 'undefined') {
        // // // console.log('delete', column.id);
        delete doc[column.id]
      }
    }
    for (const columnName in doc) {
      if (doc.hasOwnProperty(columnName)) {
        if (typeof entityProperties[columnName] === 'undefined') {
          delete doc[columnName]
        }
      }
    }
    // // // console.log(doc);
    return doc
  })
  return records
}
export function mountDataForGridWithId (_headers, _data) {
  const data = JSON.parse(JSON.stringify(_data))
  const headers = typeof _headers !== 'undefined' ? JSON.parse(JSON.stringify(_headers)) : []
  // const headers = JSON.parse(JSON.stringify(_headers));
  const hide = headers.filter(column => {
    return column.hide === true
  })
  const records = data.map(doc => {
    // // // console.log('doc._id', doc._id);
    // // // console.log('doc', doc);
    for (let x = 0; x < hide.length; x++) {
      const column = hide[x]
      if (column.id !== '_id') delete doc[column.id]
    }
    // // // console.log('doc._id', doc._id);
    return doc
  })
  return records
}
export function isDate (date) {
  return !!((new Date(date) !== 'Invalid Date' && !isNaN(new Date(date))))
}
export function formatValueBasedOnDefinition (fieldDefinition, value, raw = false) {
  // // // console.log('formatValueBasedOnDefinition', {fieldDefinition, value});
  if (fieldDefinition.type === 'string') {
    const format = fieldDefinition.format || false
    if (format === 'date') {
      if (isDate(value)) {
        if (!raw) value = new Date(value).toISOString()
        if (!raw) value = moment(value).format('MM-DD-YYYY')
        // if (raw) value = value
        if(raw) value = value.toString().split('T')[0]
      } else {
        value = null;
      }
    } else if (format === 'date-time') {
      if (isDate(value)) {
        if (!raw) value = new Date(value).toISOString()
        if (!raw) value = moment(value).format('MM-DD-YYYY  HH:mm')
      } else {
        value = null;
      }
    } else if (format === 'base64') {
      if (value === '' || value === null) {
        value = '/static/avatar.png' // '/static/avatar.png';
      }
    }
    if (fieldDefinition.type === 'number') {
      if (!value) {
        value = 0
      } else if (value === '' || value === null) {
        value = 0
      } else if (typeof value === 'string') {
        value = Number(value)
      }
    }
  } else if (fieldDefinition.type === 'array') {
    if (is.not.undefined(value)) {
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value)
          if (!Array.isArray(value)) {
            throw new Error('is not a string array')
          }
        } catch (e) {
          if (value.toString(', ').indexOf() > 0) {
            value = value.toString().split(', ')
          } else if (value.toString(',').indexOf() > 0) {
            value = value.toString().split(',')
          } else {
            value = [value]
          }
        }
      }
    }
  } else if (fieldDefinition.type === 'object') {
    if (!is.object(value)) {
      value = {}
    }
  }
  // // // console.log(fieldDefinition, value);
  return value
}
export function formatGridValueBasedOnDefinition (fieldDefinition, value) {
  const format = fieldDefinition.format || false
  if (format === 'date') {
    if (isDate(value)) {
      value = moment.tz(value, session.user().timezone).format('ll')
    } else {
      // value = '';
    }
  } else if (format === 'date-time') {
    if (isDate(value)) {
      value = moment.tz(value, session.user().timezone).format('llll')
    } else {
      // value = '';
    }
  }
  // // // console.log(fieldDefinition, value);
  return value
}
export function formatFullRecordBasedOnSwagger (entityDefinition, record, raw = false) {
  // console.log({ entityDefinition, record })
  record = JSON.parse(JSON.stringify(record))
  const entityProperties = entityDefinition.properties
  const fieldsName = Object.keys(entityDefinition.properties)
  for (const columnName in record) {
    if (record.hasOwnProperty(columnName)) {
      if (fieldsName.indexOf(columnName) < 0) {
        delete record[columnName]
        continue
      }
      const fieldDefinition = entityProperties[columnName]
      const formatedValue = formatValueBasedOnDefinition(fieldDefinition, record[columnName], raw)
      record[columnName] = formatedValue
    }
  }
  return record
}
export function getMaxLength (property) {
  if (!property) return false
  if (property.maxLength) {
    return property.maxLength
  }
  return false
}
export function getMinLength (property) {
  if (!property) return false
  if (property.minLength) {
    return property.minLength
  }
  return false
}
export function formatRecordBasedOnSwagger (entityDefinition, record, mode = 'create', raw = false) {
  // console.log({ entityDefinition, record })
  record = JSON.parse(JSON.stringify(record))
  const entityProperties = entityDefinition.properties
  const fieldsName = Object.keys(entityDefinition.properties)
  for (const columnName in record) {
    if (record.hasOwnProperty(columnName)) {
      if (fieldsName.indexOf(columnName) < 0) {
        delete record[columnName]
        continue
      }
      const fieldDefinition = entityProperties[columnName]
      const property = fieldDefinition
      const isEditable = getFormEditable(property)
      const minLength = getMinLength(property)
      const readOnly = property.readOnly
      if (mode === 'edit') {
        if (!isEditable) {
          // some 'non editable fields' may be required properties
          // delete record[columnName]
          // continue
        }
      }
      if (readOnly) {
        delete record[columnName]
        continue
      }
      if (minLength) {
        if (record[columnName].toString().length < minLength) {
          throw new Error(`${columnName} must have at least ${minLength} chars.`)
        }
      }
      const formatedValue = formatValueBasedOnDefinition(fieldDefinition, record[columnName], raw)
      record[columnName] = formatedValue
    }
  }
  return record
}
export function mountRecordBasedOnSwagger (component, record) {
  const entityDefinition = component.swagger.definitions[component.entity]
  const formatedRecord = formatRecordBasedOnSwagger(entityDefinition, record)
  // // // console.log('formatedRecord', formatedRecord);
  return formatedRecord
}
export function formatPayloadValueBasedOnDefinition (fieldDefinition, value) {
  const format = fieldDefinition.format || false
  if (format === 'date') {
    if (isDate(value)) {
      value = new Date(value).toISOString().substr(0, 10)
    } else {
      // value = '';
    }
  }
  if (format === 'date-time') {
    if (isDate(value)) {
      value = new Date(value).toISOString()
    } else {
      // value = '';
    }
  }
  // // // console.log(fieldDefinition, value);
  return value
}
/**
 * Function formatPayloadBasedOnSwagger
 * @param {*} component
 * @param {*} entityDefinition
 * @param {*} record
 */
function formatPayloadBasedOnSwagger (component, entityDefinition, record) {
  record = JSON.parse(JSON.stringify(record))
  const entityProperties = entityDefinition.properties
  const fieldsName = Object.keys(entityDefinition.properties)
  for (const columnName in record) {
    if (record.hasOwnProperty(columnName)) {
      if (fieldsName.indexOf(columnName) < 0) {
        delete record[columnName]
        continue
      }
      const fieldDefinition = entityProperties[columnName]
      // // // console.log(columnName, record[columnName]);
      // // // console.log('fieldDefinition', fieldDefinition);
      const format = fieldDefinition.format || false
      const type = fieldDefinition.type || 'string'
      if (columnName === '_id') {
        if (record[columnName] === '' || record[columnName] === null) {
          delete record[columnName]
          console.warn(`${columnName} is bad formated and was removed from payload.`, record[columnName])
          continue
        }
      }
      if (format === 'date') {
        if (!isDate(record[columnName])) {
          delete record[columnName]
          console.warn(`${columnName} is bad formated and was removed from payload.`, record[columnName])
        } else {
          record[columnName] = new Date(record[columnName]).toISOString().substr(0, 10)
        }
      }
      if (format === 'date-time') {
        if (!isDate(record[columnName])) {
          delete record[columnName]
          console.warn(`${columnName} is bad formated and was removed from payload.`, record[columnName])
        } else {
          record[columnName] = new Date(record[columnName]).toISOString()
        }
      }
      if (type === 'integer' || format === 'integer') {
        if (!isNumber(record[columnName])) {
          delete record[columnName]
          console.warn(`${columnName} is bad formated and was removed from payload.`, record[columnName])
        } else {
          record[columnName] = parseInt(record[columnName])
        }
      }
      if (type === 'number' || format === 'number') {
        if (!isNumber(record[columnName])) {
          delete record[columnName]
          console.warn(`${columnName} is bad formated and was removed from payload.`, record[columnName])
        } else {
          record[columnName] = parseFloat(record[columnName])
        }
      }
      if (fieldDefinition['x-ui']) {
        if (fieldDefinition['x-ui']['collection-link']) {
          if (record[columnName] === null || record[columnName] === '') {
            delete record[columnName]
            console.warn(`${columnName} is bad formated and was removed from payload.`, record[columnName])
          }
        }
      }
      if (type === 'array') {
        if (fieldDefinition.items) {
          if (fieldDefinition.items.$ref) {
            const refArray = fieldDefinition.items.$ref.split('/')
            // sub document schema name
            const schemaName = refArray[refArray.length - 1]
            const subFieldDefinition = component.swagger.definitions[schemaName]
            record[columnName] = record[columnName].map(r => {
              return formatPayloadBasedOnSwagger(component, subFieldDefinition, r)
            })
          }
        }
      }
    }
  }
  return record
}
/**
 * Public Function mountPayloadBasedOnSwagger
 * prepare payload data to send to server and avoid validation issues. Internally calls formatPayloadBasedOnSwagger
 * @param {*} component
 * @param {*} record
 */
export function mountPayloadBasedOnSwagger (component, entity, record, isFormSimple = false, isHideOnFormSimpleSave = true) {
  // // // console.log('mountPayloadBasedOnSwagger');
  // // // console.log(entity, record);
  const entityDefinition = component.swagger.definitions[entity]
  for (const prop in entityDefinition.properties) {
    if (prop !== '_id') { if (entityDefinition.properties[prop].readOnly) delete record[prop] }
    if (isFormSimple && (!isHideOnFormSimpleSave)) continue // dont delete hideFields from payload
    for (let x = 0; x < component.hideFields.length; x++) {
      const hiddenField = component.hideFields[x]
      if (hiddenField.toLowerCase() === prop.toLowerCase()) {
        // delete record[prop];
        if (!getFormRequired(entityDefinition, prop)) delete record[prop]
      }
    }
  }
  const formatedRecord = formatPayloadBasedOnSwagger(component, entityDefinition, record)
  // // // console.log('formatedRecord', formatedRecord);
  return formatedRecord
}
// ===================
export function isFormHide (property) {
  if (property) {
    if (property['x-ui']) {
      if (property['x-ui'].form) {
        return property['x-ui'].form.hide === true
      }
    }
  }
  return false
}

export function getFormOptions (property) {
  if (property) {
    if (property['x-ui']) {
      if (property['x-ui'].form) {
        return Array.isArray(property['x-ui'].form.options) ? property['x-ui'].form.options : false
      }
    }
  }
  return false
}

export function isFormMultiple (property) {
  if (property) {
    if (property['x-ui']) {
      if (property['x-ui'].form) { // selection-limit
        if (typeof property['x-ui'].form['selection-limit'] !== 'undefined') { // selection-limit
          return property['x-ui'].form['selection-limit'] === 0
        }
      }
    }
  }
  return false
}
export function isReadOnly (property) {
  if (property) {
    if (property.readOnly) {
      return !!property.readOnly
    }
  }
  return false
}
export function getFormSelectionLimit (property) {
  if (property) {
    if (property['x-ui']) {
      if (property['x-ui'].form) { // selection-limit
        if (typeof property['x-ui'].form['selection-limit'] !== 'undefined') { // selection-limit
          return parseInt(property['x-ui'].form['selection-limit'])
        }
      }
    }
  }
  return -1
}
export function getFormLabel (property) {
  if (property) {
    if (property['x-ui']) {
      if (property['x-ui'].form) {
        return property['x-ui'].form.label ? property['x-ui'].form.label : property.description
      }
    }
  }
  return property.description
}
export function getFormPlaceHolder (property) {
  if (property) {
    if (property['x-ui']) {
      if (property['x-ui'].form) {
        return property['x-ui'].form.example ? property['x-ui'].form.example : ''
      }
    }
  }
  return ''
}
export function getFormRequired (entityDefinition, fieldName) {
  const required = entityDefinition.required || []
  return required.indexOf(fieldName) > -1
}
const vRules = {
  required: value => {
    if (Array.isArray(value)) {
      return value.length > 0 || 'Required.'
    } else {
      return !!value || 'Required.'
    }
  },
  counter: value => value.length <= 20 || 'Max 20 characters',
  email: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid e-mail.'
  }
}
export function getFormRules (entityDefinition, fieldName, property) {
  const rules = []
  const isRequired = getFormRequired(entityDefinition, fieldName)
  if (isRequired) {
    rules.push(vRules.required)
  }
  if (isEmail(property)) {
    rules.push(vRules.email)
  }
  return rules
}
export function getFormat (property) {
  if (property.format) {
    return property.format
  }
  return ''
}
export function getFormMask (property) {
  let mask = ''
  if (property.format) {
    if (property.format === 'date') {
      mask = '####-##-##'
    }
    if (property.format === 'date-time') {
      mask = '####-##-## ##:##'
    }
    if (property.format === 'ssn') {
      mask = '###-##-####'
    }
    if (property.format === 'feid') {
      mask = '##-#######'
    }
    if (property.format === 'password') {
      // mask = '###-##-####';
    }
    if (property.format === 'credit-card') {
      mask = '####-####-####-####'
    }
  }
  if (property) {
    if (property['x-ui']) {
      if (property['x-ui'].form) {
        if (property['x-ui'].form.type === 'date') {
          mask = '####-##-##'
        }
        if (property['x-ui'].form.format === 'date-time') {
          mask = '####-##-## ##:##'
        } else if (property['x-ui'].form.format === 'ssn') {
          mask = '###-##-####'
        }
      }
    }
  }
  return mask
}
export function getFormAccept (property) {
  let accept = false
  if (property['x-ui']) {
    if (property['x-ui'].form) {
      if (property['x-ui'].form.accept) {
        accept = property['x-ui'].form.accept
      }
    }
  }
  return accept
}
export function getFormFileType (property) {
  let type = false
  const allowed = ['avatar', 'image', 'document']
  if (property['x-ui']) {
    if (property['x-ui'].form) {
      if (property['x-ui'].form['media-type']) {
        if (allowed.indexOf(property['x-ui'].form['media-type']) > -1) type = property['x-ui'].form['media-type']
      }
    }
  }
  return type
}
export function getFormEditable (property) {
  let editable = true
  if (typeof property['x-editable'] !== 'undefined') {
    editable = !!property['x-editable']
  }
  return editable
}

export function getIsVirtual (property) {
  let isVirtual = false
  if (typeof property['x-virtual'] !== 'undefined') {
    isVirtual = !!property['x-virtual']
  }
  return isVirtual
}

export function getFormSearchable (property) {
  let editable = true
  if (typeof property['x-searchable'] !== 'undefined') {
    editable = !!property['x-searchable']
  }
  return editable
}
export function getFormIsUploader (property) {
  let uploader = false
  if (typeof property['x-uploader'] === 'boolean') {
    uploader = property['x-uploader']
  }
  return uploader
}
export function getFormSize (property) {
  let size = 5 * 1024 * 1024 // default is 5MB
  if (property['x-ui']) {
    if (property['x-ui'].form) {
      if (property['x-ui'].form['file-size']) {
        if (isNumber(property['x-ui'].form['file-size'])) size = parseFloat(property['x-ui'].form['file-size']) * 1024 * 1024 // convert to kb
      }
    }
  }
  return size
}
export function isEmail (property) {
  if (property) {
    if (property['x-ui']) {
      if (property.format) {
        if (property.format === 'email') {
          return true
        }
      }
      if (property['x-ui'].form) {
        if (property['x-ui'].form.format === 'email') {
          return true
        }
      }
    }
  }
  return false
}
export function getFormType (property) {
  if (!property) return 'text'
  if (property['x-ui']) {
    if (property.type === 'string') {
      if (property.format === 'date') {
        return 'date'
      } else if (property.format === 'date-time') {
        return 'date-time'
      } else if (property.format === 'base64') {
        return 'base64'
      } else if (property.format === 'file') {
        return 'file'
      } else if (property.format === 'password') {
        return 'password'
      }
      return property['x-ui'].form.type || 'text'
    }
    if (property.type === 'number') {
      if (property['x-format'] === 'currency') {
        return 'currency'
      }
      return 'number'
    }
    if (property.type === 'integer') {
      return 'integer'
    }
    return property['x-ui'].form.type || 'text'
  }
  if (property.type === 'string') {
    if (property.format === 'date') {
      return 'date'
    } else if (property.format === 'date-time') {
      return 'date-time'
    } else if (property.format === 'base64') {
      return 'base64'
    } else if (property.format === 'file') {
      return 'file'
    } else if (property.format === 'password') {
      return 'password'
    }
    return 'text'
  } else if (property.type === 'int') {
    return 'integer'
  } else if (property.type === 'integer') {
    return 'integer'
  } else if (property.type === 'number') {
    if (property['x-format'] === 'currency') {
      return 'currency'
    }
    return 'number'
  } else if (property.type === 'boolean') {
    return 'switch'
  } else if (property.type === 'array') {
    return 'select'
  }
  return 'text'
}
export function getFormDefault (property) {
  let defaultValue = '' // string
  if (!property) return ''
  if (property.type === 'string') {
    if (property.format === 'date') {
      const d = null
      defaultValue = d
    } else if (property.format === 'date-time') {
      const d = null
      defaultValue = d
    } else if (property.format === 'base64') {
      defaultValue = null // '/static/avatar.png';
    } else {
      defaultValue = ''
    }
  } else if (property.type === 'array') {
    defaultValue = []
  } else if (property.type === 'object') {
    defaultValue = {}
  } else if (property.type === 'boolean') {
    defaultValue = false
  } else {
    defaultValue = ''
  }
  if (typeof property.default !== 'undefined') {
    defaultValue = property.default
  }
  return defaultValue
}
export function getFormInfo (property) {
  if (!property) return ''
  return property.description
}
export function getFormMaxLength (property) {
  if (!property) return 255
  if (property.maxLength) {
    return property.maxLength || 255
  }
  return 255
}
export function getFormMinLength (property) {
  if (!property) return 0
  if (property.minLength) {
    return property.minLength || 0
  }
  return 0
}
export function isSchema (property = {}) {
  if (typeof property['x-ui'] !== 'undefined') {
    if (typeof property['x-ui'].form.isSchema === 'boolean') { // if is linked to a schema (sub document)
      if (property['x-ui'].form.isSchema) {
        return true
      }
    }
  }
  return false
}

export function isChild (property) {
  if (!property) return false
  if (property['x-child']) {
    return true || false
  }
  return false
}


export function setFieldCollectionSettings (settings, property) {
  // // // console.log(property['x-ui'].form);
  // component.collection_links.push(settings);
  settings.collection = {
    collection: property['x-ui']['collection-link'],
    valueKey: property['x-ui']['collection-link-value'],
    labelKey: property['x-ui']['collection-link-label']
  }
  return settings
}
export function getFieldDependents (property = {}) {
  let dependents = false
  if (typeof property['x-ui'] !== 'undefined') {
    if (typeof property['x-ui'].dependent !== 'undefined') { // if is linked to a schema (sub document)
      dependents = property['x-ui'].dependent
    }
  }
  return dependents
}
export function getFieldDependentOf (property = {}) {
  let dependent = false
  if (typeof property['x-ui'] !== 'undefined') {
    if (typeof property['x-ui'].dependentOf !== 'undefined') { // if is linked to a schema (sub document)
      dependent = property['x-ui'].dependentOf
    }
  }
  return dependent
}
export function getFieldCollectionSettings (property) {
  let collection = false
  if (property['x-ui']) {
    if (property['x-ui']['collection-link']) {
      collection = {
        collection: property['x-ui']['collection-link'],
        valueKey: property['x-ui']['collection-link-value'],
        labelKey: property['x-ui']['collection-link-label']
      }
    }
  }
  return collection
}
export function getForeignCollection (property) {
  let collection = false
  if (property['x-ui']) {
    if (property['x-ui']['collection-link']) {
      collection = {
        collection: property['x-ui']['collection-link'],
        valueKey: property['x-ui']['collection-link-value'],
        labelKey: property['x-ui']['collection-link-label']
      }
    }
  }
  return collection
}
export function getDefaultFormFieldSettings (fieldName, property, entityDefinition, collection = false, schemaName = false) {
  const settings = {
    // value: fields[fieldName].description,
    id: fieldName,
    type: getFormType(property),
    hide: isFormHide(property),
    label: getFormLabel(property),
    info: getFormInfo(property),
    schema: false,
    collection,
    schemaName,
    mask: getFormMask(property),
    accept: getFormAccept(property),
    formFileType: getFormFileType(property),
    editable: getFormEditable(property),
    isUploader: getFormIsUploader(property),
    size: getFormSize(property),
    multiple: isFormMultiple(property),
    required: getFormRequired(entityDefinition, fieldName),
    placeholder: getFormPlaceHolder(property),
    vrules: getFormRules(entityDefinition, fieldName, property),
    minlength: getFormMinLength(property),
    maxlength: getFormMaxLength(property),
    $collection: getFieldCollectionSettings(property),
    $schema: entityDefinition,
    swaggerProperty: property,
    defaultValue: getFormDefault(property)
  }
  // if (settings.default === null) delete settings.default;
  return settings
}
export function getDefaultSubFormObject (name, title, schemaName, schema, collection = false, editable = true, isUploader = false) {
  const settings = {
    name,
    title,
    fields: [],
    values: {},
    labels: {},
    schema,
    collection,
    schemaName,
    isUploader,
    isSchema: false,
    user_values: {},
    headers: {},
    defaultItem: {},
    newItem: {},
    dialog: false,
    editedIndex: -1,
    valid: false,
    editable
  }
  return settings
}
export function setFormFields (component) {
  const entityDefinition = component.swagger.definitions[component.entity]
  const fields = entityDefinition.properties
  for (const fieldName in fields) {
    if (fields.hasOwnProperty(fieldName)) {
      let isHide = false
      for (let x = 0; x < component.hideFields.length; x++) {
        const hiddenField = component.hideFields[x]
        if (hiddenField.toLowerCase() === fieldName.toLowerCase()) {
          isHide = true
        }
      }
      if (isHide) continue
      const property = fields[fieldName]
      if (property['x-ui']) {
        if (property['x-ui'].sub_form_exclude === true) {
          continue
        }
      }
      let settings = getDefaultFormFieldSettings(fieldName, property, entityDefinition)
      if (settings.isUploader) {
        // // // console.log('xxxxx uploader found', fieldName);
        component.uploaders.push(fieldName)
      }
      // if is there custom swagger defintion
      if (typeof property['x-ui'] !== 'undefined') {
        // if linked to another collection
        if (typeof property['x-ui']['collection-link'] === 'string') {
          settings = setFieldCollectionSettings(settings, property)
          // external collection name
          const schemaName = property['x-ui']['collection-link']
          setSubFormFields(component, fieldName, property, schemaName)
        }
        if (typeof property['x-ui'].form.isSchema === 'boolean') { // if is linked to a schema (sub document)
          if (property['x-ui'].form.isSchema) {
            if (property.items) {
              if (property.items.$ref) {
                // // // console.log(property);
                const refArray = property.items.$ref.split('/')
                // sub document schema name
                const schemaName = refArray[refArray.length - 1]
                // console.info('IS SCHEMA', schemaName);
                setSubFormFields(component, fieldName, property, schemaName)
                settings.schema = true
                settings.schemaName = schemaName
              } else {
                console.warn(`${fieldName} is declared as x-ui schema but no schema was provided`)
              }
            } else {
              console.warn(`${fieldName} is declared as x-ui schema but no schema was provided`)
            }
          }
        }
        // if just a simple multiple value fields
        if (typeof property.enum !== 'undefined') {
          settings.type = 'select'
          component.forms.crud.values[fieldName] = []
          property.enum.forEach(option => {
            component.forms.crud.values[fieldName].push(option)
          })
        }
        if (typeof property['x-ui'].form.options !== 'undefined') {
          settings.type = 'select'
          component.forms.crud.values[fieldName] = []
          property['x-ui'].form.options.forEach(option => {
            component.forms.crud.values[fieldName].push(option)
          })
        }
        // if it is a field grid
        if (getFormType(property) === 'grid') {
          if (property.items) {
            if (property.items.$ref) {
              const refArray = property.items.$ref.split('/')
              const gridSchemaName = refArray[refArray.length - 1]
              const properties = component.swagger.definitions[gridSchemaName].properties
              setFieldHeaders(component, properties, fieldName)
            } else {
              console.warn(`${fieldName} is declared as x-ui schema but no schema was provided`)
            }
          } else {
            console.warn(`${fieldName} is declared as x-ui schema but no schema was provided`)
          }
          // // // console.log('X_X_X_X_X_X_X_X_X_X', fieldName);
          // // // console.log('component.forms.crud.headers[fieldName]', component.forms.crud.headers[fieldName]);
        }
      }
      // if it is a date picker
      if (getFormType(property) === 'date') {
        component.forms.crud.user_values[fieldName] = null
      }
      if (getFormType(property) === 'date-time') {
        component.forms.crud.user_values[fieldName] = null
      }
      if (getFormType(property) === 'base64') {
        component.forms.crud.user_values[fieldName] = null // '/static/avatar.png';
      }
      component.forms.crud.fields.push(settings)
    }
  }
}

function setFieldHeaders (component, properties, fieldName) {
  Vue.set(component.forms.crud.headers, fieldName, [])
  for (const prop in properties) {
    if (properties.hasOwnProperty(prop)) {
      // // // console.log('xxxx------', prop);
      // // // console.log('xxxx------', properties[prop]);
      if (properties[prop]['x-ui']) {
        if (properties[prop]['x-ui'].grid) {
          if (properties[prop]['x-ui'].grid.hide === false) {
            const gridSettings = getDefaultGridColumnSettings(prop, properties[prop])
            component.forms.crud.headers[fieldName].push(gridSettings)
          }
        }
      } else {
        const gridSettings = getDefaultGridColumnSettings(prop)
        component.forms.crud.headers[fieldName].push(gridSettings)
      }
    }
  }
}
export function setSubFormFields (component, parentFieldName, parentProperty, schemaName = false) {
  // console.info('setSubFormFields ----->>>>>>>');
  // console.info('parentFieldName', parentFieldName);
  // console.info('parentProperty', parentProperty);
  // console.info('schemaName', schemaName);
  const entityDefinition = component.swagger.definitions[schemaName]
  const fields = entityDefinition.properties
  let collection = false
  if (parentProperty['x-ui']) {
    if (parentProperty['x-ui']['collection-link']) {
      collection = parentProperty['x-ui']['collection-link']
    }
  }
  // // // console.log('setSubFormFields ------>', parentProperty);
  const subForm = getDefaultSubFormObject(parentFieldName, parentProperty.description, schemaName, entityDefinition, collection, getFormIsUploader(parentProperty))
  // set subform on memory and make it reactive
  Vue.set(component.forms, parentFieldName, subForm)
  for (const fieldName in fields) {
    if (fields.hasOwnProperty(fieldName)) {
      let isHide = false
      // // // console.log('component.hideSubFields', component.hideSubFields);
      for (const _formName in component.hideSubFields) {
        if (_formName !== schemaName) continue // make sue we will hide only fields for specified form
        const hideFields = component.hideSubFields[_formName]
        for (let x = 0; x < hideFields.length; x++) {
          const hiddenField = hideFields[x]
          if (hiddenField.toLowerCase() === fieldName.toLowerCase()) {
            isHide = true
          }
        }
      }
      if (isHide) continue
      const property = fields[fieldName]
      if (property['x-ui']) {
        if (property['x-ui'].form.hide === true && fieldName !== '_id') {
          continue
        }
      }
      let settings = getDefaultFormFieldSettings(fieldName, property, entityDefinition)
      // component.forms[parentFieldName].headers[fieldName] = [];
      Vue.set(component.forms[parentFieldName].headers, fieldName, [])
      // if is there custom swagger defintion
      if (typeof property['x-ui'] !== 'undefined') {
        // if field is linked to another collection
        if (typeof property['x-ui']['collection-link'] === 'string') {
          settings = setFieldCollectionSettings(settings, property)
          // // // console.log('settings', settings);
        }
        if (typeof property['x-ui'].form.isSchema === 'boolean') { // if is linked to a schema
          if (property['x-ui'].form.isSchema) {
            settings.schema = true
          }
        }
        // if just a simple multiple value fields
        if (typeof property.enum !== 'undefined') {
          settings.type = 'select'
          component.forms[parentFieldName].values[fieldName] = []
          property.enum.forEach(option => {
            component.forms[parentFieldName].values[fieldName].push(option)
          })
        }
        if (typeof property['x-ui'].form.options !== 'undefined') {
          settings.type = 'select'
          component.forms[parentFieldName].values[fieldName] = []
          property['x-ui'].form.options.forEach(option => {
            component.forms[parentFieldName].values[fieldName].push(option)
          })
        }
      }
      // if it is a field grid
      if (getFormType(property) === 'grid') {
        if (property.items) {
          if (property.items.$ref) {
            const refArray = property.items.$ref.split('/')
            const schemaName = refArray[refArray.length - 1]
            const properties = component.swagger.definitions[schemaName].properties
            for (const prop in properties) {
              if (properties.hasOwnProperty(prop)) {
                const gridSettings = getDefaultGridColumnSettings(prop, properties[prop])
                component.forms[parentFieldName].headers[fieldName].push(gridSettings)
              }
            }
          } else {
            console.warn(`${parentFieldName} is declared as x-ui schema but no schema was provided`)
          }
        } else {
          console.warn(`${parentFieldName} is declared as x-ui schema but no schema was provided`)
        }
      }
      component.forms[parentFieldName].user_values[fieldName] = getFormDefault(property)
      component.forms[parentFieldName].defaultItem[fieldName] = getFormDefault(property)
      component.forms[parentFieldName].fields.push(settings)
    }
  }
}
// ========
export async function getDataFromApi (url, component, where = false, populate = '') {
  // // // console.log('URL URL URL', url);
  component.loading = true
  const {
    sortBy,
    descending,
    page,
    rowsPerPage
  } = component.pagination
  const order = descending ? -1 : 1
  const offset = page * rowsPerPage - rowsPerPage
  if (where) {
    where = JSON.stringify(where)
  }
  // // // console.log(where);
  const response = await session.http({
    url: where ? `${url}?limit=${rowsPerPage}&offset=${offset}&sort={"${sortBy}":${order}}&where=${where}&populate=${populate}` : `${url}?limit=${rowsPerPage}&offset=${offset}&sort={"${sortBy}":${order}}&populate=${populate}`
  })
  let data = null
  if (response.data) {
    data = response.data.map(doc => {
      const newDoc = {}
      for (const prop in component.swagger.definitions[component.entity].properties) {
        if (component.swagger.definitions[component.entity].properties.hasOwnProperty(prop)) {
          // if (property.type === 'string' || property.type === 'number')
          newDoc[prop] = doc[prop]
        }
      }
      return newDoc
    })
  }
  component.loading = false
  return {
    data,
    allData: response.data,
    total: response.count,
    error: response.error || null
  }
}
export async function getFromApi (url, component, where = false, populate = '') {
  component.loading = true
  const {
    sortBy,
    descending,
    page,
    rowsPerPage
  } = component.pagination
  const order = descending ? -1 : 1
  const offset = page * rowsPerPage - rowsPerPage
  where = where ? JSON.stringify(where) : false
  const uri = where ? `${url}?limit=${rowsPerPage}&offset=${offset}&sort={"${sortBy}":${order}}&where=${where}&populate=${populate}` : `${url}?limit=${rowsPerPage}&offset=${offset}&sort={"${sortBy}":${order}}&populate=${populate}`
  const response = await session.http({
    url: uri
  })
  response.total = response.count
  component.loading = false
  return response
}
export async function create (entity, payload) {
  delete payload.id
  delete payload._id
  const data = JSON.stringify(payload)
  const type = 'POST'
  const url = entity
  const response = await session.http({
    type,
    url,
    data
  })
  // // // console.log('create');
  // // // console.log(response);
  return response
}
export async function createSubDocument (entity, entityId, field, payload) {
  const data = JSON.stringify(payload)
  const type = 'POST'
  const url = `subDocument/${entity}/${entityId}/${field}`
  const response = await session.http({
    type,
    url,
    data
  })
  // // // console.log('create');
  // // // console.log(response);
  return response
}
export async function updateSubDocument (entity, entityId, field, payload) {
  const data = JSON.stringify(payload)
  const type = 'PUT'
  const url = `subDocument/${entity}/${entityId}/${field}`
  const response = await session.http({
    type,
    url,
    data
  })
  // // // console.log('create');
  // // // console.log(response);
  return response
}
export async function deleteSubDocument (entity, entityId, field, payload) {
  const data = JSON.stringify(payload)
  const type = 'DELETE'
  const url = `subDocument/${entity}/${entityId}/${field}`
  const response = await session.http({
    type,
    url,
    data
  })
  // // // console.log('create');
  // // // console.log(response);
  return response
}
export async function createWithID (entity, payload) {
  const data = JSON.stringify(payload)
  const type = 'POST'
  const url = entity
  const response = await session.http({
    type,
    url,
    data
  })
  // // // console.log('create');
  // // // console.log(response);
  return response
}
export async function updateWithID (entity, payload, id) {
  const data = JSON.stringify(payload)
  const type = 'PUT'
  const url = entity + `/${id}`
  const response = await session.http({
    type,
    url,
    data
  })
  // // // console.log(response);
  return response
}
export async function update (entity, payload, id) {
  delete payload.id
  delete payload._id
  const data = JSON.stringify(payload)
  const type = 'PUT'
  const url = entity + `/${id}`
  const response = await session.http({
    type,
    url,
    data
  })
  // // // console.log(response);
  return response
}
export async function remove (entity, id, mode = 'soft') {
  const type = 'DELETE'
  const url = entity + `/${id}?mode=${mode}`
  const response = await session.http({
    type,
    url
  })
  // // // console.log(response);
  return response
}
export async function restore (entity, id) {
  const type = 'PATCH'
  const url = entity + `/${id}`
  const response = await session.http({
    type,
    url
  })
  // // // console.log(response);
  return response
}
export async function getOne (entity, id) {
  const response = await session.http({
    url: `${entity}/${id}`
  })
  return response
}
export async function getCollection (collection, limit = 10, populate = '') {
  // // // console.log(collection);
  collection = collection.replace(/ /gi, '')
  // // // console.log(collection);
  const response = await session.http({
    url: `${collection}?limit=${limit}&populate=${populate}`
  })
  const error = response.error
  const data = response.data
  return {
    error,
    data
  }
}
export async function bulkGetCollections (collections = {}, lastSyncDate = false) {
  // // // console.log('bulkGetCollections lastSyncDate', lastSyncDate);
  collections = JSON.stringify(collections)
  // // // console.log('bulkGetCollections', collections);
  let url = `bulk?collections=${collections}`
  if (lastSyncDate) {
    url = `bulk?collections=${collections}&lastSyncDate=${lastSyncDate}`
  }
  // // // console.log(url);
  const response = await session.http({
    url: url
  })
  // // // console.log('response', response);
  const error = response.error
  const data = response.data
  return {
    error,
    data
  }
}
export async function getLocalCollection (collection, keys = false) {
  // // // console.log(collection);
  collection = collection.replace(/ /gi, '')
  // // // console.log(collection);
  let data = false
  let error = false
  try {
    // console.time('getAll local ' + collection);
    if (keys) {
      data = await Mediator.client.store.models[collection].getAll()
    } else {
      data = (await Mediator.client.store.models[collection].getAll()).filter(d => {
        if (d.deleted === true) return false
        return true
      })
    }
    // // // console.log(data);
    // // // console.log('-------XXXXXX--------');
    // await Mediator.client.store.models[collection].search();
    // console.timeEnd('getAll local ' + collection);
    // // // console.log(Mediator.client.store.$db);
    // data = await Mediator.client.store.$db._db.getAllFromIndex(collection, 'createdAt');
    // // // console.log(data);
    // let notSentMessages = await self.store.models.SocketMessage.findAllByIndexValue('sent', 0)
    // // // console.log(entityName, newDocument)
  } catch (e) {
    // // // console.log('error finding all by index doc ', e);
    error = e
  }
  return {
    error,
    data
  }
}
export function jsUcfirst (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
export async function joinChannel (user = false, channel) {
  let data = false
  let error = false
  try {
    data = await Mediator.client.joinChannel(channel, user)
    // // // console.log(data);
  } catch (e) {
    // // // console.log('error joining channel ', e);
    error = e
  }
  return {
    error,
    data
  }
}
export async function getOnLocalCollection (collection, _id) {
  // // // console.log(collection);
  collection = jsUcfirst(collection.replace(/ /gi, ''))
  // // // console.log(collection);
  // // // console.log(Mediator.client.store.models);
  let data = false
  let error = false
  if (!_id) {
    return {
      error: 'Please provide a valid _id',
      data: null
    }
  }
  try {
    // console.time('getAll local ' + collection);
    data = await Mediator.client.store.models[collection].get(_id)
    // // // console.log(data);
    // // // console.log('-------XXXXXX--------');
    // await Mediator.client.store.models[collection].search();
    // console.timeEnd('getAll local ' + collection);
    // // // console.log(Mediator.client.store.$db);
    // data = await Mediator.client.store.$db._db.getAllFromIndex(collection, 'createdAt');
    // // // console.log(data);
    // let notSentMessages = await self.store.models.SocketMessage.findAllByIndexValue('sent', 0)
    // // // console.log(entityName, newDocument)
  } catch (e) {
    // // // console.log('error finding all by index doc ', e);
    error = e
  }
  return {
    error,
    data
  }
}
export async function putOnLocalCollection (collection, document = false) {
  // // // console.log(collection);
  collection = jsUcfirst(collection.replace(/ /gi, ''))
  // // // console.log(collection);
  // // // console.log(Mediator.client.store.models);
  let data = false
  let error = false
  if (!document) {
    return {
      error: 'Please provide a valid document',
      data: null
    }
  }
  try {
    // console.time('getAll local ' + collection);
    data = await Mediator.client.store.models[collection].put(document)
    // // // console.log(data);
    // // // console.log('-------XXXXXX--------');
    // await Mediator.client.store.models[collection].search();
    // console.timeEnd('getAll local ' + collection);
    // // // console.log(Mediator.client.store.$db);
    // data = await Mediator.client.store.$db._db.getAllFromIndex(collection, 'createdAt');
    // // // console.log(data);
    // let notSentMessages = await self.store.models.SocketMessage.findAllByIndexValue('sent', 0)
    // // // console.log(entityName, newDocument)
  } catch (e) {
    console.error(e)
    error = e
  }
  return {
    error,
    data
  }
}

export async function deleteFromLocalCollection (collection, _id = false) {
  collection = jsUcfirst(collection.replace(/ /gi, ''))
  let data = false
  let error = false
  if (!_id) {
    return {
      error: 'Please provide a valid _id',
      data: null
    }
  }
  try {
    data = await Mediator.client.store.models[collection].delete(_id)
  } catch (e) {
    console.error(e)
    error = e
  }
  return {
    error,
    data
  }
}

export function mountFieldQuery (objValues, objOperators, property, innerQuery, logicalOperator) {
  let value = objValues[property]
  const operator = objOperators[property]
  let childQuery = {}
  if (operator === 'eq') {
    if (typeof value !== 'string') {
      return {
        innerQuery
      }
    }
    if (value === '') {
      return {
        innerQuery
      }
    }
    childQuery = {}
    childQuery[property] = {
      $eq: String(value)
    }
    innerQuery[logicalOperator].push(childQuery)
  } else if (operator === 'ne') {
    if (typeof value !== 'string') {
      return {
        innerQuery
      }
    }
    if (value === '') {
      return {
        innerQuery
      }
    }
    childQuery = {}
    childQuery[property] = {
      $ne: String(value)
    }
    innerQuery[logicalOperator].push(childQuery)
  } else if (operator === 'isNull') {
    childQuery = {}
    childQuery[property] = {
      $eq: null
    }
    innerQuery[logicalOperator].push(childQuery)
  } else if (operator === 'isNotNull') {
    childQuery = {}
    childQuery[property] = {
      $ne: null
    }
    innerQuery[logicalOperator].push(childQuery)
  } else if (operator === 'isEmpty') {
    childQuery = {}
    childQuery[property] = {
      $eq: ''
    }
    innerQuery[logicalOperator].push(childQuery)
  } else if (operator === 'contains') {
    if (typeof value !== 'string') {
      return {
        innerQuery
      }
    }
    if (value === '') {
      return {
        innerQuery
      }
    }
    childQuery = {}
    childQuery[property] = {
      $regex: String(value),
      $options: 'i' // i is slower due not use index
    }
    innerQuery[logicalOperator].push(childQuery)
  } else if (operator === 'doesNotContains') {
    if (typeof value !== 'string') {
      return {
        innerQuery
      }
    }
    if (value === '') {
      return {
        innerQuery
      }
    }
    childQuery = {}
    childQuery[property] = {
      $regex: String('^((?!' + value + ').)*$'),
      $options: 'i' // i is slower due not use index
    }
    innerQuery[logicalOperator].push(childQuery)
  } else if (operator === 'startsWith') {
    if (typeof value !== 'string') {
      return {
        innerQuery
      }
    }
    if (value === '') {
      return {
        innerQuery
      }
    }
    childQuery = {}
    childQuery[property] = {
      $regex: String('^' + value),
      $options: 'im' // i is slower due not use index
    }
    innerQuery[logicalOperator].push(childQuery)
  } else if (operator === 'endsWith') {
    if (typeof value !== 'string') {
      return {
        innerQuery
      }
    }
    if (value === '') {
      return {
        innerQuery
      }
    }
    childQuery = {}
    childQuery[property] = {
      $regex: String(value + '$'),
      $options: 'im' // i is slower due not use index
    }
    innerQuery[logicalOperator].push(childQuery)
  } else if (operator === 'gt') {
    childQuery = {}
    childQuery[property] = {
      $gt: value
    }
    innerQuery[logicalOperator].push(childQuery)
  } else if (operator === 'gte') {
    childQuery = {}
    childQuery[property] = {
      $gte: value
    }
    innerQuery[logicalOperator].push(childQuery)
  } else if (operator === 'lt') {
    childQuery = {}
    childQuery[property] = {
      $lt: value
    }
    innerQuery[logicalOperator].push(childQuery)
  } else if (operator === 'lte') {
    childQuery = {}
    childQuery[property] = {
      $lte: value
    }
    innerQuery[logicalOperator].push(childQuery)
  } else if (operator === 'between') {
    if (value === '') {
      return {
        innerQuery
      }
    }
    let value_2 = ''
    if (value.indexOf(' to ') > -1) {
      const strDateRange = value.split(' to ')
      value = strDateRange[0]
      value_2 = strDateRange[1]
    }
    if (value_2 === '') {
      return {
        innerQuery
      }
    }
    if (value_2 === null) {
      return {
        innerQuery
      }
    }
    if (typeof value_2 === 'undefined') {
      return {
        innerQuery
      }
    }
    if (isDate(value) && isDate(value_2)) {
      childQuery = {}
      childQuery[property] = {
        $gte: new Date(value).toISOString(),
        $lt: new Date(value_2).toISOString()
      }
      innerQuery[logicalOperator].push(childQuery)
    } else {
      return {
        innerQuery
      }
    }
  } else if (operator === 'notBetween') {
    //
  }
  return {
    innerQuery
  }
}
export function getVmFieldById (id, fields) {
  let field = false
  fields.forEach(f => {
    if (f.id === id) field = f
  })
  return field
}
export function isValidDate (d, m, y) {
  m = parseInt(m, 10) - 1
  return m >= 0 && m < 12 && d > 0 && d <= daysInMonth(m, y)
}
export function isIdValid (_id) {
  if (typeof _id !== 'string') return false
  if (_id === '') return false
  return true
}
export function uuid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
export function closeForm (component, isSearch = false) {
  Swal.fire({
    title: 'Are you done?',
    text: `Please cancel if you want to ${component.currentFormMode} ${component.currentFormMode === 'create' ? 'more items' : 'this item'} !`,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, close it!',
    backdrop: `
      rgba(0,0,123,0.4)
      url("./static/nyan-cat.gif")
      center left
      no-repeat
    `
  }).then((result) => {
    if (result.value) {
      component.bus.$emit('displayWhat', 'grid')
      component.forms.crud.user_values = Object.assign({}, component.forms.crud.defaultItem)
      component.forms.crud.editedIndex = -1
      clearFieldsValues(component, isSearch ? 'search' : 'crud')
    }
  })
}
export function closeSubForm (component, name) {
  // component.currentFormMode // create update
  // // // console.log('closeSubForm', name);
  Swal.fire({
    title: 'Are you done?',
    text: 'Please cancel if you want to add more items!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, close it!',
    backdrop: `
      rgba(0,0,123,0.4)
      url("./static/nyan-cat.gif")
      center left
      no-repeat
    `
  }).then((result) => {
    if (result.value) {
      // component.bus.$emit('displayWhat', 'grid');
      // component.forms[name].user_values = Object.assign({}, component.forms[name].defaultItem);
      // component.forms[name].editedIndex = -1;
      clearFieldsValues(component, name)
      if (component.currentFormMode === 'create') {
        component.bus.$emit('createItem', false)
      } else if (component.currentFormMode === 'update') {
        component.bus.$emit('editCRUDItem', component.forms.crud.editedIndex)
      }
    }
  })
}
export async function displayWhat (component, what, isSearch) {
  // // // console.log('------------> displayWhat', what);
  if (what !== 'grid' && what !== 'crud') {
    // closeForm(component);
  }
  component.displayWhat = what
  component.$emit('toTop')
  if (what !== 'grid') {
    component.dialog_loading = true
    component.loading = true
    await feedFieldsValues(component, what === 'search' ? 'crud' : what, isSearch)
    component.dialog_loading = false
    component.loading = false
  }
  // if (what === 'grid') {
  // component.currentFormMode = null;
  // }
}
export function setXCrudMediatorDataSync (component) {
  Mediator.client.on('data:sync', async (eventObj) => {
    if (!eventObj.success) return
    if (eventObj.entity !== component.entity) return
    if (eventObj.action === 'create') {
      addNewDocumentToVm(component, eventObj.data)
    } else if (eventObj.action === 'update' || eventObj.action === 'restore' || eventObj.action === 'delete') {
      const {
        document,
        index
      } = getDocumentById(component, eventObj.data._id)
      if (document) {
        // feedGrid(component);
        updateDocumentOnVm(component, eventObj.data, index)
      }
    } else if (eventObj.action === 'delete_hard') {
      const {
        document,
        index
      } = getDocumentById(component, eventObj.data._id)
      if (document) {
        // feedGrid(component);
        deleteDocumentOnVm(component, index)
      }
    }
  })
}
export async function updateRecord (component, isFormSimple, isHideOnFormSimpleSave = true) {
  const copy = Object.assign({}, component.forms.crud.user_values)
  // // // console.log('updateRecord', copy);
  const formatedRecord = mountPayloadBasedOnSwagger(component, component.entity, copy, isFormSimple, isHideOnFormSimpleSave)
  // // // console.log('updateRecord formatedRecord', formatedRecord);
  const {
    data,
    error
  } = await update(component.entity, formatedRecord, copy._id)
  component.bus.$emit('savedOnServer', {
    data,
    error
  })
  if (error) {
    console.error('error on update', error)
    return {
      data,
      error
    }
  }
  return {
    data,
    error
  }
}
export async function createRecord (component, isFormSimple, isHideOnFormSimpleSave = true) {
  // create
  const formatedRecord = mountPayloadBasedOnSwagger(component, component.entity, component.forms.crud.user_values, isFormSimple, isHideOnFormSimpleSave)
  // // // console.log('formatedRecord', formatedRecord);
  const {
    data,
    error
  } = await create(component.entity, formatedRecord)
  component.bus.$emit('savedOnServer', {
    data,
    error
  })
  if (error) {
    console.error('error on create', error)
    return {
      data,
      error
    }
  }
  // component.documents = mountDataForGridBasedOnSawgger(component.swagger, component.entity, component.headers, component.documents);
  return {
    data,
    error
  }
}
export async function save (component, isFormSimple = false, isHideOnFormSimpleSave = true) {
  // // // console.log('isFormSimple', isFormSimple);
  // // // console.log('isHideOnFormSimpleSave', isHideOnFormSimpleSave);
  // // // console.log(component.$refs);
  // // // console.log(component.$refs.xForm);
  // // // console.log(component.$refs.xForm.$refs);
  let response = {
    error: false,
    data: false
  }
  const vForm = component.$refs.xForm.$refs['form_crud_' + component.entity]
  // // // console.log('vForm.validate()', vForm.validate());
  if (vForm.validate()) {
    response = await processForm(component, isFormSimple, isHideOnFormSimpleSave)
  } else {
    showSnack(component, 'Please check the form')
  }
  return response
}
export async function processForm (component, isFormSimple, isHideOnFormSimpleSave = true) {
  component.dialog_loading = true
  component.loading = true
  let response = {
    error: false,
    data: false
  }
  if (component.forms.crud.editedIndex > -1) {
    response = await updateDocument(component, isFormSimple, isHideOnFormSimpleSave)
  } else {
    response = await createDocument(component, isFormSimple, isHideOnFormSimpleSave)
  }
  component.dialog_loading = false
  component.loading = false
  return response
}
export async function updateDocument (component, isFormSimple, isHideOnFormSimpleSave = true) {
  const {
    data,
    error
  } = await updateRecord(component, isFormSimple, isHideOnFormSimpleSave)
  let errorMessage = false
  if (!error) {
    // updateDocumentOnVm(component, data);
    if (!isFormSimple) feedGrid(component)
    component.bus.$emit('displayWhat', 'crud')
  } else {
    errorMessage = error.message || error
  }
  if (!errorMessage) {
    if (!isFormSimple) component.bus.$emit('close')
  }
  showSnack(component, errorMessage)
  return {
    data,
    error
  }
}
export async function createDocument (component, isFormSimple, isHideOnFormSimpleSave = true) {
  const {
    data,
    error
  } = await createRecord(component, isFormSimple, isHideOnFormSimpleSave)
  let errorMessage = false
  if (!error) {
    // addNewDocumentToVm(component, data);
    if (!isFormSimple) feedGrid(component)
  } else {
    errorMessage = error.message || error
  }
  if ((!errorMessage) && (!isFormSimple)) {
    component.forms.crud.user_values = Object.assign({}, component.forms.crud.defaultItem)
    component.forms.crud.editedIndex = -1
    component.bus.$emit('close')
  }
  showSnack(component, errorMessage)
  return {
    data,
    error
  }
}
export function editItem (component, index) {
  // // // console.log('editItem')
  // // // console.log(component.original_documents[index])
  const item = mountRecordBasedOnSwagger(component, component.original_documents[index])
  // // // console.log('item', item);
  component.forms.crud.editedIndex = index
  // // // console.log('editItem', item);
  component.forms.crud.user_values = Object.assign({}, item)
  component.currentFormMode = 'update'
  component.bus.$emit('displayWhat', 'crud')
  // component.bus.$emit('setDialog');
}
export function createItem (component, isEmpty = true) {
  // // // console.log('---->>>> Start CREATE ITEM');
  // // // console.log('component.forms.crud.user_values', component.forms.crud.user_values);
  component.forms.crud.editedIndex = -1
  component.currentFormMode = 'create'
  if (isEmpty) {
    console.warn('assigning default values')
    component.forms.crud.user_values = Object.assign({}, component.forms.crud.defaultItem)
  } else {
    console.warn('using component.forms.crud.user_values')
    // user has filled form crud before
  }
  // check if something was created in formgrid and and fill form field
  if (component.original_documents[component.forms.crud.editedIndex]) {
    // // // console.log('adding properties from component.original_documents[-1] on createItem', component.original_documents[component.forms.crud.editedIndex]);
    for (const prop in component.original_documents[component.forms.crud.editedIndex]) {
      // // // console.log('prop from component.original_documents[-1]', prop);
      // // // console.log(component.original_documents[component.forms.crud.editedIndex][prop]);
      Vue.set(component.forms.crud.user_values, prop, component.original_documents[component.forms.crud.editedIndex][prop])
    }
  }
  // // // console.log('---->>>> End CREATE ITEM');
  component.bus.$emit('displayWhat', 'crud')
  // component.bus.$emit('setDialog');
}
export function editSubFormItem (component, item, formName, index) {
  component.bus.$emit('openSubForm', formName)
  component.forms[formName].editedIndex = index
  // // // console.log('editSubFormItem item', item);
  component.forms[formName].user_values = Object.assign({}, item)
}
export function fillField (component, collection, _id, fieldId) {
  window.setTimeout(() => {
    // // // console.log('ddddddDDD', _id);
    // // // console.log('ddddddDDD field', fieldId);
    _fillField(collection, _id, fieldId)
  }, 700)
}

function _fillField (collection, _id, fieldId) {
  // // // console.log('ddddddDDD', _id);
  // // // console.log('ddddddDDD field', fieldId);
  if (!_id) {
    try {
      document.getElementById(fieldId).innerHTML = 'none'
    } catch (error) {
      console.warn('element does not exist ' + fieldId)
    }
    return
  }
  if (!document.getElementById(fieldId)) {
    return
  }
  (async (elId) => {
    // if (!document.getElementById(elId)) return;
    try {
      const {
        data
      } = await getOnLocalCollection(collection.collection, _id)
      const keys = collection.labelKey.split(',')
      let text = ''
      keys.forEach(k => {
        text += ' ' + data[k.toString().trim()].toString().trim()
      })
      document.getElementById(elId).innerHTML = text
    } catch (error) {
      // // // console.log(error);
      console.warn('error on filling field', fieldId)
      console.warn('searching for:', collection.collection)
      console.warn('value:', _id)
      console.warn('target div id:', elId)
    }
  })(fieldId)
}
export function previewSubFormItem (component, item, formName) {
  let strTemplate = ''
  // // // console.log(item);
  // // // console.log(formName);
  // // // console.log(component.entity);
  item = JSON.parse(JSON.stringify(item))
  const property = component.swagger.definitions[component.entity].properties[formName]
  // // // console.log(property);
  const refArray = property.items.$ref.split('/')
  // sub document schema name
  const schemaName = refArray[refArray.length - 1]
  const subFieldDefinition = component.swagger.definitions[schemaName].properties
  // // // console.log(property);
  for (const prop in item) {
    if (prop === '_id') continue
    const sProperty = subFieldDefinition[prop]
    const fType = getFormType(sProperty)
    if (fType === 'currency') {
      item[prop] = parseFloat(item[prop]).toFixed(2)
    }
    if (fType === 'date') {
      item[prop] = flatpickr.formatDate(new Date(item[prop]), 'F j, Y')
    }
    if (fType === 'date-time') {
      item[prop] = flatpickr.formatDate(new Date(item[prop]), 'F j, Y H:i')
    }
    const $collection = getFieldCollectionSettings(sProperty)
    // // // console.log('$collection', $collection);
    if ($collection) {
      if ($collection.collection) {
        const val = item[prop]
        item[prop] = `<div style="float:left; width: 50%; padding: 5px;" id="sel_preview_${prop}">
          <img style="max-width:36px;" class="centered" src="./static/loading.gif">
        </div>`
        window.setTimeout(() => {
          fillField(component, $collection, val, 'sel_preview_' + prop)
        }, 300)
      }
    }
    strTemplate += `<div style="float:left; width: 100%;"><p style="float:left; width: 50%;">${component.swagger.definitions[schemaName].properties[prop].description}:</p> ${item[prop]}</div>`
  }
  Swal.fire({
    title: `<strong>Preview ${formName} detail</strong>`,
    type: 'info',
    html: strTemplate,
    showCloseButton: true,
    showCancelButton: false,
    focusConfirm: false,
    confirmButtonText: 'Close'
  })
}
export function previewGenericItem (component, item, entity) {
  let strTemplate = ''
  // // // console.log(item);
  // // // console.log(entity);
  item = JSON.parse(JSON.stringify(item))
  const subFieldDefinition = component.swagger.definitions[entity].properties
  // // // console.log(property);
  for (const prop in item) {
    if (prop === '_id') continue
    if (!subFieldDefinition[prop]) continue
    const sProperty = subFieldDefinition[prop]
    const fType = getFormType(sProperty)
    if (fType === 'currency') {
      item[prop] = parseFloat(item[prop]).toFixed(2)
    }
    if (fType === 'date') {
      item[prop] = flatpickr.formatDate(new Date(item[prop]), 'F j, Y')
    }
    if (fType === 'date-time') {
      item[prop] = flatpickr.formatDate(new Date(item[prop]), 'F j, Y H:i')
    }
    const $collection = getFieldCollectionSettings(sProperty)
    // // // console.log('$collection', $collection);
    if ($collection) {
      if ($collection.collection) {
        const val = item[prop]
        item[prop] = `<div style="float:left; width: 50%; padding: 5px;" id="sel_preview_${prop}">
          <img style="max-width:36px;" class="centered" src="./static/loading.gif">
        </div>`
        window.setTimeout(() => {
          fillField(component, $collection, val, 'sel_preview_' + prop)
        }, 300)
      }
    }
    strTemplate += `<div style="float:left; width: 100%;"><p style="float:left; width: 50%;">${component.swagger.definitions[entity].properties[prop].description}: ${fType}</p> ${item[prop]}</div>`
  }
  Swal.fire({
    title: `<strong>Preview ${entity} detail</strong>`,
    type: 'info',
    html: strTemplate,
    showCloseButton: true,
    showCancelButton: false,
    focusConfirm: false,
    confirmButtonText: 'Close'
  })
}
export function previewUploadedFile (component, item, formName) {
  let strTemplate = ''
  // // // console.log(item);
  item = JSON.parse(JSON.stringify(item))
  const property = component.swagger.definitions[component.entity].properties[formName]
  const refArray = property.items.$ref.split('/')
  // sub document schema name
  const schemaName = refArray[refArray.length - 1]
  const subFieldDefinition = component.swagger.definitions[schemaName].properties
  // // // console.log(property);
  for (const prop in item) {
    if (prop === '_id' || prop === 'path' || prop === 'name') continue
    const sProperty = subFieldDefinition[prop]
    const fType = getFormType(sProperty)
    if (fType === 'currency') {
      item[prop] = parseFloat(item[prop]).toFixed(2)
    }
    if (fType === 'date') {
      item[prop] = flatpickr.formatDate(new Date(item[prop]), 'F j, Y')
    }
    if (fType === 'date-time') {
      item[prop] = flatpickr.formatDate(new Date(item[prop]), 'F j, Y H:i')
    }
    if (prop === 'webPath') {
      item[prop] = `<a style="cursor:pointer;" onclick="window.open('${item.webPath}', 'Download');">click to download</a>`
    }
    const $collection = getFieldCollectionSettings(sProperty)
    // // // console.log('$collection', $collection);
    if ($collection) {
      if ($collection.collection) {
        const val = item[prop]
        item[prop] = `<div style="float:left; width: 50%; padding: 5px;" id="sel_preview_${prop}">
          <img style="max-width:36px;" class="centered" src="./static/loading.gif">
        </div>`
        window.setTimeout(() => {
          fillField(component, $collection, val, 'sel_preview_' + prop)
        }, 300)
      }
    }
    strTemplate += `<div style="float:left; width: 100%;"><p style="float:left; width: 50%;">${component.swagger.definitions[schemaName].properties[prop].description}:</p> ${item[prop]}</div>`
  }
  Swal.fire({
    title: `<strong>Preview ${formName} detail</strong>`,
    type: 'info',
    html: strTemplate,
    showCloseButton: true,
    showCancelButton: false,
    focusConfirm: false,
    confirmButtonText: 'Close'
  })
}
export function deleteSubFormItem (component, formName, index) {
  component.forms.crud.values[formName].splice(index, 1)
  component.forms.crud.user_values[formName].splice(index, 1)
  component.forms[formName].editedIndex = -1
}
export async function deleteItem (component, item = false, mode = 'soft') {
  const errors = []
  const deleted = []
  if (item) {
    if (isIdValid(item._id)) {
      const {
        error,
        data
      } = await remove(component.entity, item._id, mode)
      if (error) {
        errors.push(error)
        showSnack(component, component.entity + ' ' + item._id + ' is not deleted')
      } else if (data) {
        deleted.push(data)
        component.selected = []
        showSnack(component, false, component.entity + ' ' + item._id + ' is deleted')
        feedGrid(component)
      }
    } else {
      errors.push('invalid ID')
      showSnack(component, component.entity + ' is not deleted. Invalid ID')
    }
  } else {
    // // // console.log(component.selected);
    for (let x = 0; x < component.selected.length; x++) {
      const item = component.selected[x]
      if (isIdValid(item._id)) {
        const {
          error,
          data
        } = await remove(component.entity, item._id, mode)
        if (error) {
          errors.push(error)
          showSnack(component, component.entity + ' ' + item._id + ' is not deleted')
        } else if (data) {
          component.selected = []
          deleted.push(data)
          showSnack(component, false, component.entity + ' ' + item._id + ' is deleted')
        }
      } else {
        errors.push('invalid ID')
        showSnack(component, component.entity + ' is not deleted. Invalid ID')
      }
    }
    if (deleted.length > 0) feedGrid(component)
  }
  return {
    error: errors,
    data: deleted
  }
}
export async function restoreItem (component, item = false) {
  const errors = []
  const restored = []
  if (item) {
    if (isIdValid(item._id)) {
      const {
        error,
        data
      } = await restore(component.entity, item._id)
      if (error) {
        errors.push(error)
        showSnack(component, component.entity + ' ' + item._id + ' is not restored')
      } else if (data) {
        restored.push(data)
        showSnack(component, false, component.entity + ' ' + item._id + ' is restored')
        feedGrid(component)
      }
    } else {
      errors.push('invalid ID')
      showSnack(component, component.entity + ' is not restored. Invalid ID')
    }
    /**  */
  } else {
    // // // console.log(component.selected);
    for (let x = 0; x < component.selected.length; x++) {
      const item = component.selected[x]
      if (isIdValid(item._id)) {
        const {
          error,
          data
        } = await restore(component.entity, item._id)
        if (error) {
          errors.push(error)
          showSnack(component, component.entity + ' ' + item._id + ' is not restored')
        } else if (data) {
          restored.push(data)
          showSnack(component, false, component.entity + ' ' + item._id + ' is restored')
        }
      } else {
        errors.push('invalid ID')
        showSnack(component, component.entity + ' is not restored. Invalid ID')
      }
    }
    if (restored.length > 0) feedGrid(component)
  }
  return {
    error: errors,
    data: restored
  }
}
export function setXCrudMainListeners (component) {
  component.bus.$on('readPhotoFile', (fieldId, base64) => readPhotoFile(component, fieldId, base64))
  component.bus.$on('feedGrid', () => feedGrid(component, component.where))
  component.bus.$on('setPagination', (pagination) => {
    component.pagination = Object.assign({}, pagination)
  })
  component.bus.$on('addToPayload', (payload = {}, formName = 'crud') => {
    addToPayload(component, payload, formName)
  })
  component.bus.$on('editCRUDItem', (index) => editItem(component, index))
  component.bus.$on('createItem', (isEmpty = true) => createItem(component, isEmpty))
  component.bus.$on('displayWhat', async (what, isSearch = false) => {
    displayWhat(component, what, isSearch)
  })
  component.bus.$on('closeForm', async (isSearch = false) => {
    closeForm(component, isSearch)
  })
  component.bus.$on('close', (isSearch = false) => closeForm(component, isSearch))
  component.bus.$on('closeSubForm', async (name) => {
    // // // console.log('closeSubForm', name);
    closeSubForm(component, name)
  })
  component.bus.$on('toggleAll', () => {
    toggleAll(component)
  })
  component.bus.$on('export2PDF', () => {
    const JSPDF = jsPDF
    const doc = new JSPDF('landscape', 'pt', 'a4')
    // // // console.log(document.getElementById('grid_data').childNodes[0].childNodes[0]);
    doc.addHTML(document.getElementById('grid_data').childNodes[0].childNodes[0], function () {
      doc.save('MAP_' + component.entity + '_QuickReport_' + ((ObjectID()).toString()) + '.pdf')
    })
    /** pdf.html(document.body, {
      callback: function (pdf) {
        let iframe = document.createElement('iframe');
        iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:500px');
        document.body.appendChild(iframe);
        iframe.src = pdf.output('datauristring');
      }
    });  */
  })
  component.bus.$on('export2Excel', () => {
    let tab_text = '<table border="2px"><tr bgcolor="#87AFC6">'
    const tab = document.getElementById('grid_data').childNodes[0].childNodes[0] // id of table
    for (let j = 0; j < tab.rows.length; j++) {
      tab_text = tab_text + tab.rows[j].innerHTML + '</tr>'
      // tab_text=tab_text+"</tr>";
    }
    tab_text = tab_text + '</table>'
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, '') // remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, '') // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, '') // reomves input params
    tab_text = tab_text.replace(/<i[^>]*>|<\/i>/gi, '') // reomves input params
    tab_text = tab_text.replace(/<div[^>]*>|<\/div>/gi, '') // reomves input params
    tab_text = tab_text.replace(/check_box_outline_blank/gi, '') // reomves input params
    tab_text = tab_text.replace(/arrow_upward/gi, '') // reomves input params
    // let ua = window.navigator.userAgent;
    // let msie = ua.indexOf("MSIE ");
    const sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text)) // other browser not tested on IE 11
    return sa
  })
  component.bus.$on('toggleOne', (item) => {
    toggleOne(component, item)
  })
  component.bus.$on('save', (isFormSimple = false, isHideOnFormSimpleSave = true) => save(component, isFormSimple, isHideOnFormSimpleSave))
  component.bus.$on('saveSubForm', async (name) => {
    const {
      error
    } = await saveSubForm(component, name)
    if (error) return
    component.bus.$emit('closeSubForm', name)
  })
  component.bus.$on('uploadSubForm', async (name) => {
    const {
      error
    } = await saveSubForm(component, name, true)
    if (error) {
      Swal.fire({
        title: '<strong>Upload error</strong>',
        type: 'error',
        html: error,
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: 'Close'
      })
      return
    }
    component.bus.$emit('closeSubForm', name)
  })
  component.bus.$on('openSubForm', async (name) => {
    // // // console.log('openSubForm', name);
    component.bus.$emit('feedFieldsValues', name)
    component.bus.$emit('displayWhat', name)
  })
  component.bus.$on('editSubFormItem', (item, formName, index) => {
    editSubFormItem(component, item, formName, index)
  })
  component.bus.$on('previewSubFormItem', (item, formName, index) => {
    previewSubFormItem(component, item, formName)
  })
  component.bus.$on('previewUploadedFile', (item, formName, index) => {
    previewUploadedFile(component, item, formName)
  })
  component.bus.$on('deleteSubFormItem', (item, formName, index) => {
    Swal.fire({
      title: 'Delete item?',
      text: 'You won\'t be able to revert this!',
      type: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!',
      backdrop: `
          rgba(0,0,123,0.4)
          url("./static/nyan-cat.gif")
          center left
          no-repeat
        `
    }).then((result) => {
      if (result.value) {
        deleteSubFormItem(component, formName, index)
        Swal.fire('Deleted!', 'Now you need to save the main form to save the changes.', 'warning')
      }
    })
  })
  component.bus.$on('clearFieldsValues', (formName) => {
    clearFieldsValues(component, formName)
  })
  component.bus.$on('feedFieldsValues', async (formName, isSearch = false) => {
    component.dialog_loading = true
    component.loading = true
    await feedFieldsValues(component, formName, isSearch)
    component.dialog_loading = false
    component.loading = false
  })
  component.bus.$on('deleteItem', async (item = false) => {
    Swal.fire({
      title: 'Delete item?',
      text: 'You will be able to restore this record anyway!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!',
      backdrop: `
          rgba(0,0,123,0.4)
          url("./static/nyan-cat.gif")
          center left
          no-repeat
        `
    }).then(async (result) => {
      if (result.value) {
        await deleteItem(component, item)
        Swal.fire('Deleted!', 'Your record has been deleted.', 'success')
      }
    })
  })
  component.bus.$on('hardDeleteItem', async (item = false) => {
    Swal.fire({
      title: 'Delete item?',
      text: 'You won\'t be able to revert this!',
      type: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!',
      backdrop: `
          rgba(0,0,123,0.4)
          url("./static/nyan-cat.gif")
          center left
          no-repeat
        `
    }).then(async (result) => {
      if (result.value) {
        await deleteItem(component, item, 'hard')
        Swal.fire('Deleted!', 'Your record has been deleted.', 'success')
      }
    })
  })
  component.bus.$on('restoreItem', async (item = false) => {
    Swal.fire({
      title: 'Restore item?',
      text: 'Are you sure you want to restore the selected items!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Restore it!',
      backdrop: `
          rgba(0,0,123,0.4)
          url("./static/nyan-cat.gif")
          center left
          no-repeat
        `
    }).then(async (result) => {
      if (result.value) {
        await restoreItem(component, item)
        Swal.fire('Restored!', 'The item has been restored.', 'warning')
      }
    })
  })
  /** $and: [
        { $or: [
          {a: 1},
          {b: 1}
        ] }
      ] */
  component.bus.$on('doAdvancedSearch', () => {
    // // // console.log('XXXXXX----->>>>>>>>>>>>> doAdvancedSearch');
    const objValues = JSON.parse(JSON.stringify(component.form_search.user_values))
    const objOperators = JSON.parse(JSON.stringify(component.form_search.operators))
    const logicalOperator = '$' + component.form_search.matching_operator
    let queryObj = {}
    let innerQuery = {}
    innerQuery[logicalOperator] = []
    delete objValues._id
    delete objOperators._id
    for (const property in objValues) {
      if (objValues.hasOwnProperty(property)) {
        const objQuery = mountFieldQuery(objValues, objOperators, property, innerQuery, logicalOperator)
        innerQuery = objQuery.innerQuery
      }
    }
    queryObj = {
      $and: [innerQuery]
    }
    clearFieldsValues(component, 'search')
    component.bus.$emit('displayWhat', 'grid')
    // // // console.log(queryObj);
    if (queryObj.$and[0]) {
      if (queryObj.$and[0][logicalOperator]) {
        if (queryObj.$and[0][logicalOperator].length > 0) {
          // // // console.log(queryObj);
          feedGrid(component, queryObj)
          return
        }
      }
    }
    feedGrid(component)
  })
  component.bus.$on('doTextSearch', (value) => {
    component.bus.$emit('displayWhat', 'grid')
    if (value === '' || value === null) {
      feedGrid(component)
    } else {
      feedGrid(component, {
        $text: {
          $search: value
        }
      })
    }
  })
}

function addToPayload (component, payload, formName) {
  for (const field in payload) {
    Vue.set(component.forms[formName].user_values, field, payload[field])
  }
}
export function addNewDocumentToVm (component, data) {
  component.selected = []
  const newDocument = {}
  for (const prop in component.swagger.definitions[component.entity].properties) {
    if (component.swagger.definitions[component.entity].properties.hasOwnProperty(prop)) {
      const property = component.swagger.definitions[component.entity].properties[prop]
      if (property.type === 'string' || property.type === 'number') {
        newDocument[prop] = data[prop]
      }
    }
  }
  component.documents.unshift(mountDataForGridBasedOnSawgger(component.swagger, component.entity, component.headers, [data])[0])
  component.original_documents.unshift(data)
}
export function updateDocumentOnVm (component, data, index) {
  /** component.selected = component.selected.filter(d => {
    if (d._id === data._id)
    {
      return false;
    }
    else
    {
      return true;
    }
  }); */
  Object.assign(component.documents[index], mountDataForGridBasedOnSawgger(component.swagger, component.entity, component.headers, [data])[0])
  Object.assign(component.original_documents[index], data)
}
export function deleteDocumentOnVm (component, index) {
  /** component.selected = component.selected.filter(d => {
    if (d._id === data._id)
    {
      return false;
    }
    else
    {
      return true;
    }
  }); */
  component.selected = []
  component.documents.splice(index, 1)
  component.original_documents.splice(index, 1)
}
/** export function getFormSubDocumentId (component, values, index) {
  if (index === -1) return 0;
  let document = values[index];
  // // // console.log(document);
  return document._id || false;
}; */
export function getDocumentById (component, _id = false) {
  const response = {
    document: false,
    index: -1
  }
  if (_id === false) return response
  component.documents.forEach((d, index) => {
    if (d._id === _id) {
      response.document = d
      response.index = index
    }
  })
  return response
}
export function feedGrid (component, where = false) {
  // // // console.log('xxxxxxxx------------> feedGrid ');
  component.where = where;
  (async () => {
    component.dialog_loading = true
    component.loading = true
    const {
      allData,
      data,
      total,
      error
    } = await getDataFromApi(component.entity, component, where)
    if (error) {
      console.error(error)
      return
    }
    component.selected = []
    component.original_documents = []
    component.documents = []
    component.original_documents = allData
    // // // console.log(component.original_documents);
    component.totalDocuments = total
    component.documents = mountDataForGridBasedOnSawgger(component.swagger, component.entity, component.headers, data)
    component.dialog_loading = false
    component.loading = false
  })()
}
export async function createSubRecordOnServer (component, entity, newRecord) {
  let errorMessage = false
  const formatedRecord = mountPayloadBasedOnSwagger(component, entity, newRecord)
  // // // console.log('formatedRecord', formatedRecord);
  const {
    data,
    error
  } = await create(entity, formatedRecord)
  if (error) {
    errorMessage = error
    if (error.message) errorMessage = error.message
  }
  // // // console.log('reateSubRecordOnServer');
  // // // console.log(data, error);
  showSnack(component, errorMessage)
  return {
    data,
    error
  }
}
export async function createSubRecord (component, formName, parentField, newRecord) {
  // // // console.log('createSubRecord', formName);
  // // // console.log('parentField', parentField);
  // // // console.log('newRecord', newRecord);
  const oldArray = [...(component.forms.crud.user_values[formName] || [])]
  let _data = null
  let _error = null
  if (parentField.$collection) {
    // save on server
    const entity = parentField.$collection.collection
    const {
      data,
      error
    } = await createSubRecordOnServer(component, entity, newRecord)
    if (error) {
      _error = error
    } else {
      newRecord = data
      if (parentField.$collection.labelKey && parentField.$collection.valueKey) {
        newRecord = {}
        const keys = parentField.$collection.labelKey.split(',')
        let text = ''
        keys.forEach(k => {
          text += ' ' + data[k.toString().trim()].toString().trim()
        })
        newRecord.text = text.toString().trim()
        newRecord.value = data[parentField.$collection.valueKey]
      }
      oldArray.push(newRecord)
      if (!component.original_documents[component.forms.crud.editedIndex]) {
        component.original_documents[component.forms.crud.editedIndex] = {}
      }
      Vue.set(component.original_documents[component.forms.crud.editedIndex], formName, [])
      Vue.set(component.original_documents[component.forms.crud.editedIndex], formName, oldArray)
      _data = newRecord
    }
  } else {
    const _id = (ObjectID()).toString()
    newRecord._id = _id.toString()
    oldArray.push(newRecord)
    if (!component.original_documents[component.forms.crud.editedIndex]) {
      component.original_documents[component.forms.crud.editedIndex] = {}
    }
    Vue.set(component.original_documents[component.forms.crud.editedIndex], formName, [])
    Vue.set(component.original_documents[component.forms.crud.editedIndex], formName, oldArray)
    _data = newRecord
    showSnack(component)
  }
  return {
    $data: _data,
    $error: _error
  }
}
export async function updateSubRecord (component, formName, parentField, newRecord, parentFormEditedIndex) {
  const oldArray = [...component.forms.crud.user_values[formName]]
  // // // console.log('updateSubRecord oldArray', oldArray);
  let _data = null
  const _error = null
  if (parentField.$collection) {
    // save on server
  } else {
    oldArray.splice(parentFormEditedIndex, 1)
    oldArray.push(newRecord)
    Vue.set(component.original_documents[component.forms.crud.editedIndex], formName, [])
    Vue.set(component.original_documents[component.forms.crud.editedIndex], formName, oldArray)
    _data = newRecord
    showSnack(component)
  }
  return {
    $data: _data,
    $error: _error
  }
}
export async function uploadFile (component, formName, newRecord) {
  console.log({component, formName, newRecord})
  let fileIsOk = false
  let response = {}
  const main_record_id = component.original_documents[component.forms.crud.editedIndex]._id
  // // // console.log('IS UPLOAD');
  const _id = (ObjectID()).toString()
  newRecord._id = _id
  
  const formData = new FormData()
  for (const prop in newRecord) {
    const fiedlDefinition = component.swagger.definitions[formName].properties[prop]
    if (fiedlDefinition.format === 'file') {
      // // // console.log(`${formName}_${prop}`)
      // // // console.log(document.getElementById(`${formName}_${prop}`))
      if (document.getElementById(`${formName}_${prop}`)) {
        if (document.getElementById(`${formName}_${prop}`).files) {
          if (document.getElementById(`${formName}_${prop}`).files[0]) {
            const filesList = document.getElementById(`${formName}_${prop}`).files[0]
            // // // console.log(filesList)
            // formData.append('file', file);
            formData.append(prop, filesList)
            fileIsOk = true
          }
        }
      }
    } else {
      formData.append(prop, newRecord[prop])
    }
  }
  if (fileIsOk) {
    const request = await session.upload({
      data: formData,
      url: 'files/' + component.entity + '/' + main_record_id,
      bus: component.bus
    })
    // let oldArray = [...component.forms.crud.user_values[formName]];
    // oldArray.push(newRecord);
    const fieldRecords = request.data.file
    // let fieldHeaders = component.forms[formName].headers['file'];
    // Vue.set(component.forms[formName].values, formName, mountDataForGrid(fieldHeaders, fieldRecords));
    Vue.set(component.original_documents[component.forms.crud.editedIndex], formName, [])
    Vue.set(component.original_documents[component.forms.crud.editedIndex], formName, fieldRecords)
    response = {
      $data: request.data,
      $error: request.error
    }
  } else {
    response = {
      $data: false,
      $error: 'No file provided'
    }
  }
  showSnack(component)
  return response
}
export async function persistSubForm (component, formName, parentField, vmForm, isUpload) {
  // // // console.log('persistSubForm');
  const parentFormEditedIndex = vmForm.editedIndex
  // // // console.log('vmForm.editedIndex', vmForm.editedIndex);
  const newRecord = JSON.parse(JSON.stringify(vmForm.user_values))
  let response = {}
  if (isUpload) {
    response = await uploadFile(component, formName, newRecord)
  } else {
    if (parentFormEditedIndex === -1) {
      response = await createSubRecord(component, formName, parentField, newRecord)
      // // // console.log('createSubRecord', response);
    } else // update
    {
      response = await updateSubRecord(component, formName, parentField, newRecord, parentFormEditedIndex)
      // // // console.log('updateSubRecord', response);
    }
  }
  return response
}
export async function saveSubForm (component, formName, isUpload = false) {
  const vForm = component.$refs.xForm.$refs['form_' + formName][0]
  const vmForm = component.forms[formName]
  const parentField = component.forms.crud.fields.filter(field => {
    return field.id === formName
  })[0]
  if (!vForm.validate()) {
    showSnack(component, 'Please check the form')
    return {
      data: [],
      error: 'Please check the form'
    }
  }
  const {
    $error,
    $data
  } = await persistSubForm(component, formName, parentField, vmForm, isUpload)
  // // // console.log('saveSubForm');
  // // // console.log($error, $data);
  return {
    data: $data,
    error: $error
  }
}
export async function setFieldOptions (component, field, formName) {
  // // // console.log('setFieldOptions');
  // // // console.log(field, formName);
  let {
    error,
    data
  } = await getLocalCollection(field.collection.collection)
  data = data.map(doc => {
    const keys = field.collection.labelKey.split(',')
    let text = ''
    keys.forEach(k => {
      text += ' ' + doc[k.toString().trim()].toString().trim()
    })
    return {
      text: text,
      value: doc[field.collection.valueKey]
    }
  })
  if (error) {
    console.error(error)
    Vue.set(component.forms[formName].values, field.id, [])
  } else {
    Vue.set(component.forms[formName].values, field.id, data)
  }
}
export async function setFieldGridValues (component, field, formName) {
  // // // console.log('------->>>> START setFieldGridValues');
  // if (component.forms.crud.editedIndex > -1) {
  const refArray = field.$schema.properties[field.id].items.$ref.split('/')
  // sub document schema name
  const schemaName = refArray[refArray.length - 1]
  const subFieldDefinition = component.swagger.definitions[schemaName]
  // // // console.log(field, formName);
  // // // console.log(field.$schema.properties[field.id].items.$ref);
  // // // console.log(field.id);
  // // // console.log(component.forms.crud.editedIndex);
  // if is creating a new record, then it doesnt exists in original_documents array
  if (!component.original_documents[component.forms.crud.editedIndex]) {
    console.warn(`component.original_documents[${component.forms.crud.editedIndex}] does not exist, creating it`)
    component.original_documents[component.forms.crud.editedIndex] = {}
  }
  if (!component.original_documents[component.forms.crud.editedIndex][field.id]) {
    console.warn(`component.original_documents[${component.forms.crud.editedIndex}][${field.id}] does not exist, creating it`)
    component.original_documents[component.forms.crud.editedIndex][field.id] = []
  }
  // // // console.log(component.original_documents[component.forms.crud.editedIndex]);
  // // // console.log(component.original_documents[component.forms.crud.editedIndex][field.id]);
  const fieldRecords = JSON.parse(JSON.stringify(component.original_documents[component.forms.crud.editedIndex][field.id]))
  // console.info('fieldRecords', fieldRecords);
  const fieldHeaders = component.forms[formName].headers[field.id]
  // console.info('grid headers', fieldRecords);
  // console.info('grid rows', mountDataForGrid(fieldHeaders, fieldRecords));
  Vue.set(component.forms[formName].values, field.id, mountDataForGrid(fieldHeaders, fieldRecords))
  const data_labels = await mountLabelsForGrid(subFieldDefinition, fieldHeaders, fieldRecords)
  // // // console.log('data_labels', data_labels);
  // // // console.log(field.id, field);
  if (data_labels.length > 0) {
    Vue.set(component.forms[formName].labels, field.id, data_labels)
  }
  // // // console.log(component.forms[formName].values[field.id]);
  // } else {
  //  Vue.set(component.forms[formName].values, field.id, []);
  // }
  // // // console.log('------->>>> END setFieldGridValues');
}
// set the values of a field
export async function feedFieldValues (component, field, formName, isSearch) {
  // // // console.log('formName', formName);
  // // // console.log(field, field.id + ' ' + field.type);
  if (field.collection) {
    await setFieldOptions(component, field, formName)
  }
  if (field.type === 'grid') {
    await setFieldGridValues(component, field, formName)
  } else if (field.type === 'date' || field.type === 'date-time') {
    // // // console.log('CCCCCCCCCCC', field);
    component.bus.$emit('mountPicker', field, (formName === 'crud' ? component.entity : formName), component.forms[formName].user_values, isSearch)
  } else if (field.type === 'base64') {
    if (component.forms[formName].user_values[field.id] === '' || component.forms[formName].user_values[field.id] === null) {
      component.forms[formName].user_values[field.id] = '/static/avatar.png'
    }
  } else {
    if (component.forms[formName].user_values[field.id] === '' || component.forms[formName].user_values[field.id] === null) {
      // component.swagger.definitions[component.entity].properties
      // getFormDefault()
      if (typeof field.defaultValue !== 'undefined') component.forms[formName].user_values[field.id] = field.defaultValue
    }
  }
  // if is a schema
}
// reads all fields and set it values
export async function feedFieldsValues (component, formName, isSearch = false) {
  for (let x = 0; x < component.forms[formName].fields.length; x++) {
    const field = component.forms[formName].fields[x]
    await feedFieldValues(component, field, formName, isSearch)
  }
}
export function clearFieldValues (component, field, formName) {
  let vmForm = component.form_search
  if (formName !== 'search') {
    vmForm = component.forms[formName]
  }
  if (field.type === 'date' || field.type === 'date-time') {
    //   flatpickr(`#${field.id}`, {});
    component.bus.$emit('clearPicker', field, formName)
    vmForm.user_values[field.id] = null
  } else {
    // vmForm.user_values[field.id] = '';
  }
}
export function clearFieldsValues (component, formName) {
  let vmForm = component.form_search
  if (formName !== 'search') {
    vmForm = component.forms[formName]
  }
  for (let x = 0; x < vmForm.fields.length; x++) {
    const field = vmForm.fields[x]
    clearFieldValues(component, field, formName)
  }
}
export function readPhotoFile (component, fileId, base64) {
  // // // console.log(fileId, base64);
  component.forms.crud.user_values[fileId] = base64
}
export function showSnack (component, errorMessage = false, message = 'Data saved') {
  // // // console.log('XXXXX SHOW SNACK')
  component.snack = true
  component.snackColor = errorMessage ? 'error' : 'success'
  component.snackText = errorMessage || message
}
export function toggleAll (component) {
  if (component.selected.length) {
    component.selected = []
  } else {
    component.selected = component.documents.slice()
  }
}
export function toggleOne (component, item) {
  // // // console.log(item);
  // // // console.log(component.selected.indexOf(item));
  if (component.selected.indexOf(item) > -1) {
    component.selected.splice(component.selected.indexOf(item), 1)
  } else {
    component.selected.push(item)
  }
}
export function setGridHeaders (properties = {}, dataAdapters = {}) {
  // console.error('setGridHeaders')
  const headers = []
  for (const name in properties) {
    if (properties.hasOwnProperty(name)) {
      if (name === '_id') continue
      const property = properties[name]
      const type = property.type
      const xuiType = getFormType(property)
      const text = getGridLabel(property)
      const width = getGridWidth(property)
      const cellsalign = getGridColAlign(property)
      const is_grid_hide = isGridHide(property)
      const isEditable = getFormEditable(property)
      const mask = getFormMask(property)
      const format = getFormat(property)
      /*
      columntype - sets the column's type.
      'number' - readonly column with numbers.
      'checkbox' - readonly checkbox when the editing is disabled. Checkbox input when editing is enabled.
      threestatecheckbox - determines whether the checkbox has an indeterminate state when the value is null. The default value is false.
      'numberinput' - sets a number input editor as a default editor for the column. Requires: jqxnumberinput.js
      'dropdownlist' - sets a dropdownlist editor as a default editor for the column. Requires: jqxlistbox.js and jqxdropdownlist.js
      'combobox' - sets a combobox editor as a default editor for the column. Requires: jqxlistbox.js and jqxcombobox.js
      'datetimeinput' - sets a datetimeinput editor as a default editor for the column. Requires: jquery.global.js, jqxcalendar.js and jqxdatetimeinput.js
      'textbox' - sets a textbox editor as a default editor for the column.
      'template' - sets a custom editor as a default editor for the column. The editor should be created in the "createeditor" callback. The editor should be synchronized with the cell's value in the "initeditor" callback. The editor's value should be retrieved in the "geteditorvalue" callback.
      'custom' - sets a custom editor as a default editor for a cell. That setting enables you to have multiple editors in a Grid column. The editors should be created in the "createeditor" callback - it is called for each row when the "columntype=custom". The editors should be synchronized with the cell's value in the "initeditor" callback. The editor's value should be retrieved in the "geteditorvalue" callback.
      */
      const columntype = 'textbox'
      const header = {
        text: `${text}`,
        editable: isEditable,
        datafield: name,
        cellsalign,
        hideable: true,
        enabletooltips: true,
        columntype,
        draggable: true,
        filterable: true,
        
        // width
      }
      // console.log(type, xuiType)
      // console.log({ name, xuiType, type, width, cellsalign, is_grid_hide, isEditable, mask, format })
      // set by swagger property.type
      if (type === 'string') {
        // by default all string field is a text field
        header.columntype = 'textbox'
        // set by xuitype
        if (xuiType === 'date') {
          header.columntype = 'datetimeinput'
          header.filterable = false
          header.filtertype = 'date'
          header.validation = (cell, value) => {
            if (!is.date(value)) {
              return { result: false, message: 'It should be a valid date' }
            }
            return true
          }
          header.cellsformat = 'MM-dd-yyyy'
          header.cellsrenderer = dateRenderer
        } else if (xuiType === 'date-time') {
          header.columntype = 'datetimeinput'
          header.filterable = false
          header.filtertype = 'date'
          header.validation = (cell, value) => {
            if (!is.date(value)) {
              return { result: false, message: 'It should be a valid date' }
            }
            return true
          }
          header.cellsformat = 'MM-dd-yyyy HH-mm'
          header.cellsrenderer = dateTimeRenderer
        } 
        else if (xuiType === 'multipleselect') {
          header.columntype = 'combobox'
        } 
        else if (xuiType === 'select') {
          header.columntype = 'dropdownlist'
          const foreignCollection = getForeignCollection(property)
          if(foreignCollection)
          {
            header.displayfield = foreignCollection.collection
          }
          
          header.createeditor = function (row, cellvalue, editor) {
            let dataSource = property.enum || []
            const iptConf = {
              source: dataSource
            }
            if(getFormOptions(property))
            {
              iptConf.source = getFormOptions(property)
            }
            const foreignCollection = getForeignCollection(property)
            if(foreignCollection)
            {
              if (dataAdapters) {
                if(dataAdapters[foreignCollection.collection])
                {
                  
                  iptConf.source = dataAdapters[foreignCollection.collection]
                  iptConf.displayMember = foreignCollection.labelKey
                  iptConf.valueMember = foreignCollection.valueKey
                }
              }
            }
            
            editor.jqxDropDownList(iptConf)
          }
        } else if (xuiType === 'combo' || xuiType === 'combobox') {
          // console.warn(xuiType, name)
          header.columntype = 'dropdownlist'
          // header.filterable = false
          const foreignCollection = getForeignCollection(property)
          // console.error(foreignCollection.labelKey)
          if(foreignCollection)
          {
            header.displayfield = foreignCollection.collection
          }
          header.createeditor = function (row, cellvalue, editor) {
            let dataSource = property.enum || []
            const iptConf = {
              source: dataSource,
            }
            if(getFormOptions(property))
            {
              iptConf.source = getFormOptions(property)
            }
            if(foreignCollection)
            {
              if (dataAdapters) {
                if(dataAdapters[foreignCollection.collection])
                {
                  
                  iptConf.source = dataAdapters[foreignCollection.collection]
                  iptConf.displayMember = foreignCollection.labelKey
                  iptConf.valueMember = foreignCollection.valueKey
                }
              }
            }
            editor.jqxDropDownList(iptConf)
          }
        }
      } else if (type === 'boolean') {
        // by default all string field is a text field
        header.columntype = 'checkbox'
        header.editable = true
      } else if (type === 'integer') {
        // by default all string field is a text field
        header.columntype = 'numberinput'
       // header.cellsformat = 'c2'
        header.editable = true
      } else if (type === 'currency') {
        // by default all string field is a text field
        header.columntype = 'numberinput'
        header.cellsformat = 'c2'
        // header.cellsformat = 'MM-dd-yyyy'
        header.editable = false
      } else if (type === 'number') {
        // by default all string field is a text field
        console.error(`==========> NUMBER ${text} ${xuiType} - ${format} - ${mask}`)
        header.columntype = 'numberinput'
        if(format === 'float')
        {
          header.cellsformat = 'f3'
        }
        if(xuiType === 'currency')
        {
          header.cellsformat = 'c2'
        }
        header.editable = true
      } else if (type === 'array') {
        // by default all string field is a text field
        if (xuiType === 'grid') {
          //
        } else if (xuiType === 'multipleselect') {
          header.columntype = 'combobox'
        } else if (xuiType === 'select') {
          header.columntype = 'dropdownlist'
          header.createeditor = function (row, cellvalue, editor) {
            let dataSource = property.enum || []
            const iptConf = {
              source: dataSource
            }
            if(getFormOptions(property))
            {
              iptConf.source = getFormOptions(property)
            }
            const foreignCollection = getForeignCollection(property)
            if(foreignCollection)
            {
              if(dataAdapters[foreignCollection.collection])
              {
                iptConf.source = dataAdapters[foreignCollection.collection]
                iptConf.displayMember = foreignCollection.labelKey
                iptConf.valueMember = foreignCollection.valueKey
              }
            }
            
            editor.jqxDropDownList(iptConf)
          }
        } else if (xuiType === 'combo' || xuiType === 'combobox') {
          header.columntype = 'combobox'
          header.filterable = false
        }
      } else {
        console.error('MISSING DEV grid column type', type)
      }
      // set by format
      if (format === 'date') {
        header.columntype = 'datetimeinput'
        header.validation = (cell, value) => {
          if (!is.date(value)) {
            return { result: false, message: 'It should be a valid date' }
          }
          return true
        }
        header.cellsformat = 'MM-dd-yyyy'
        header.cellsrenderer = dateRenderer
      } else if (format === 'date-time') {
        header.columntype = 'datetimeinput'
        header.validation = (cell, value) => {
          if (!is.date(value)) {
            return { result: false, message: 'It should be a valid date' }
          }
          return true
        }
        header.cellsformat = 'MM-dd-yyyy HH-mm'
        header.cellsrenderer = dateTimeRenderer
      }
      // // // console.log({ text, datafield, width, cellsalign, xuiType });
      // // // console.log('name', name);
      if (xuiType === 'grid') {
        header.cellsrenderer = subArrayOfSchemaRenderer
        header.editable = false
      } else if (xuiType === 'multipleselect') {
        // header.cellsrenderer = subArrayOfSchemaRenderer;
        header.cellsrenderer = subArrayRenderer
        header.editable = false
      }
      // // // console.log('header.width', width)
      if (width) {
        header.width = width
      }
      if (is_grid_hide) {
        // header.hidden = true
        continue
      }
      // console.log('setGridHeaders', header)
      headers.push(header)
    }
  }
  return headers
}




export function getDefaultFormWidth (ss = 0) {
  if (is.mobile()) {
    const strW = $('#xApp').css('width').replace(/px/gi, '')
    let width = parseInt(strW) - 110 + (ss)
    return width + 'px'
  } else {
    const strW = $('#xApp').css('width').replace(/px/gi, '')
    const width = parseInt(strW) - 110 + (ss)
    return width + 'px'
  }
}
export async function setField ({ entity, name, property, swagger, mode = 'edit', bus = false, dataAdapters, width = false }) {
  // console.error('setField', { entity, name, property, swagger, mode })
  const xuiType = getFormType(property)
  let definition = swagger.definitions[entity]
  let field = {}
  // console.log('setField-->>', { entity, name, property, swagger, mode, xuiType, dataAdapters});
  // console.error(`type: ${property.type} xuiType`, xuiType)
  if (xuiType === 'text') {
    field = await buildTextField({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  } else if (xuiType === 'password') {
    field = await buildPasswordField({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  } else if (xuiType === 'date') {
    field = await buildDateField({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  } else if (xuiType === 'date-time') {
    field = await buildDateTimeField({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  } else if (xuiType === 'autocomplete') {
    field = await buildAutoCompleteField({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  } else if (xuiType === 'combobox' || xuiType === 'combo') {
    field = await buildComboField({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  } else if (xuiType === 'grid') {
    field = await buildGridField({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  } else if (xuiType === 'multipleselect') {
    const foreignCollection = getForeignCollection(property)
    definition = swagger.definitions[foreignCollection.collection]
    field = await buildMultipleSelectField({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  } else if (xuiType === 'select') {
    field = await buildSelectField({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  } else if (xuiType === 'switch') {
    field = await buildSwitchField({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  } else if (xuiType === 'integer') {
    field = await buildIntegerField({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  } else if (xuiType === 'currency') {
    field = await buildCurrencyField({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  }  else if (xuiType === 'file') {
    field = await buildFileField({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  } else if (xuiType === 'editor') {
    field = await buildEditorField({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  } else if (xuiType === 'base64') {
    field = await buildBase64Field({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  } else if (xuiType === 'checkbox_group') {
    field = await buildCheckboxGroupField({
      entity,
      name,
      property,
      swagger,
      mode,
      bus,
      definition,
      dataAdapters,
      width
    })
  }

  // 
  // // // console.log('>>>>>>>>>>>>>>>', field);
  return field
}
export async function buildTextField ({ name, property, mode = 'edit', definition, width }) {
  const label = getFormLabel(property)
  let info = property.description
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  const isMultiple = isFormMultiple(property)
  let isEditable = getFormEditable(property)
  let format = getFormat(property)
  const formLimit = getFormSelectionLimit(property)
  const limitMessage = formLimit > 0 ? `You can select up to ${formLimit} items.` : formLimit < 0 ? 'You can\'t select any item.' : 'You can select unlimited items.'
  
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  // translate.keys.google = 'fakekey';
  // translate.keys.yandex = 'fakekey';
  // info = await translate(info, 'es')
  width = width ||  getDefaultFormWidth();
  if (isMultiple) info = `${info}. ${limitMessage}`
  if (mode === 'create') isEditable = true
  if (mode === 'search') isEditable = true
  if (mode === 'view') isEditable = false
  if (mode === 'view') info = ''
  
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'text',
    componentUsed: 'text',
    label,
    required,
    labelPosition: 'top',
    // labelWidth: '30%',
    align: 'left',
    // labelWidth: '80px',
    width,
    info,
    infoPosition: 'right',
    foreignCollection,
    disabled: !isEditable,
    init: async (component) => {
      if (format === 'ssn')
      {
        const iptConf = {
          width,
          disabled: !isEditable,
          mask: '###-##-####'
        }
        component.jqxMaskedInput(iptConf)
      } else if (format === 'zip') {
        const iptConf = {
          width,
          disabled: !isEditable,
          mask: '#####-####'
        }
        component.jqxMaskedInput(iptConf)
      } else if (format === 'geolocation') {
        const iptConf = {
          width,
          disabled: !isEditable
        }
        component.jqxInput(iptConf)
      } else {
        const iptConf = {
          width,
          disabled: !isEditable
        }
        component.jqxInput(iptConf)
      }
    }
    // placeHolder: 'xxxxxx',
    // component: 'jqxInput',
  }
  return field
}
export async function buildDateField ({ name, property, mode = 'edit', definition, width }) {
  const label = getFormLabel(property)
  let info = property.description
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  const isMultiple = isFormMultiple(property)
  let isEditable = getFormEditable(property)
  const formLimit = getFormSelectionLimit(property)
  const limitMessage = formLimit > 0 ? `You can select up to ${formLimit} items.` : formLimit < 0 ? 'You can\'t select any item.' : 'You can select unlimited items.'
  width = width ||  getDefaultFormWidth()
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  if (isMultiple) info = `${info}. ${limitMessage}`
  if (mode === 'create') isEditable = true
  if (mode === 'search') isEditable = true
  if (mode === 'view') isEditable = false
  if (mode === 'view') info = ''
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'date',
    componentUsed: 'date',
    label,
    required,
    labelPosition: 'top',
    // labelWidth: '30%',
    align: 'left',
    // labelWidth: '80px',
    width,
    info,
    infoPosition: 'right',
    foreignCollection,
    disabled: !isEditable,
    formatString: 'MM-dd-yyyy',
    init: async (component) => {
      const iptConf = {
        width,
        disabled: !isEditable,
        formatString: 'MM-dd-yyyy',
        allowNullDate: true,
        showFooter: true
      }
      if (mode === 'create' || mode === 'search')
      {
        iptConf.value = null
      }
      component.jqxDateTimeInput(iptConf)
    }
    // placeHolder: 'xxxxxx',
    // component: 'jqxInput',
  }
  return field
}

export async function buildSwitchField ({ entity, name, property, swagger, mode = 'edit', definition, width }) {
  const label = getFormLabel(property)
  let info = property.description
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  const isMultiple = isFormMultiple(property)
  let isEditable = getFormEditable(property)
  const formLimit = getFormSelectionLimit(property)
  const limitMessage = formLimit > 0 ? `You can select up to ${formLimit} items.` : formLimit < 0 ? 'You can\'t select any item.' : 'You can select unlimited items.'
  width = width ||  getDefaultFormWidth()
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  if (isMultiple) info = `${info}. ${limitMessage}`
  if (mode === 'create') isEditable = true
  if (mode === 'search') isEditable = true
  if (mode === 'view') isEditable = false
  if (mode === 'view') info = ''
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'custom',
    componentUsed: 'switch',
    label,
    required,
    labelPosition: 'top',
    // labelWidth: '30%',
    align: 'left',
    // labelWidth: '80px',
    width,
    info,
    infoPosition: 'right',
    foreignCollection,
    disabled: !isEditable,
    init: async (component) => {
      const iptConf = {
        // width,
        height: 27, 
        width: 81,
        theme: 'arctic',
        // text: 'yes',
        disabled: !isEditable
      }
      component.jqxSwitchButton(iptConf);
      // component.jqxDateTimeInput(iptConf)
    }
    // placeHolder: 'xxxxxx',
    // component: 'jqxInput',
  }
  return field
}



export async function buildPasswordField ({ entity, name, property, swagger, mode = 'edit', definition, width }) {
  const label = getFormLabel(property)
  let info = property.description
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  const isMultiple = isFormMultiple(property)
  let isEditable = getFormEditable(property)
  const formLimit = getFormSelectionLimit(property)
  const limitMessage = formLimit > 0 ? `You can select up to ${formLimit} items.` : formLimit < 0 ? 'You can\'t select any item.' : 'You can select unlimited items.'
  width = width ||  getDefaultFormWidth()
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  if (isMultiple) info = `${info}. ${limitMessage}`
  if (mode === 'create') isEditable = true
  if (mode === 'search') isEditable = true
  if (mode === 'view') isEditable = false
  if (mode === 'view') info = ''
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'password',
    componentUsed: 'password',
    label,
    required,
    labelPosition: 'top',
    // labelWidth: '30%',
    align: 'left',
    // labelWidth: '80px',
    width,
    info,
    infoPosition: 'right',
    foreignCollection,
    disabled: !isEditable,

    init: async (component) => {
      const iptConf = {
        width,
        disabled: !isEditable,
        showStrength: true, 
        showStrengthPosition: "right"
      }
      component.jqxPasswordInput(iptConf);
    }
  }
  return field
}

export async function buildIntegerField ({ entity, name, property, swagger, mode = 'edit', definition, width }) {
  const label = getFormLabel(property)
  let info = property.description
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  const isMultiple = isFormMultiple(property)
  let isEditable = getFormEditable(property)
  const formLimit = getFormSelectionLimit(property)
  const limitMessage = formLimit > 0 ? `You can select up to ${formLimit} items.` : formLimit < 0 ? 'You can\'t select any item.' : 'You can select unlimited items.'
  width = width ||  getDefaultFormWidth()
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  if (isMultiple) info = `${info}. ${limitMessage}`
  if (mode === 'create') isEditable = true
  if (mode === 'search') isEditable = true
  if (mode === 'view') isEditable = false
  if (mode === 'view') info = ''
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'number',
    componentUsed: 'integer',
    label,
    required,
    labelPosition: 'top',
    // labelWidth: '30%',
    align: 'left',
    // labelWidth: '80px',
    width,
    info,
    infoPosition: 'right',
    foreignCollection,
    disabled: !isEditable,

    init: async (component) => {
      const iptConf = {
        width,
        disabled: !isEditable,
         decimalDigits: 0,
         // symbolPosition: 'right', 
         // symbol: '%', 
         spinButtons: true
      }
      component.jqxNumberInput(iptConf);
    }
    // placeHolder: 'xxxxxx',
    // component: 'jqxInput',
  }
  return field
}


export async function buildCurrencyField ({ entity, name, property, swagger, mode = 'edit', definition, width }) {
  const label = getFormLabel(property)
  let info = property.description
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  const isMultiple = isFormMultiple(property)
  let isEditable = getFormEditable(property)
  const formLimit = getFormSelectionLimit(property)
  const limitMessage = formLimit > 0 ? `You can select up to ${formLimit} items.` : formLimit < 0 ? 'You can\'t select any item.' : 'You can select unlimited items.'
  width = width ||  getDefaultFormWidth()
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  if (isMultiple) info = `${info}. ${limitMessage}`
  if (mode === 'create') isEditable = true
  if (mode === 'search') isEditable = true
  if (mode === 'view') isEditable = false
  if (mode === 'view') info = ''
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'number',
    componentUsed: 'currency',
    label,
    required,
    labelPosition: 'top',
    // labelWidth: '30%',
    align: 'left',
    // labelWidth: '80px',
    width,
    info,
    infoPosition: 'right',
    foreignCollection,
    disabled: !isEditable,

    init: async (component) => {
      const iptConf = {
        width,
        disabled: !isEditable,
         decimalDigits: 2,
         // symbolPosition: 'right', 
         symbol: '$', 
         spinButtons: true
      }
      component.jqxNumberInput(iptConf);
    }
    // placeHolder: 'xxxxxx',
    // component: 'jqxInput',
  }
  return field
}


export async function xuploadFile ({ entity, main_record_id, bus = false, swagger, schemaName, newRecord, width }) {
  // console.log('xuploadFile', { entity, main_record_id, bus, swagger, schemaName, newRecord })
  let fileIsOk = false
  let response = {}
  // // // console.log('IS UPLOAD');
  const _id = (ObjectID()).toString()
  newRecord._id = _id.toString()
  const formData = new FormData()
  for (const prop in newRecord) {
    console.log('prop', prop)
    const fiedlDefinition = swagger.definitions[schemaName].properties[prop]
    if (fiedlDefinition.format === 'file') {
      // console.log('fiedlDefinition', fiedlDefinition)
      // console.log('ffiedlDefinition.format', fiedlDefinition.format)
      // console.log($(`#xfile_${prop}`))
      // console.log(document.getElementById(`xfile_${prop}`))
      if (document.getElementById(`xfile_${prop}`)) {
        if (document.getElementById(`xfile_${prop}`).files) {
          if (document.getElementById(`xfile_${prop}`).files[0]) {
            const filesList = document.getElementById(`xfile_${prop}`).files[0]
            // console.log(filesList)
            // formData.append('file', file);
            formData.append(prop, filesList)
            fileIsOk = true
          }
        }
      }
    } else {
      formData.append(prop, newRecord[prop])
    }
  }
  if (fileIsOk) {
    const request = await session.upload({
      data: formData,
      url: 'files/' + entity + '/' + main_record_id,
      bus: bus
    })

    const fieldRecords = request.data.file
    // console.log(request.data)
    response = {
      data: request.data,
      error: false
    }
  } else {
    response = {
      data: false,
      error: 'No file provided'
    }
  }
  return response
}

export async function buildFileField ({ entity, name, property, swagger, mode = 'edit', definition, width }) {
  const label = getFormLabel(property)
  let info = property.description
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  const isMultiple = isFormMultiple(property)
  let isEditable = getFormEditable(property)
  const formLimit = getFormSelectionLimit(property)
  const limitMessage = formLimit > 0 ? `You can select up to ${formLimit} items.` : formLimit < 0 ? 'You can\'t select any item.' : 'You can select unlimited items.'
  width = width ||  getDefaultFormWidth()
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  if (isMultiple) info = `${info}. ${limitMessage}`
  if (mode === 'create') isEditable = true
  if (mode === 'search') isEditable = true
  if (mode === 'view') isEditable = false
  if (mode === 'view') info = ''
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'custom',
    componentUsed: 'file',
    label,
    required,
    labelPosition: 'top',
    // labelWidth: '30%',
    align: 'left',
    // labelWidth: '80px',
    width,
    info,
    infoPosition: 'right',
    foreignCollection,
    disabled: !isEditable,

    init: async (component) => {
      const accept = getFormAccept(property)
      const maxSise = getFormSize(property)
      component.html(`<input
        id="xfile_${name}"
        type="file"
        name="xfile_${name}"
        accept="${accept}"
        multiple="false"
      >`)

      $(`#xfile_${name}`).on("change", function(e){ 
        console.log(e.target.files)
        if (!e.target.files[0]) return
        const file = e.target.files[0]

        if (file.size > maxSise) {
          let fileSize = Number.parseFloat((file.size / 1024 / 1024)).toFixed(2);

          Swal.fire({
            title: `<strong>Upload error</strong>`,
            type: 'error',
            html: 'Selected file has <b class="error">' + (fileSize) + ' Mb</b>. Allowed max size is: <b class="error">' + (maxSise / 1024 / 1024) + ' Mb</b>.',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: 'Close',
          });
          $(`#xfile_${name}`).val('')
          return;
        }

        let reader  = new FileReader();
        reader.addEventListener('load', (e) => {
          // this.bus.$emit('readPhotoFile', fieldId, reader.result);
          // reader.result
        }, false);
        if (file) {
          reader.readAsDataURL(file);
        }
      });
    }
    // placeHolder: 'xxxxxx',
    // component: 'jqxInput',
  }
  return field
}



export async function buildBase64Field ({ entity, name, property, swagger, mode = 'edit', definition, width }) {
  // console.log('buildBase64Field', { entity, name, property, swagger, mode, definition })
  const label = getFormLabel(property)
  let info = property.description
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  const isMultiple = isFormMultiple(property)
  let isEditable = getFormEditable(property)
  const formLimit = getFormSelectionLimit(property)
  const mediaType = getFormFileType(property)
  const limitMessage = formLimit > 0 ? `You can select up to ${formLimit} items.` : formLimit < 0 ? 'You can\'t select any item.' : 'You can select unlimited items.'
  width = width ||  getDefaultFormWidth()
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  if (isMultiple) info = `${info}. ${limitMessage}`
  if (mode === 'create') isEditable = true
  if (mode === 'search') isEditable = true
  if (mode === 'view') isEditable = false
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'custom',
    componentUsed: 'base64',
    label,
    required,
    labelPosition: 'top',
    // labelWidth: '30%',
    align: 'left',
    // labelWidth: '80px',
    width,
    info,
    infoPosition: 'right',
    foreignCollection,
    disabled: !isEditable,

    init: async (component) => {
      const accept = getFormAccept(property)
      const maxSise = getFormSize(property)
      let html = ''
      if (mode !== 'search' && mode !== 'view') {
        html += `<input
          id="xfile_${name}"
          type="file"
          name="xfile_${name}"
          accept="${accept}"
          multiple="false"
        > ` 
      }
      html += ` <input
        id="xfile_base64_${name}"
        type="hidden"
        name="xfile_base64_${name}"
        value=""
      > ` 
      if(mediaType === 'avatar') {
        html += `<img id="xfile_image_${name}" class="avatar" src='/static/avatar.png' />`
      }
      else if(mediaType === 'image') {
        html += `<img id="xfile_image_${name}" class="ximage" src='/static/avatar.png' />`
      }
      component.html(html)

      $(`#xfile_${name}`).on("change", function(e){ 
        console.log(e.target.files)
        if (!e.target.files[0]) return
        const file = e.target.files[0]

        if (file.size > maxSise) {
          let fileSize = Number.parseFloat((file.size / 1024 / 1024)).toFixed(2);

          Swal.fire({
            title: `<strong>Upload error</strong>`,
            type: 'error',
            html: 'Selected file has <b class="error">' + (fileSize) + ' Mb</b>. Allowed max size is: <b class="error">' + (maxSise / 1024 / 1024) + ' Mb</b>.',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: 'Close',
          });
          $(`#xfile_${name}`).val('')
          return;
        }

        let reader  = new FileReader();
        reader.addEventListener('load', (e) => {
          $(`#xfile_image_${name}`).attr('src', reader.result)
          $(`#xfile_base64_${name}`).attr('value', reader.result)
        }, false);
        if (file) {
          reader.readAsDataURL(file);
        }
      });
    }
    // placeHolder: 'xxxxxx',
    // component: 'jqxInput',
  }
  return field
}

export async function buildEditorField ({ entity, name, property, swagger, mode = 'edit', definition, width }) {
  const label = getFormLabel(property)
  let info = property.description
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  const isMultiple = isFormMultiple(property)
  let isEditable = getFormEditable(property)
  const formLimit = getFormSelectionLimit(property)
  const limitMessage = formLimit > 0 ? `You can select up to ${formLimit} items.` : formLimit < 0 ? 'You can\'t select any item.' : 'You can select unlimited items.'
  width = width ||  getDefaultFormWidth()
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  if (isMultiple) info = `${info}. ${limitMessage}`
  if (mode === 'create') isEditable = true
  if (mode === 'search') isEditable = true
  if (mode === 'view') isEditable = false
  if (mode === 'view') info = ''
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'custom',
    componentUsed: 'editor',
    label,
    required,
    labelPosition: 'top',
    // labelWidth: '30%',
    align: 'left',
    // labelWidth: '80px',
    width,
    info,
    infoPosition: 'right',
    foreignCollection,
    disabled: !isEditable,

    init: async (component) => {
      const accept = getFormAccept(property)
      const maxSise = getFormSize(property)
      component.html(`<textarea id="xeditor_${name}"></textarea>`)
      $(`#xeditor_${name}`).jqxEditor({
        height: "200px",
        width,
        // tools: "bold italic underline | font size | left center right | outdent indent",
      });
    }
    // placeHolder: 'xxxxxx',
    // component: 'jqxInput',
  }
  return field
}
export async function buildDateTimeField ({ name, property, mode = 'edit', definition, width }) {
  const label = getFormLabel(property)
  let info = property.description
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  const isMultiple = isFormMultiple(property)
  let isEditable = getFormEditable(property)
  const formLimit = getFormSelectionLimit(property)
  const limitMessage = formLimit > 0 ? `You can select up to ${formLimit} items.` : formLimit < 0 ? 'You can\'t select any item.' : 'You can select unlimited items.'
  width = width ||  getDefaultFormWidth()
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  if (isMultiple) info = `${info}. ${limitMessage}`
  if (mode === 'create') isEditable = true
  if (mode === 'search') isEditable = true
  if (mode === 'view') isEditable = false
  if (mode === 'view') info = ''
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'datetime',
    componentUsed: 'datetime',
    label,
    required,
    labelPosition: 'top',
    // labelWidth: '30%',
    align: 'left',
    // labelWidth: '80px',
    width,
    info,
    infoPosition: 'right',
    foreignCollection,
    disabled: !isEditable,
    showTimeButton: true,
    formatString: 'MM-dd-yyyy HH:mm',
    init: async (component) => {
      const iptConf = {
        width,
        disabled: !isEditable,
        showTimeButton: true,
        formatString: 'MM-dd-yyyy HH:mm',
        allowNullDate: true,
        showFooter: true
      }
      if (mode === 'create' || mode === 'search')
      {
        iptConf.value = null
      }
      component.jqxDateTimeInput(iptConf)
    }
    // placeHolder: 'xxxxxx',
    // component: 'jqxInput',
  }
  return field
}
export async function buildComboField ({ entity, name, property, swagger, mode = 'edit', bus = false, definition, dataAdapters, width }) {
  // console.error('buildComboField', { entity, name, property, swagger, mode, definition, dataAdapters })
  const label = getFormLabel(property)
  let info = property.description
  // console.error({ entity, property, name, required });
  // console.error(swagger.definitions);
  definition = swagger.definitions[entity]
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  const isMultiple = isFormMultiple(property)
  let isEditable = getFormEditable(property)
  const formLimit = getFormSelectionLimit(property)
  const format = getFormat(property)
  const limitMessage = formLimit > 0 ? `You can select up to ${formLimit} items.` : formLimit < 0 ? 'You can\'t select any item.' : 'You can select unlimited items.'
  width = width || getDefaultFormWidth()
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  if (isMultiple) info = `${info}. ${limitMessage}`
  if (mode === 'create') isEditable = true
  if (mode === 'search') isEditable = true
  if (mode === 'view') isEditable = false
  if (mode === 'view') info = ''
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'custom',
    componentUsed: 'combo',
    foreignCollection,
    label,
    required,
    labelPosition: 'top',
    // labelWidth: '30%',
    align: 'left',
    // labelWidth: '80px',
    width,
    info,
    infoPosition: 'right',
    init: (component) => {
      let source = []
      if(property.enum)
      {
        source = property.enum
      }
      if(getFormOptions(property))
      {
        source = getFormOptions(property)
      }
      const iptConf = {
        // placeHolder: 'Start typing',
        // autoComplete: false,
        // autoOpen: true,
        minLength: 1,
        source,
        width,
        selectedIndex: -1,
        disabled: !isEditable,
        // promptText: "Please Choose:"
      }
      if (foreignCollection.collection) {
        if (dataAdapters[foreignCollection.collection]) {
          // width = width || getDefaultFormWidth()
          if (mode !== 'search' && mode !== 'view') iptConf.width = getDefaultFormWidth(-80)
          if (mode !== 'search' && mode !== 'view') field.width = getDefaultFormWidth(-80)
          iptConf.source = dataAdapters[foreignCollection.collection]
          iptConf.displayMember = foreignCollection.labelKey
          iptConf.valueMember = foreignCollection.valueKey
        }
      }
      if (format === 'country-code') {
        if (mode !== 'search' && mode !== 'view') iptConf.width = getDefaultFormWidth(-80)
        if (mode !== 'search' && mode !== 'view') field.width = getDefaultFormWidth(-80)
        iptConf.source = countryCodes.sort((a, b) => {
          if (a.Name > b.Name) {
            return 1;
          }
          if (a.Name < b.Name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })
        iptConf.displayMember = 'Name'
        iptConf.valueMember = 'Dial'
        // iptConf.autoDropDownHeight = true
        iptConf.renderer = (index, label, value) => {
          let table = `<table style="min-width: 150px;"><tr><td>${label} +${value}</td></tr></table>`
          countryCodes.forEach(co => {
            if (co.Name !== label) return
            
            const img = `${co.Unicode}`
            table = `<table style="min-width: 150px;"><tr><td style="width: 25px;" rowspan="2">${img}</td><td>${label} +${value}</td></tr></table>`
          })
          
          return table;
        }

      }
      if (isMultiple) {
        iptConf.multiSelect = true
      }
      
      component.jqxComboBox(iptConf)
      component.on('select', (event) => {
        // // // console.log(event.args);
        if (!event.args) return
        if (event.args.item === null) return
        const selectedItem = event.args.item
        const selectedDocument = selectedItem.originalItem
        const selectedValue = selectedItem.value
        const selectedLabel = selectedItem.label
        const dependents = getFieldDependents(property)
        bus.$emit('comboSelect', { entity, name, property, swagger, definition, selectedItem, selectedDocument, selectedValue, selectedLabel, dependents })
      })
    }
  }
  
  if(foreignCollection && format !== 'country-code')
  {
    const columns = {
      columns: [field, {
        name: `add_${foreignCollection.collection}`,
        type: 'button',
        text: '+',
        align: 'left',
        width: 30,
      }]
    }
    if (mode === 'search' || mode === 'view') return field
    return columns
  }
  return field
}
export async function buildAutoCompleteField ({ name, property, mode = 'edit', definition, dataAdapters, width }) {
  const label = getFormLabel(property)
  let info = property.description
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  // console.warn('buildAutoCompleteField', foreignCollection);
  const isMultiple = isFormMultiple(property)
  let isEditable = getFormEditable(property)
  const formLimit = getFormSelectionLimit(property)
  const limitMessage = formLimit > 0 ? `You can select up to ${formLimit} items.` : formLimit < 0 ? 'You can\'t select any item.' : 'You can select unlimited items.'
  width = width || getDefaultFormWidth(-80)
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  if (isMultiple) info = `${info}. ${limitMessage}`
  if (mode === 'create') isEditable = true
  if (mode === 'search') isEditable = true
  if (mode === 'view') isEditable = false
  if (mode === 'view') info = ''
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'text',
    componentUsed: 'autocomplete',
    foreignCollection,
    disabled: !isEditable,
    label,
    required,
    labelPosition: 'top',
    labelWidth: '30%',
    align: 'left',
    // labelWidth: '80px',
    width,
    info,
    infoPosition: 'right',
    // placeHolder: 'xxxxxx',
    // component: 'jqxDropDownList',
    // options: []
    // source: dataAdapters,
    // displayMember: "ContactName", valueMember: "CompanyName",
    init: async (component) => {
      const iptConf = {
        placeHolder: 'Start typing',
        minLength: 1,
        source: dataAdapters[foreignCollection.collection],
        displayMember: foreignCollection.labelKey,
        valueMember: foreignCollection.valueKey,
        width,
        disabled: !isEditable
      }
      if (isMultiple) {
        iptConf.source = function (query, response) {
          const item = query.split(/,\s*/).pop()
          // update the search query.
          component.jqxInput({
            query: item
          })
          response(dataAdapters[name].source)
        }
        iptConf.renderer = function (itemValue, inputValue) {
          const terms = inputValue.split(/,\s*/)
          // remove the current input
          terms.pop()
          // add the selected item
          terms.push(itemValue)
          // add placeholder to get the comma-and-space at the end
          terms.push('')
          const value = terms.join(', ')
          return value
        }
      }
      component.jqxInput(iptConf)
      component.jqxInput({
        valueMember: foreignCollection.valueKey
      })
      component.jqxInput({
        displayMember: foreignCollection.labelKey
      })
      component.on('change', function () {
        // // // console.log(value);
      })
    }
  }
  return field
}
export async function buildMultipleSelectField ({ entity, name, property, swagger, mode = 'edit', bus = false, definition, dataAdapters, width }) {
  // console.log('buildMultipleSelectField')
  const label = getFormLabel(property)
  let info = property.description
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  // console.warn('buildAutoCompleteField', foreignCollection);
  const isMultiple = isFormMultiple(property)
  let isEditable = getFormEditable(property)
  const isDependentOf = getFieldDependentOf(property)
  // // // console.log({property, isDependentOf});
  const formLimit = getFormSelectionLimit(property)
  const limitMessage = formLimit > 0 ? `You can select up to ${formLimit} items.` : formLimit < 0 ? 'You can\'t select any item.' : 'You can select unlimited items.'
  width = width ||  getDefaultFormWidth()
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  if (isMultiple) info = `${info}. ${limitMessage}`
  if (mode === 'create') isEditable = true
  if (mode === 'search') isEditable = true
  if (mode === 'view') isEditable = false
  if (mode === 'view') info = ''
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'custom',
    componentUsed: 'multipleselect',
    foreignCollection,
    disabled: !isEditable,
    label,
    required,
    labelPosition: 'top',
    labelWidth: '30%',
    align: 'left',
    // labelWidth: '80px',
    width,
    info,
    infoPosition: 'right',
    init: async (component) => {
      const iptConf = {
        multiple: isFormMultiple(property),
        displayMember: foreignCollection.labelKey,
        valueMember: foreignCollection.valueKey,
        width: `${(new Number(width.replace(/px/gi,''))) - 70}px`,
        height: 150,
        disabled: !isEditable
      }
      if (foreignCollection.collection) {
        if (dataAdapters[foreignCollection.collection]) {
          if (isDependentOf) {
            iptConf.source = []
          } else {
            iptConf.source = dataAdapters[foreignCollection.collection]
          }
        }
      }
      // console.log('iptConf', iptConf)
      component.jqxListBox(iptConf)
      component.on('select', (event) => {
        // // // console.log(event.args);
        if (!event.args) return
        if (event.args.item === null) return
        const selectedItem = event.args.item
        const selectedDocument = selectedItem.originalItem
        const selectedValue = selectedItem.value
        const selectedLabel = selectedItem.label
        const dependents = getFieldDependents(property)
        // // // console.log({ entity, name, property, swagger, definition, selectedItem, selectedDocument, selectedValue, selectedLabel, dependents })
        bus.$emit('listBoxSelect', { entity, name, property, swagger, definition, selectedItem, selectedDocument, selectedValue, selectedLabel, dependents })
      })
    }
  }
  // console.log('field', field)
  const columns = {
    columns: [field, {
      name: `add_${foreignCollection.collection}`,
      type: 'button',
      text: '+',
      align: 'left',
      width: 30,
    }]
  }
  if (mode === 'search' || mode === 'view') return field
  return columns
}




export async function buildCheckboxGroupField ({ entity, name, property, swagger, mode = 'edit', definition, width, dataAdapters }) {
  // console.log('buildSelectField', { entity, name, property, swagger, definition })
  const label = getFormLabel(property)
  let info = property.description
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  const isMultiple = isFormMultiple(property)
  let isEditable = getFormEditable(property)
  let format = getFormat(property)
  let fieldOptions = []  
  const formLimit = getFormSelectionLimit(property)
  const limitMessage = formLimit > 0 ? `You can select up to ${formLimit} items.` : formLimit < 0 ? 'You can\'t select any item.' : 'You can select unlimited items.'


  if(getFormOptions(property))
  {
    fieldOptions = getFormOptions(property)
  }
  if(foreignCollection)
  {
    if(dataAdapters[foreignCollection.collection])
    {
      fieldOptions = dataAdapters[foreignCollection.collection]
    }
  }

  width = width || getDefaultFormWidth()
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  if (isMultiple) info = `${info}. ${limitMessage}`
  if (mode === 'create') isEditable = true
  if (mode === 'search') isEditable = true
  if (mode === 'view') isEditable = false
  if (mode === 'view') info = ''
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'custom',
    componentUsed: 'select',
    label,
    required,
    labelPosition: 'top',
    // labelWidth: '30%',
    align: 'left',
    // labelWidth: '80px',
    width,
    info,
    infoPosition: 'right',
    foreignCollection,
    disabled: !isEditable,
    options: fieldOptions,
    // placeHolder: 'xxxxxx',
    component: 'jqxDropDownList',
    init: async (component) => {
      const iptConf = {
        width,
        disabled: !isEditable,
        source: fieldOptions,
        promptText: "Please Choose:"
      }
      if(foreignCollection)
      {
        if (mode !== 'search' && mode !== 'view') iptConf.width = getDefaultFormWidth(-80)
        if (mode !== 'search' && mode !== 'view') field.width = getDefaultFormWidth(-80)
        iptConf.displayMember = foreignCollection.labelKey
        iptConf.valueMember = foreignCollection.valueKey
        iptConf.autoDropDownHeight = true 
      }
      if (format === 'country-code') {
        if (mode !== 'search' && mode !== 'view') iptConf.width = getDefaultFormWidth(-80)
        if (mode !== 'search' && mode !== 'view') field.width = getDefaultFormWidth(-80)
        iptConf.source = countryCodes.sort((a, b) => {
          if (a.Name > b.Name) {
            return 1;
          }
          if (a.Name < b.Name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })
        iptConf.displayMember = 'Name'
        iptConf.valueMember = 'Dial'
        // iptConf.autoDropDownHeight = true
        iptConf.renderer = (index, label, value) => {
          let table = `<table style="min-width: 150px;"><tr><td>${label} +${value}</td></tr></table>`
          countryCodes.forEach(co => {
            if (co.Name !== label) return
            const img = `${co.Unicode}`
            table = `<table style="min-width: 150px;"><tr><td style="width: 25px;" rowspan="2">${img}</td><td>${label} +${value}</td></tr></table>`
          })
          
          return table;
        }

      }
      component.jqxDropDownList(iptConf)
    }
  }
  if(foreignCollection  && format !== 'country-code')
  {
    const columns = {
      columns: [field, {
        name: `add_${foreignCollection.collection}`,
        type: 'button',
        text: '+',
        align: 'left',
        width: 30,
      }]
    }
    if (mode === 'search' || mode === 'view') return field
    return columns
  }
  return field
}


export async function buildSelectField ({ entity, name, property, swagger, mode = 'edit', definition, width, dataAdapters }) {
  // console.log('buildSelectField', { entity, name, property, swagger, definition })
  const label = getFormLabel(property)
  let info = property.description
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  const isMultiple = isFormMultiple(property)
  let isEditable = getFormEditable(property)
  let format = getFormat(property)
  let fieldOptions = []  
  const formLimit = getFormSelectionLimit(property)
  const limitMessage = formLimit > 0 ? `You can select up to ${formLimit} items.` : formLimit < 0 ? 'You can\'t select any item.' : 'You can select unlimited items.'

  if(property.enum)
  {
    fieldOptions = property.enum
  }
  if(getFormOptions(property))
  {
    fieldOptions = getFormOptions(property)
  }
  if(foreignCollection)
  {
    if(dataAdapters[foreignCollection.collection])
    {
      fieldOptions = dataAdapters[foreignCollection.collection]
    }
  }

  width = width || getDefaultFormWidth()
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  if (isMultiple) info = `${info}. ${limitMessage}`
  if (mode === 'create') isEditable = true
  if (mode === 'search') isEditable = true
  if (mode === 'view') isEditable = false
  if (mode === 'view') info = ''
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'custom',
    componentUsed: 'select',
    label,
    required,
    labelPosition: 'top',
    // labelWidth: '30%',
    align: 'left',
    // labelWidth: '80px',
    width,
    info,
    infoPosition: 'right',
    foreignCollection,
    disabled: !isEditable,
    options: fieldOptions,
    // placeHolder: 'xxxxxx',
    component: 'jqxDropDownList',
    init: async (component) => {
      const iptConf = {
        width,
        disabled: !isEditable,
        source: fieldOptions,
        promptText: "Please Choose:"
      }
      if(foreignCollection)
      {
        if (mode !== 'search' && mode !== 'view') iptConf.width = getDefaultFormWidth(-80)
        if (mode !== 'search' && mode !== 'view') field.width = getDefaultFormWidth(-80)
        iptConf.displayMember = foreignCollection.labelKey
        iptConf.valueMember = foreignCollection.valueKey
        iptConf.autoDropDownHeight = true 
      }
      if (format === 'country-code') {
        if (mode !== 'search' && mode !== 'view') iptConf.width = getDefaultFormWidth(-80)
        if (mode !== 'search' && mode !== 'view') field.width = getDefaultFormWidth(-80)
        iptConf.source = countryCodes.sort((a, b) => {
          if (a.Name > b.Name) {
            return 1;
          }
          if (a.Name < b.Name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })
        iptConf.displayMember = 'Name'
        iptConf.valueMember = 'Dial'
        // iptConf.autoDropDownHeight = true
        iptConf.renderer = (index, label, value) => {
          let table = `<table style="min-width: 150px;"><tr><td>${label} +${value}</td></tr></table>`
          countryCodes.forEach(co => {
            if (co.Name !== label) return
            const img = `${co.Unicode}`
            table = `<table style="min-width: 150px;"><tr><td style="width: 25px;" rowspan="2">${img}</td><td>${label} +${value}</td></tr></table>`
          })
          
          return table;
        }

      }
      component.jqxDropDownList(iptConf)
    }
  }
  if(foreignCollection  && format !== 'country-code')
  {
    const columns = {
      columns: [field, {
        name: `add_${foreignCollection.collection}`,
        type: 'button',
        text: '+',
        align: 'left',
        width: 30,
      }]
    }
    if (mode === 'search' || mode === 'view') return field
    return columns
  }
  return field
}

function buildGridFieldToolbar (statusbar, name, mode, bus, isUploader) {
  // console.log('buildGridFieldToolbar', {isUploader})
  const container = $("<div style='overflow: hidden; position: relative; margin: 5px;'></div>")
  const addButton = $(`<div style='float: left; margin-left: 5px;' title="${isUploader ? 'upload' : 'add'}  ${name}"><i aria-hidden='true' class='material-icons'>add</i><span style='margin-left: 4px; position: relative; top: -3px;'></span></div>`)
  const editButton = $(`<div style='float: left; margin-left: 5px;' title="${isUploader && mode === 'edit' ? 'download' : 'edit'}  ${name}"><i aria-hidden='true' class='material-icons'>${isUploader && mode === 'edit' ? 'cloud_download' : 'edit'}</i><span style='margin-left: 4px; position: relative; top: -3px;'></span></div>`)
  const deleteButton = $(`<div style='float: left; margin-left: 5px;' title="Delete ${name}"><i aria-hidden='true' class='material-icons'>delete</i><span style='margin-left: 4px; position: relative; top: -3px;'></span></div>`)
  if (mode === 'edit') container.append(addButton)
  container.append(editButton)
  if (mode === 'edit') container.append(deleteButton)
  editButton.jqxButton({
    width: 60,
    height: 20
  })
  editButton.click(() => {
    // // // console.log('bus', bus);
    if (!isUploader) if (bus) bus.$emit('saveAndAddSchema', name)
    if (isUploader) {
      if (mode === 'edit') {
        if (bus) bus.$emit('downloadFile', name)
      } else if (mode === 'create') {
        if (bus) bus.$emit('saveAndAddSchema', name)
      }
    }
  })
  
  if (mode === 'edit') {
    deleteButton.jqxButton({
      width: 60,
      height: 20
    })
    deleteButton.click(() => {
      // // // console.log('bus', bus);
      if (bus) bus.$emit('deleteSchema', name)
    })
    addButton.jqxButton({
      width: 60,
      height: 20
    })
    addButton.click(() => {
      // // // console.log('bus', bus);
      if (bus) bus.$emit('addSchema', name)
    })
  }
  // add new row.
  statusbar.append(container)
}
export async function buildGridField ({ entity, name, property, swagger, mode = 'edit', bus = false, definition, dataAdapters, width }) {
  const label = getFormLabel(property)
  let info = property.description
  // console.error('buildGridField', { entity, name, property, definition, swagger, dataAdapters})
  const required = getFormRequired(definition, name)
  const foreignCollection = getForeignCollection(property)
  const isMultiple = isFormMultiple(property)
  const schema = getSchema(swagger, property)
  const formLimit = getFormSelectionLimit(property)
  width = width ||  getDefaultFormWidth()
  if (required) info = `${info}. It is a mandatory field.`
  if (!required) info = `${info}. It is not a mandatory field.`
  if (isMultiple) info = `${info}. Mandatory: ${required}. You can pick up to ${formLimit}`
  if (mode === 'view') info = ''
  const field = {
    bind: name,
    id: name,
    name: name,
    type: 'custom',
    componentUsed: 'grid',
    foreignCollection,
    label,
    required,
    labelPosition: 'top',
    align: 'left',
    width,
    height: 200,
    info,
    infoPosition: 'right',
    init: async (component) => {
      // inject grid html template into DOM
      component.html(formGridTemplate(name))
      // get grid wapper
      if (!schema) throw new Error('it is not a schema')
      await buildGridFieldGrid({ entity, name, property, swagger, mode , bus, schema, definition, width, dataAdapters });
    }
  }
  // console.error(field)
  return field
}
async function buildGridFieldGrid ({ entity, name, property, swagger, mode = 'edit', bus = false, definition, schema, dataAdapters, width }) {
  // console.error('buildGridFieldGrid')
  const grid = $(`#xForm_grid_${name}`)
  // set grid columns
  const columns = setGridHeaders(schema.properties)
  // console.warn('columns', columns)
  width = width ||  getDefaultFormWidth()
  /* expander.on('expanded', async function (event) {
    // is adding or creating
    let mode = expander.attr("mode") || 'create';
    //// // // console.log(mode);
    //// // // console.log('expanded', event);
    if(parentTag)
    {
      parentTag.html(`<div id="xForm_expander_form_${name}"></div>`);
    }
    form = await buildGridFieldForm(schema, name, entity, definition, swagger, mode);

    parentTag = $(`#xForm_expander_form_${name}`).parent();
    //
    // // // console.log(parentTag)
  });
  expander.on('collapsed', function (event) {
    form.jqxForm('destroy');
    form = null;
  }); */
  // console.warn({schema, name, entity, definition, swagger, dataAdapters});
  const entityId = window.getApp.$router.currentRoute.params.id
  // // // console.log('entityId', entityId);
  let response = {}
  if (entityId) {
    response = await getOnLocalCollection(entity, entityId)
  }
  const { error, data } = response
  !!error && console.error(error)
  const source = {
    localdata: data ? data[name] : [],
    datatype: 'array',
    datafields: setDataFields(schema.properties, dataAdapters),
    id: '_id'
  }

  const isUploader = getFormIsUploader(property)
  // console.error('isUploader', isUploader)

  // // // console.log('SOURCE', source);
  const dataAdapter = new $.jqx.dataAdapter(source)
  // create grid
  grid.jqxGrid({
    width,
    height: 200,
    source: dataAdapter,
    // pageable: true,
    // pagesize: this.pagination.rowsPerPage,
    // autoheight: true,
    sortable: true,
    altrows: true,
    enabletooltips: true,
    // editable: true,
    // editmode: 'dblclick',
    columnsresize: true,
    adaptive: is.mobile(),
    selectionmode: 'singlerow',
    showtoolbar: true,
    rendertoolbar: (statusbar) => {
      buildGridFieldToolbar(statusbar, name, mode, bus, isUploader)
    },
    // rowdetails: true,
    // rowdetailstemplate: { rowdetails: rowDetailTemplate, rowdetailsheight: 50 },
    // initrowdetails: gridInitRowDetail.bind(this),
    // rowsheight: 35,
    ready: () => {},
    columns: columns
  })
  grid.on('rowselect', (event) => {
    bus.$emit('rowselect', { event, entity, name, property, swagger, mode, definition, schema })
  })
  return grid
}
export function setDataFields (properties, dataAdapters = {}) {
  // console.warn('setDataFields', {properties, dataAdapters})
  const fields = []
  for (const name in properties) {
    if (properties.hasOwnProperty(name)) {
      // if (name === '_id') continue;
      const property = properties[name]
      const type = property.type
      const field = { name, type }
      const foreignCollection = getForeignCollection(property)
      if (foreignCollection) {
        let source = []
        if (dataAdapters[foreignCollection.collection]) {
          source = dataAdapters[foreignCollection.collection] ? dataAdapters[foreignCollection.collection]._source.localdata : []
        }
        const ffield = { name: foreignCollection.collection }
        ffield.value = name
        ffield.values = {
          source,
          name: foreignCollection.labelKey,
          value: foreignCollection.valueKey
        }
        fields.push(ffield)
        // // // console.log('setDataFields', field);
      }
      fields.push(field)
    }
  }
  return fields
}
export function getSchema (swagger, property) {
  let schema = false
  if (isSchema(property)) {
    let refArray = property.items.$ref.split('/')
    let schemaName = refArray[refArray.length - 1]
    schema = swagger.definitions[schemaName]
  }
  return schema
}

export function convertFromSwagger (fieldName, config, required = false) {
  console.log('convertFromSwagger', config)
  return {
    name: fieldName,
    id: `${fieldName}_${(new Date()).getTime()}`,
    spec: {
      type: config.type,
      format: config.format || '',
      description: config.description || '',
      example: config.example || '',
      minLength: config.minLength || 0,
      maxLength: config.maxLength || 0,
      readOnly: config.readOnly || false,
      'x-editable': config['x-editable'] || true,
      'x-format': config['x-format'] || 'none',
      'x-required': required || false,
      'x-dom': {
        type: convertSwaggerTypeToDataType(config.type),
        required: [required, 'Field is required.'],
        // ref: ''
      },
      'x-ui': config['x-ui']
    }
  }
}

export function convertSwaggerTypeToDataType (sType) {
  // 'string', 'number', 'integer', 'array', 'object', 'boolean'
  if (sType === 'number') return Number
  if (sType === 'integer') return Number
  if (sType === 'array') return []
  if (sType === 'object') return {}
  return String
}


export function getSchemaName (swagger, property) {
  let schema = false
  if (isSchema(property)) {
    let refArray = property.items.$ref.split('/')
    schema = refArray[refArray.length - 1]
  }
  return schema
}

export function getFormHash ({ form, definition, mode = 'create' }) {
  const hash = {}
  console.log('getFormHash', { form, definition });
  const properties = definition.properties
  for (const name in properties) {
    if (properties.hasOwnProperty(name)) {
      if (name === '_id') continue
      // console.warn(name)
      const property = properties[name]
      const readOnly = property.readOnly
      const isHide = isFormHide(property)
      if (isHide) continue
      let jqField = form.jqxForm('getComponentByName', name) // nom === jqxInput
      const xuiType = getFormType(property)
      if (mode === 'edit') {
        // if (!isEditable) continue;
        // some 'non editable fields' may be required properties
      }
      if (readOnly) continue
      if (xuiType === 'text') {
        // // console.log(jqField.jqxInput)
        if (!is.undefined(jqField.val())) { hash[name] = jqField.val() }
      } else if (xuiType === 'autocomplete') {
        if (!is.undefined(jqField.jqxInput.val())) { hash[name] = jqField.jqxInput.val() }
      } else if (xuiType === 'date') {
        // console.log(jqField.jqxDateTimeInput('val'))
        // console.log((new Date(jqField.jqxDateTimeInput('val'))).toISOString())
        if (isDate(jqField.jqxDateTimeInput('val'))) { 
          hash[name] = (new Date(jqField.jqxDateTimeInput('val'))).toISOString() 
        }
      } else if (xuiType === 'password') {

        if (!is.undefined(jqField.jqxPasswordInput('val'))) { 
          hash[name] = jqField.jqxPasswordInput('val')
        }
      } else if (xuiType === 'integer' || xuiType === 'currency' || xuiType === 'number') {
        if (!is.undefined(jqField.jqxNumberInput('val'))) { hash[name] = jqField.jqxNumberInput('val') }
      } else if (xuiType === 'editor') {
        jqField = $(`#xeditor_${name}`)
        if (!is.undefined(jqField.jqxEditor('val'))) { hash[name] = jqField.jqxEditor('val') }
      } else if (xuiType === 'file') {
        jqField = $(`#xfile_${name}`)
        // if (!is.undefined(jqField.jqxEditor('val'))) { hash[name] = jqField.jqxEditor('val') }
      } else if (xuiType === 'base64') {
        jqField = $(`#xfile_base64_${name}`)
        if (!is.undefined(jqField.attr('value'))) { hash[name] = jqField.attr('value') }
      } else if (xuiType === 'switch') {
        if (!is.undefined(jqField.jqxSwitchButton('checked'))) { hash[name] = jqField.jqxSwitchButton('checked') }
      } else if (xuiType === 'datetime') {
        // console.log(jqField.jqxDateTimeInput('val'))
        // console.log((new Date(jqField.jqxDateTimeInput('val'))).toISOString())
        if (isDate(jqField.jqxDateTimeInput('val'))) { 
          hash[name] = (new Date(jqField.jqxDateTimeInput('val'))).toISOString()
        }
      } else if (xuiType === 'combobox' || xuiType === 'combo') {
        alert();
        const selectedIndex = jqField.jqxComboBox('selectedIndex')
        const selectedItem = jqField.jqxComboBox('getItem', selectedIndex)
        console.error(`${selectedIndex} `, selectedItem)
        if (selectedItem) {
          const selectedValue = selectedItem.value
          if (!is.undefined(selectedValue)) hash[name] = selectedValue
        }
      } else if (xuiType === 'grid') {
        // hash[name] = jqField.jqxInput.val()
        const grid = $(`#xForm_grid_${name}`)
        const rows = grid.jqxGrid('getrows')
        console.warn('rows', rows)
        // if (rows.length > 0) hash[name] = rows
      } else if (xuiType === 'multipleselect') {
        const result = []
        const items = jqField.jqxListBox('getSelectedItems')
        items.forEach(item => {
          const selectedValue = item.value
          result.push(selectedValue)
        })
        hash[name] = result
      } else if (xuiType === 'select') {
        const item = jqField.jqxDropDownList('getSelectedItem')
        if (item) {
          hash[name] = item.value
        }
      }
      // // // console.log('>>>>>>>>>>>>>>>', field);
    }
  }
  return hash
}
export function getFormPayload (form, template) {
  const hash = {}
  // // // console.log('template----->', template);
  template.forEach(fieldObject => {
    let component = form.jqxForm('getComponentByName', fieldObject.name)
    // // // console.log(fieldObject);
    if (fieldObject.type === 'text') {
      const input = component.jqxInput('val')
      // console.error('input', input);
      if (input.value) hash[fieldObject.name] = input.value
    }
    else if (fieldObject.componentUsed === 'editor') {
      component = $(`#xeditor_${fieldObject.name}`)
      const value = component.jqxEditor('val')
      console.log('editor', value)
      // console.error('input', input);
      if (value) hash[fieldObject.name] = value
    } 
    else if (fieldObject.componentUsed === 'combo') {
      const result = []
      const items = component.jqxComboBox('getSelectedItems')
      $.each(items, function () {
        // // // console.log(this);
        // this.label
        // this.value
        result.push(this.value)
      })
      hash[fieldObject.name] = result
    } 
    else if (fieldObject.componentUsed === 'multipleselect') {
      const result = []
      const items = component.jqxListBox('getSelectedItems')
      $.each(items, function () {
        // // // console.log(this);
        // this.label
        // this.value
        result.push(this.value)
      })
      hash[fieldObject.name] = result
    } else if (fieldObject.componentUsed === 'autocomplete') {
      const input = component.jqxInput('val')
      // console.error('input', input);
      if (input.value) hash[fieldObject.name] = input.value
    } else if (fieldObject.componentUsed === 'grid') {}
  })
  /// / // // console.log('hash----->', hash);
  return hash
}
/* export async function setFormPayload (form, template, entity, primaryKeyValue, name = false, subDocumentId = false) {
  console.warn('setFormPayload')
  const { data } = await getOnLocalCollection(entity, primaryKeyValue)
  console.warn('data', data)
  console.warn('template', template)
  template.forEach(async fieldObject => {
    console.log(fieldObject)
    if (is.undefined(fieldObject.name)) return
    let found = false
    if (name) {
      data[name].forEach((subDocument, i) => {
        if (subDocument._id === subDocumentId) { found = subDocument }
      })
    } else {
      found = data
    }
    
    const val = found[fieldObject.name]
    console.warn('val', val)
    if (is.undefined(val)) return
    // console.log(`setFormPayload ${fieldObject.name} ${fieldObject.componentUsed}`, val);
    let component = form.jqxForm('getComponentByName', fieldObject.name)
    // console.log('=-=-=-=-=-=-=-=-=-=>>', fieldObject)
    if (fieldObject.type === 'text') component.jqxInput('val', val)
    else if (fieldObject.type === 'password') {
      component.jqxPasswordInput('val', '')
    }
    else if (fieldObject.type === 'date') {
      if (isDate(val)) component.jqxDateTimeInput('value', new Date(val))
    }
    else if (fieldObject.type === 'date-time') {
      if (isDate(val)) component.jqxDateTimeInput('value', new Date(val))
    }

    if (fieldObject.componentUsed === 'switch') {
      component.jqxSwitchButton({ checked: !!val })
    } else if (fieldObject.componentUsed === 'integer') {
      component.jqxNumberInput('val', val)
    } else if (fieldObject.componentUsed === 'password') {
      component.jqxPasswordInput('val', '')
    } else if (fieldObject.componentUsed === 'editor') {
      component = $(`#xeditor_${fieldObject.name}`)
      component.jqxEditor('val', val)
    } else if (fieldObject.componentUsed === 'combo' || fieldObject.componentUsed === 'combobox') {
      window.setTimeout(() => {
        /// / // console.log(val, component.jqxComboBox('getItemByValue', val))
        const item = component.jqxComboBox('getItemByValue', val)
        if (item) component.jqxComboBox('selectIndex', item.index)
      }, 400)
    } else if (fieldObject.componentUsed === 'select') {
      window.setTimeout(() => {
        /// / // console.log(val, component.jqxComboBox('getItemByValue', val))
        const item = component.jqxDropDownList('getItemByValue', val)
        if (item) component.jqxDropDownList('selectIndex', item.index)
      }, 400)
    } else if (fieldObject.componentUsed === 'base64') {
      // console.warn('base64')
      // console.warn(val)
      // console.warn($(`#xfile_image_${fieldObject.name}`))
      component = $(`#xfile_image_${fieldObject.name}`)

      if (val !== '' && val !== null) component.attr('src', val)
      $(`#xfile_base64_${fieldObject.name}`).attr('value', val)
      
    } else if (fieldObject.componentUsed === 'autocomplete') {
      window.setTimeout(() => {
        component.jqxInput('val', val)
      }, 400)
    } else if (fieldObject.componentUsed === 'grid') {
    } 
    else if (fieldObject.componentUsed === 'multipleselect') {
      window.setTimeout(() => {
        const val = found[fieldObject.name]
        const items = component.jqxListBox('getItems')
        val.forEach(v => {
          items.forEach(i => {
            // // console.log(i, v)
            if (i.value === v) {
              component.jqxListBox('selectIndex', i.index)
            }
          })
        })
      }, 1000)
    }
  })
} */


export function setFormPayload (form, properties, data) {
  // console.warn('setFormPayload', {form, properties, data})
  for (const name in properties) {
    if (properties.hasOwnProperty(name)) {
      const property = properties[name]
      if (is.undefined(property)) return
      const xuiType = getFormType(property)
      const val = data[name]
      if (is.undefined(val)) return
      // console.log(`setFormPayload ${name} ${xuiType}`, val);
      let component = form.jqxForm('getComponentByName', name)
      // console.log('=-=-=-=-=-=-=-=-=-=>>', fieldObject)
      if (property.type === 'text') component.jqxInput('val', val)
      else if (property.type === 'date') {
        if (isDate(val)) component.jqxDateTimeInput('value', new Date(val))
      }
      else if (property.type === 'password') {
        // if (isDate(val)) component.jqxDateTimeInput('value', new Date(val))
      }
      else if (property.type === 'date-time') {
        if (isDate(val)) component.jqxDateTimeInput('value', new Date(val))
      }

      if (xuiType === 'switch') {
        component.jqxSwitchButton({ checked: !!val })
      } else if (xuiType === 'password') {
        // component.jqxNumberInput('val', val)
      } else if (xuiType === 'integer') {
        component.jqxNumberInput('val', val)
      } else if (xuiType === 'editor') {
        component = $(`#xeditor_${name}`)
        component.jqxEditor('val', val)
      } else if (xuiType === 'combo' || xuiType === 'combobox') {
        window.setTimeout(() => {
          /// / // console.log(val, component.jqxComboBox('getItemByValue', val))
          const item = component.jqxComboBox('getItemByValue', val)
          if (item) component.jqxComboBox('selectIndex', item.index)
        }, 400)
      } else if (xuiType === 'select') {
        window.setTimeout(() => {
          /// / // console.log(val, component.jqxComboBox('getItemByValue', val))
          const item = component.jqxDropDownList('getItemByValue', val)
          if (item) component.jqxDropDownList('selectIndex', item.index)
        }, 400)
      } else if (xuiType === 'base64') {
        // console.warn('base64')
        // console.warn(val)
        // console.warn($(`#xfile_image_${name}`))
        component = $(`#xfile_image_${name}`)

        if (val !== '' && val !== null) component.attr('src', val)
        $(`#xfile_base64_${name}`).attr('value', val)
        
      } else if (xuiType === 'autocomplete') {
        window.setTimeout(() => {
          component.jqxInput('val', val)
        }, 400)
      } else if (xuiType === 'grid') {
      } 
      else if (xuiType === 'multipleselect') {
        window.setTimeout(() => {
          const val = data[name]
          const items = component.jqxListBox('getItems')
          val.forEach(v => {
            items.forEach(i => {
              // // console.log(i, v)
              if (i.value === v) {
                component.jqxListBox('selectIndex', i.index)
              }
            })
          })
        }, 1000)
      }
    }
  }
}

export function setSchemaFormPayload (form, template, data) {
  // console.warn('setFormPayload')
  template.forEach(async fieldObject => {
    if (is.undefined(fieldObject.name)) return
    
    const val = data[fieldObject.name]
    if (is.undefined(val)) return
    // console.log(`setFormPayload ${fieldObject.name} ${fieldObject.componentUsed}`, val);
    let component = form.jqxForm('getComponentByName', fieldObject.name)
    // console.log('=-=-=-=-=-=-=-=-=-=>>', fieldObject)
    if (fieldObject.type === 'text') component.jqxInput('val', val)
    else if (fieldObject.type === 'date') {
      if (isDate(val)) component.jqxDateTimeInput('value', new Date(val))
    }
    else if (fieldObject.type === 'password') {
      // if (isDate(val)) component.jqxDateTimeInput('value', new Date(val))
    }
    else if (fieldObject.type === 'date-time') {
      if (isDate(val)) component.jqxDateTimeInput('value', new Date(val))
    }

    if (fieldObject.componentUsed === 'switch') {
      component.jqxSwitchButton({ checked: !!val })
    } else if (fieldObject.componentUsed === 'password') {
      // component.jqxNumberInput('val', val)
    } else if (fieldObject.componentUsed === 'integer') {
      component.jqxNumberInput('val', val)
    } else if (fieldObject.componentUsed === 'editor') {
      component = $(`#xeditor_${fieldObject.name}`)
      component.jqxEditor('val', val)
    } else if (fieldObject.componentUsed === 'combo' || fieldObject.componentUsed === 'combobox') {
      window.setTimeout(() => {
        /// / // console.log(val, component.jqxComboBox('getItemByValue', val))
        const item = component.jqxComboBox('getItemByValue', val)
        if (item) component.jqxComboBox('selectIndex', item.index)
      }, 400)
    } else if (fieldObject.componentUsed === 'select') {
      window.setTimeout(() => {
        /// / // console.log(val, component.jqxComboBox('getItemByValue', val))
        const item = component.jqxDropDownList('getItemByValue', val)
        if (item) component.jqxDropDownList('selectIndex', item.index)
      }, 400)
    } else if (fieldObject.componentUsed === 'base64') {
      // console.warn('base64')
      // console.warn(val)
      // console.warn($(`#xfile_image_${fieldObject.name}`))
      component = $(`#xfile_image_${fieldObject.name}`)

      if (val !== '' && val !== null) component.attr('src', val)
      $(`#xfile_base64_${fieldObject.name}`).attr('value', val)
      
    } else if (fieldObject.componentUsed === 'autocomplete') {
      window.setTimeout(() => {
        component.jqxInput('val', val)
      }, 400)
    } else if (fieldObject.componentUsed === 'grid') {
    } 
    else if (fieldObject.componentUsed === 'multipleselect') {
      window.setTimeout(() => {
        const val = found[fieldObject.name]
        const items = component.jqxListBox('getItems')
        val.forEach(v => {
          items.forEach(i => {
            // // console.log(i, v)
            if (i.value === v) {
              component.jqxListBox('selectIndex', i.index)
            }
          })
        })
      }, 1000)
    }
  })
}

export async function setClearFormPayload (form, template) {
  // console.warn('setFormPayload')
  template.forEach(async fieldObject => {
    if (is.undefined(fieldObject.name)) return
    // console.log(`setFormPayload ${fieldObject.name} ${fieldObject.componentUsed}`, val);
    let component = form.jqxForm('getComponentByName', fieldObject.name)
    // console.log('=-=-=-=-=-=-=-=-=-=>>', fieldObject)
    if (fieldObject.type === 'text')
    {
       try {
        component.jqxInput('val', '')
       } catch(e) {
        component.jqxMaskedInput('val', '')
       }
       // 
    }
    else if (fieldObject.type === 'date') {
      if (isDate(val)) component.jqxDateTimeInput('value', null)
    }
    else if (fieldObject.type === 'date-time') {
      if (isDate(val)) component.jqxDateTimeInput('value', null)
    }

    if (fieldObject.componentUsed === 'switch') {
      component.jqxSwitchButton({ checked: false })
    } else if (fieldObject.componentUsed === 'integer') {
      component.jqxNumberInput('val', null)
    } else if (fieldObject.componentUsed === 'editor') {
      component = $(`#xeditor_${fieldObject.name}`)
      component.jqxEditor('val', '')
    } else if (fieldObject.componentUsed === 'combo' || fieldObject.componentUsed === 'combobox') {
     component.jqxComboBox('selectIndex', -1)
    } else if (fieldObject.componentUsed === 'select') {
      component.jqxDropDownList('selectIndex', -1)
    } else if (fieldObject.componentUsed === 'base64') {
      // console.warn('base64')
      // console.warn(val)
      // console.warn($(`#xfile_image_${fieldObject.name}`))
      component = $(`#xfile_image_${fieldObject.name}`)
      component.attr('src', '/static/avatar.png')
      $(`#xfile_base64_${fieldObject.name}`).attr('value', '')
      
    } else if (fieldObject.componentUsed === 'autocomplete') {
     component.jqxInput('val', '')
    } else if (fieldObject.componentUsed === 'grid') {
    } 
    else if (fieldObject.componentUsed === 'multipleselect') {
       component.jqxListBox('selectIndex', -1)
    }
  })
}

export const setFormValidatorRules = (jqForm, definition, mode = 'edit') => {
  // console.log('---------====>>>>> setFormValidatorsRules', definition)
  const properties = definition.properties
  const rules = []
  for (const name in properties) {
    if (properties.hasOwnProperty(name)) {
      if (name === '_id') continue
      const property = properties[name]
      const xuiType = getFormType(property)
      if(xuiType === 'editor') continue
      const label = getFormLabel(property)
      const required = getFormRequired(definition, name)
      const minLength = getMinLength(property)
      const maxLength = getMaxLength(property)
      const isEditable = getFormEditable(property)
      const readOnly = property.readOnly
      let format = getFormat(property)
      const jqField = jqForm.jqxForm('getComponentByName', name) // nom === jqxInput
      if (readOnly) {
        continue
      }
      if (mode === 'edit') {
        if (!isEditable) {
          continue
        }
      }
      if (required) {
        rules.push({
          input: jqField,
          message: `${label} is required!`,
          action: 'blur, keyup',
          rule: () => {
            // // // console.log(jqField.val());
            if (jqField.val().toString().length > 0) { return true } else { return false }
          }
        })
      }
      if (format === 'ssn') {
        rules.push({
          input: jqField,
          message: `${label} is invalid!`,
          action: 'blur, keyup',
          rule: () => {
            // // // console.log(jqField.val());
            return is.socialSecurityNumber(jqField.val().toString())
          }
        })
      }
      if (format === 'email') {
        rules.push({
          input: jqField,
          message: `${label} is invalid!`,
          action: 'blur, keyup',
          rule: 'email'
        })
      }
      if (minLength) {
        rules.push({
          input: jqField,
          message: `At least ${minLength} chars is required!`,
          action: 'blur, keyup',
          rule: `minLength=${minLength}`
        })
      }
      if (maxLength) {
        rules.push({
          input: jqField,
          message: `It can have up to ${maxLength} chars!`,
          action: 'blur, keyup',
          rule: `maxLength=${maxLength}`
        })
      }
      // }
    }
  }
  return rules
}
const formGridTemplate = (name = '') => {
  return `<div id="xForm_grid_${name}" style="border:none; width: 100%;"></div>`
}
const dateRenderer = (row, column, value) => {
  if (isDate(value)) return moment(value).format('MM-DD-YYYY')
  return ''
}
const dateTimeRenderer = (row, column, value) => {
  if (isDate(value)) return moment(value).format('MM-DD-YYYY HH:mm')
  return ''
}
const subArrayRenderer = (row, column, value) => {
  // // // console.log('column', {row, column, value});
  if (typeof value === 'string') {
    if (value.toString(', ').indexOf() > 0) {
      value = value.toString().split(', ')
    } else if (value.toString(',').indexOf() > 0) {
      value = value.toString().split(',')
    } else {
      value = value.toString() !== '' ? [value] : []
    }
    return `<b>${value.length}</b>`
  } else if (Array.isArray(value)) {
    return `<b>${value.length > 0 ? (value.length) : 0}</b>`
  }
}
const subArrayOfSchemaRenderer = (row, column, value) => {
  // // // console.log('column', {row, column, value});
  if (typeof value === 'string') {
    if (value.toString(', ').indexOf() > 0) {
      value = value.toString().split(', ')
    } else if (value.toString(',').indexOf() > 0) {
      value = value.toString().split(',')
    } else {
      value = value.toString() !== '' ? [value] : []
    }
    return `<b>${value.length}</b>`
  } else if (Array.isArray(value)) {
    return `<b>${value.length > 0 ? (value.length) : 0}</b>`
  }
}

export const isMultiOptionField = (type) => {
  if (type === 'select') return true
  if (type === 'combobox') return true
  if (type === 'autocomplete') return true
  if (type === 'grid') return true
  return false
}
export const canFormat = (type) => {
  if (type === 'number') return true
  if (type === 'text') return true
  return false
}
export const canSetLength = (type) => {
  if (type === 'number') return true
  if (type === 'text') return true
  if (type === 'textarea') return true
  return false
}
export const getParenWidth = (id) => {
  return $(`#parent_${id}`).width()
}




export const clearMarks = (string) => {
  // // // console.log('column', {row, column, value});
  string = string.replace(/___-__-____/gi, "");
  return string
}
export function speak(text) {
  const language = 'en-US'
  const msg = new window.SpeechSynthesisUtterance()
  const voices = window.speechSynthesis.getVoices()
  let voice = voices[0]
  window.speechSynthesis.getVoices().forEach(function (v) {
    // console.log(v)
    if (v.name === 'Alex') {
      voice = v
    }
  })

  msg.onend = function (e) {
    console.log('Finished in ' + e.elapsedTime + ' seconds.')
  }
  window.setTimeout(() => {
    msg.voice = voice // Note: some voices don't support altering params
    msg.voiceURI = 'native'
    msg.volume = 0.5 // 0 to 1
    msg.rate = 1 // 0.1 to 10
    msg.pitch = 1 // 0 to 2
    msg.text = text
    msg.lang = language
    window.speechSynthesis.speak(msg)
  }, 200)
}


export const getEntities = (definitions = {}) => {
  const _definitions = {...definitions}
  const entities = []
  for (const name in _definitions) {
    if (_definitions.hasOwnProperty(name)) {
      if (name.indexOf('_') > -1) { 
        continue;
      }
      entities.push({
        name,
        spec: _definitions[name]
      })
    }
  }
  return entities
}
export function getIconClass (property, isOid) {
    let file = 'text_field'

    const type = property.type
    const xuiType = getFormType(property)
    const mask = getFormMask(property)
    const format = getFormat(property)
    const isUploader = getFormIsUploader(property)
    const collectionSetings = getFieldCollectionSettings(property)


    if (isUploader) {
      file = 'mupload_field'
    }
    if (format === 'date' || format === 'date-time') {
      file = 'date_field'
    }

    if (format === 'base64') {
      file = 'supload_field'
    }

    if (type === 'boolean') {
      file = 'boolean_field'
    }

    if (type === 'integer') {
      file = 'integer_field'
    }

    if (collectionSetings) {
      file = 'foreign_key'
    }

  if (isOid) { 
    file = 'oid_field'
  }
    return file
  }

export const getEntityProperties = (properties = {}) => {
  const _properties = {...properties}
  const props = []
  for (const name in _properties) {
    if (_properties.hasOwnProperty(name)) {
      props.push({
        name,
        spec: _properties[name]
      })
    }
  }
  return props
}

const countryCodes = [{
    "Iso2": "BD",
    "Name": "Bangladesh",
    "Iso3": "BGD",
    "Unicode": "🇧🇩",
    "Dial": "880",
    "Currency": "BDT",
    "Capital": "Dhaka",
    "Continent": "AS"
  },
  {
    "Iso2": "BE",
    "Name": "Belgium",
    "Iso3": "BEL",
    "Unicode": "🇧🇪",
    "Dial": "32",
    "Currency": "EUR",
    "Capital": "Brussels",
    "Continent": "EU"
  },
  {
    "Iso2": "BF",
    "Name": "Burkina Faso",
    "Iso3": "BFA",
    "Unicode": "🇧🇫",
    "Dial": "226",
    "Currency": "XOF",
    "Capital": "Ouagadougou",
    "Continent": "AF"
  },
  {
    "Iso2": "BG",
    "Name": "Bulgaria",
    "Iso3": "BGR",
    "Unicode": "🇧🇬",
    "Dial": "359",
    "Currency": "BGN",
    "Capital": "Sofia",
    "Continent": "EU"
  },
  {
    "Iso2": "BA",
    "Name": "Bosnia and Herzegovina",
    "Iso3": "BIH",
    "Unicode": "🇧🇦",
    "Dial": "387",
    "Currency": "BAM",
    "Capital": "Sarajevo",
    "Continent": "EU"
  },
  {
    "Iso2": "BB",
    "Name": "Barbados",
    "Iso3": "BRB",
    "Unicode": "🇧🇧",
    "Dial": "+1-246",
    "Currency": "BBD",
    "Capital": "Bridgetown",
    "Continent": "NA"
  },
  {
    "Iso2": "WF",
    "Name": "Wallis and Futuna",
    "Iso3": "WLF",
    "Unicode": "🇼🇫",
    "Dial": "681",
    "Currency": "XPF",
    "Capital": "Mata Utu",
    "Continent": "OC"
  },
  {
    "Iso2": "BL",
    "Name": "Saint Barthelemy",
    "Iso3": "BLM",
    "Unicode": "🇧🇱",
    "Dial": "590",
    "Currency": "EUR",
    "Capital": "Gustavia",
    "Continent": "NA"
  },
  {
    "Iso2": "BM",
    "Name": "Bermuda",
    "Iso3": "BMU",
    "Unicode": "🇧🇲",
    "Dial": "+1-441",
    "Currency": "BMD",
    "Capital": "Hamilton",
    "Continent": "NA"
  },
  {
    "Iso2": "BN",
    "Name": "Brunei",
    "Iso3": "BRN",
    "Unicode": "🇧🇳",
    "Dial": "673",
    "Currency": "BND",
    "Capital": "Bandar Seri Begawan",
    "Continent": "AS"
  },
  {
    "Iso2": "BO",
    "Name": "Bolivia",
    "Iso3": "BOL",
    "Unicode": "🇧🇴",
    "Dial": "591",
    "Currency": "BOB",
    "Capital": "Sucre",
    "Continent": "SA"
  },
  {
    "Iso2": "BH",
    "Name": "Bahrain",
    "Iso3": "BHR",
    "Unicode": "🇧🇭",
    "Dial": "973",
    "Currency": "BHD",
    "Capital": "Manama",
    "Continent": "AS"
  },
  {
    "Iso2": "BI",
    "Name": "Burundi",
    "Iso3": "BDI",
    "Unicode": "🇧🇮",
    "Dial": "257",
    "Currency": "BIF",
    "Capital": "Bujumbura",
    "Continent": "AF"
  },
  {
    "Iso2": "BJ",
    "Name": "Benin",
    "Iso3": "BEN",
    "Unicode": "🇧🇯",
    "Dial": "229",
    "Currency": "XOF",
    "Capital": "Porto-Novo",
    "Continent": "AF"
  },
  {
    "Iso2": "BT",
    "Name": "Bhutan",
    "Iso3": "BTN",
    "Unicode": "🇧🇹",
    "Dial": "975",
    "Currency": "BTN",
    "Capital": "Thimphu",
    "Continent": "AS"
  },
  {
    "Iso2": "JM",
    "Name": "Jamaica",
    "Iso3": "JAM",
    "Unicode": "🇯🇲",
    "Dial": "+1-876",
    "Currency": "JMD",
    "Capital": "Kingston",
    "Continent": "NA"
  },
  {
    "Iso2": "BV",
    "Name": "Bouvet Island",
    "Iso3": "BVT",
    "Unicode": "🇧🇻",
    "Dial": "",
    "Currency": "NOK",
    "Capital": "",
    "Continent": "AN"
  },
  {
    "Iso2": "BW",
    "Name": "Botswana",
    "Iso3": "BWA",
    "Unicode": "🇧🇼",
    "Dial": "267",
    "Currency": "BWP",
    "Capital": "Gaborone",
    "Continent": "AF"
  },
  {
    "Iso2": "WS",
    "Name": "Samoa",
    "Iso3": "WSM",
    "Unicode": "🇼🇸",
    "Dial": "685",
    "Currency": "WST",
    "Capital": "Apia",
    "Continent": "OC"
  },
  {
    "Iso2": "BQ",
    "Name": "Bonaire, Saint Eustatius and Saba ",
    "Iso3": "BES",
    "Unicode": "🇧🇶",
    "Dial": "599",
    "Currency": "USD",
    "Capital": "",
    "Continent": "NA"
  },
  {
    "Iso2": "BR",
    "Name": "Brazil",
    "Iso3": "BRA",
    "Unicode": "🇧🇷",
    "Dial": "55",
    "Currency": "BRL",
    "Capital": "Brasilia",
    "Continent": "SA"
  },
  {
    "Iso2": "BS",
    "Name": "Bahamas",
    "Iso3": "BHS",
    "Unicode": "🇧🇸",
    "Dial": "+1-242",
    "Currency": "BSD",
    "Capital": "Nassau",
    "Continent": "NA"
  },
  {
    "Iso2": "JE",
    "Name": "Jersey",
    "Iso3": "JEY",
    "Unicode": "🇯🇪",
    "Dial": "+44-1534",
    "Currency": "GBP",
    "Capital": "Saint Helier",
    "Continent": "EU"
  },
  {
    "Iso2": "BY",
    "Name": "Belarus",
    "Iso3": "BLR",
    "Unicode": "🇧🇾",
    "Dial": "375",
    "Currency": "BYR",
    "Capital": "Minsk",
    "Continent": "EU"
  },
  {
    "Iso2": "BZ",
    "Name": "Belize",
    "Iso3": "BLZ",
    "Unicode": "🇧🇿",
    "Dial": "501",
    "Currency": "BZD",
    "Capital": "Belmopan",
    "Continent": "NA"
  },
  {
    "Iso2": "RU",
    "Name": "Russia",
    "Iso3": "RUS",
    "Unicode": "🇷🇺",
    "Dial": "7",
    "Currency": "RUB",
    "Capital": "Moscow",
    "Continent": "EU"
  },
  {
    "Iso2": "RW",
    "Name": "Rwanda",
    "Iso3": "RWA",
    "Unicode": "🇷🇼",
    "Dial": "250",
    "Currency": "RWF",
    "Capital": "Kigali",
    "Continent": "AF"
  },
  {
    "Iso2": "RS",
    "Name": "Serbia",
    "Iso3": "SRB",
    "Unicode": "🇷🇸",
    "Dial": "381",
    "Currency": "RSD",
    "Capital": "Belgrade",
    "Continent": "EU"
  },
  {
    "Iso2": "TL",
    "Name": "East Timor",
    "Iso3": "TLS",
    "Unicode": "🇹🇱",
    "Dial": "670",
    "Currency": "USD",
    "Capital": "Dili",
    "Continent": "OC"
  },
  {
    "Iso2": "RE",
    "Name": "Reunion",
    "Iso3": "REU",
    "Unicode": "🇷🇪",
    "Dial": "262",
    "Currency": "EUR",
    "Capital": "Saint-Denis",
    "Continent": "AF"
  },
  {
    "Iso2": "TM",
    "Name": "Turkmenistan",
    "Iso3": "TKM",
    "Unicode": "🇹🇲",
    "Dial": "993",
    "Currency": "TMT",
    "Capital": "Ashgabat",
    "Continent": "AS"
  },
  {
    "Iso2": "TJ",
    "Name": "Tajikistan",
    "Iso3": "TJK",
    "Unicode": "🇹🇯",
    "Dial": "992",
    "Currency": "TJS",
    "Capital": "Dushanbe",
    "Continent": "AS"
  },
  {
    "Iso2": "RO",
    "Name": "Romania",
    "Iso3": "ROU",
    "Unicode": "🇷🇴",
    "Dial": "40",
    "Currency": "RON",
    "Capital": "Bucharest",
    "Continent": "EU"
  },
  {
    "Iso2": "TK",
    "Name": "Tokelau",
    "Iso3": "TKL",
    "Unicode": "🇹🇰",
    "Dial": "690",
    "Currency": "NZD",
    "Capital": "",
    "Continent": "OC"
  },
  {
    "Iso2": "GW",
    "Name": "Guinea-Bissau",
    "Iso3": "GNB",
    "Unicode": "🇬🇼",
    "Dial": "245",
    "Currency": "XOF",
    "Capital": "Bissau",
    "Continent": "AF"
  },
  {
    "Iso2": "GU",
    "Name": "Guam",
    "Iso3": "GUM",
    "Unicode": "🇬🇺",
    "Dial": "+1-671",
    "Currency": "USD",
    "Capital": "Hagatna",
    "Continent": "OC"
  },
  {
    "Iso2": "GT",
    "Name": "Guatemala",
    "Iso3": "GTM",
    "Unicode": "🇬🇹",
    "Dial": "502",
    "Currency": "GTQ",
    "Capital": "Guatemala City",
    "Continent": "NA"
  },
  {
    "Iso2": "GS",
    "Name": "South Georgia and the South Sandwich Islands",
    "Iso3": "SGS",
    "Unicode": "🇬🇸",
    "Dial": "",
    "Currency": "GBP",
    "Capital": "Grytviken",
    "Continent": "AN"
  },
  {
    "Iso2": "GR",
    "Name": "Greece",
    "Iso3": "GRC",
    "Unicode": "🇬🇷",
    "Dial": "30",
    "Currency": "EUR",
    "Capital": "Athens",
    "Continent": "EU"
  },
  {
    "Iso2": "GQ",
    "Name": "Equatorial Guinea",
    "Iso3": "GNQ",
    "Unicode": "🇬🇶",
    "Dial": "240",
    "Currency": "XAF",
    "Capital": "Malabo",
    "Continent": "AF"
  },
  {
    "Iso2": "GP",
    "Name": "Guadeloupe",
    "Iso3": "GLP",
    "Unicode": "🇬🇵",
    "Dial": "590",
    "Currency": "EUR",
    "Capital": "Basse-Terre",
    "Continent": "NA"
  },
  {
    "Iso2": "JP",
    "Name": "Japan",
    "Iso3": "JPN",
    "Unicode": "🇯🇵",
    "Dial": "81",
    "Currency": "JPY",
    "Capital": "Tokyo",
    "Continent": "AS"
  },
  {
    "Iso2": "GY",
    "Name": "Guyana",
    "Iso3": "GUY",
    "Unicode": "🇬🇾",
    "Dial": "592",
    "Currency": "GYD",
    "Capital": "Georgetown",
    "Continent": "SA"
  },
  {
    "Iso2": "GG",
    "Name": "Guernsey",
    "Iso3": "GGY",
    "Unicode": "🇬🇬",
    "Dial": "+44-1481",
    "Currency": "GBP",
    "Capital": "St Peter Port",
    "Continent": "EU"
  },
  {
    "Iso2": "GF",
    "Name": "French Guiana",
    "Iso3": "GUF",
    "Unicode": "🇬🇫",
    "Dial": "594",
    "Currency": "EUR",
    "Capital": "Cayenne",
    "Continent": "SA"
  },
  {
    "Iso2": "GE",
    "Name": "Georgia",
    "Iso3": "GEO",
    "Unicode": "🇬🇪",
    "Dial": "995",
    "Currency": "GEL",
    "Capital": "Tbilisi",
    "Continent": "AS"
  },
  {
    "Iso2": "GD",
    "Name": "Grenada",
    "Iso3": "GRD",
    "Unicode": "🇬🇩",
    "Dial": "+1-473",
    "Currency": "XCD",
    "Capital": "St. George's",
    "Continent": "NA"
  },
  {
    "Iso2": "GB",
    "Name": "United Kingdom",
    "Iso3": "GBR",
    "Unicode": "🇬🇧",
    "Dial": "44",
    "Currency": "GBP",
    "Capital": "London",
    "Continent": "EU"
  },
  {
    "Iso2": "GA",
    "Name": "Gabon",
    "Iso3": "GAB",
    "Unicode": "🇬🇦",
    "Dial": "241",
    "Currency": "XAF",
    "Capital": "Libreville",
    "Continent": "AF"
  },
  {
    "Iso2": "SV",
    "Name": "El Salvador",
    "Iso3": "SLV",
    "Unicode": "🇸🇻",
    "Dial": "503",
    "Currency": "USD",
    "Capital": "San Salvador",
    "Continent": "NA"
  },
  {
    "Iso2": "GN",
    "Name": "Guinea",
    "Iso3": "GIN",
    "Unicode": "🇬🇳",
    "Dial": "224",
    "Currency": "GNF",
    "Capital": "Conakry",
    "Continent": "AF"
  },
  {
    "Iso2": "GM",
    "Name": "Gambia",
    "Iso3": "GMB",
    "Unicode": "🇬🇲",
    "Dial": "220",
    "Currency": "GMD",
    "Capital": "Banjul",
    "Continent": "AF"
  },
  {
    "Iso2": "GL",
    "Name": "Greenland",
    "Iso3": "GRL",
    "Unicode": "🇬🇱",
    "Dial": "299",
    "Currency": "DKK",
    "Capital": "Nuuk",
    "Continent": "NA"
  },
  {
    "Iso2": "GI",
    "Name": "Gibraltar",
    "Iso3": "GIB",
    "Unicode": "🇬🇮",
    "Dial": "350",
    "Currency": "GIP",
    "Capital": "Gibraltar",
    "Continent": "EU"
  },
  {
    "Iso2": "GH",
    "Name": "Ghana",
    "Iso3": "GHA",
    "Unicode": "🇬🇭",
    "Dial": "233",
    "Currency": "GHS",
    "Capital": "Accra",
    "Continent": "AF"
  },
  {
    "Iso2": "OM",
    "Name": "Oman",
    "Iso3": "OMN",
    "Unicode": "🇴🇲",
    "Dial": "968",
    "Currency": "OMR",
    "Capital": "Muscat",
    "Continent": "AS"
  },
  {
    "Iso2": "TN",
    "Name": "Tunisia",
    "Iso3": "TUN",
    "Unicode": "🇹🇳",
    "Dial": "216",
    "Currency": "TND",
    "Capital": "Tunis",
    "Continent": "AF"
  },
  {
    "Iso2": "JO",
    "Name": "Jordan",
    "Iso3": "JOR",
    "Unicode": "🇯🇴",
    "Dial": "962",
    "Currency": "JOD",
    "Capital": "Amman",
    "Continent": "AS"
  },
  {
    "Iso2": "HR",
    "Name": "Croatia",
    "Iso3": "HRV",
    "Unicode": "🇭🇷",
    "Dial": "385",
    "Currency": "HRK",
    "Capital": "Zagreb",
    "Continent": "EU"
  },
  {
    "Iso2": "HT",
    "Name": "Haiti",
    "Iso3": "HTI",
    "Unicode": "🇭🇹",
    "Dial": "509",
    "Currency": "HTG",
    "Capital": "Port-au-Prince",
    "Continent": "NA"
  },
  {
    "Iso2": "HU",
    "Name": "Hungary",
    "Iso3": "HUN",
    "Unicode": "🇭🇺",
    "Dial": "36",
    "Currency": "HUF",
    "Capital": "Budapest",
    "Continent": "EU"
  },
  {
    "Iso2": "HK",
    "Name": "Hong Kong",
    "Iso3": "HKG",
    "Unicode": "🇭🇰",
    "Dial": "852",
    "Currency": "HKD",
    "Capital": "Hong Kong",
    "Continent": "AS"
  },
  {
    "Iso2": "HN",
    "Name": "Honduras",
    "Iso3": "HND",
    "Unicode": "🇭🇳",
    "Dial": "504",
    "Currency": "HNL",
    "Capital": "Tegucigalpa",
    "Continent": "NA"
  },
  {
    "Iso2": "HM",
    "Name": "Heard Island and McDonald Islands",
    "Iso3": "HMD",
    "Unicode": "🇭🇲",
    "Dial": " ",
    "Currency": "AUD",
    "Capital": "",
    "Continent": "AN"
  },
  {
    "Iso2": "VE",
    "Name": "Venezuela",
    "Iso3": "VEN",
    "Unicode": "🇻🇪",
    "Dial": "58",
    "Currency": "VEF",
    "Capital": "Caracas",
    "Continent": "SA"
  },
  {
    "Iso2": "PR",
    "Name": "Puerto Rico",
    "Iso3": "PRI",
    "Unicode": "🇵🇷",
    "Dial": "+1-787 and 1-939",
    "Currency": "USD",
    "Capital": "San Juan",
    "Continent": "NA"
  },
  {
    "Iso2": "PS",
    "Name": "Palestinian Territory",
    "Iso3": "PSE",
    "Unicode": "🇵🇸",
    "Dial": "970",
    "Currency": "ILS",
    "Capital": "East Jerusalem",
    "Continent": "AS"
  },
  {
    "Iso2": "PW",
    "Name": "Palau",
    "Iso3": "PLW",
    "Unicode": "🇵🇼",
    "Dial": "680",
    "Currency": "USD",
    "Capital": "Melekeok",
    "Continent": "OC"
  },
  {
    "Iso2": "PT",
    "Name": "Portugal",
    "Iso3": "PRT",
    "Unicode": "🇵🇹",
    "Dial": "351",
    "Currency": "EUR",
    "Capital": "Lisbon",
    "Continent": "EU"
  },
  {
    "Iso2": "SJ",
    "Name": "Svalbard and Jan Mayen",
    "Iso3": "SJM",
    "Unicode": "🇸🇯",
    "Dial": "47",
    "Currency": "NOK",
    "Capital": "Longyearbyen",
    "Continent": "EU"
  },
  {
    "Iso2": "PY",
    "Name": "Paraguay",
    "Iso3": "PRY",
    "Unicode": "🇵🇾",
    "Dial": "595",
    "Currency": "PYG",
    "Capital": "Asuncion",
    "Continent": "SA"
  },
  {
    "Iso2": "IQ",
    "Name": "Iraq",
    "Iso3": "IRQ",
    "Unicode": "🇮🇶",
    "Dial": "964",
    "Currency": "IQD",
    "Capital": "Baghdad",
    "Continent": "AS"
  },
  {
    "Iso2": "PA",
    "Name": "Panama",
    "Iso3": "PAN",
    "Unicode": "🇵🇦",
    "Dial": "507",
    "Currency": "PAB",
    "Capital": "Panama City",
    "Continent": "NA"
  },
  {
    "Iso2": "PF",
    "Name": "French Polynesia",
    "Iso3": "PYF",
    "Unicode": "🇵🇫",
    "Dial": "689",
    "Currency": "XPF",
    "Capital": "Papeete",
    "Continent": "OC"
  },
  {
    "Iso2": "PG",
    "Name": "Papua New Guinea",
    "Iso3": "PNG",
    "Unicode": "🇵🇬",
    "Dial": "675",
    "Currency": "PGK",
    "Capital": "Port Moresby",
    "Continent": "OC"
  },
  {
    "Iso2": "PE",
    "Name": "Peru",
    "Iso3": "PER",
    "Unicode": "🇵🇪",
    "Dial": "51",
    "Currency": "PEN",
    "Capital": "Lima",
    "Continent": "SA"
  },
  {
    "Iso2": "PK",
    "Name": "Pakistan",
    "Iso3": "PAK",
    "Unicode": "🇵🇰",
    "Dial": "92",
    "Currency": "PKR",
    "Capital": "Islamabad",
    "Continent": "AS"
  },
  {
    "Iso2": "PH",
    "Name": "Philippines",
    "Iso3": "PHL",
    "Unicode": "🇵🇭",
    "Dial": "63",
    "Currency": "PHP",
    "Capital": "Manila",
    "Continent": "AS"
  },
  {
    "Iso2": "PN",
    "Name": "Pitcairn",
    "Iso3": "PCN",
    "Unicode": "🇵🇳",
    "Dial": "870",
    "Currency": "NZD",
    "Capital": "Adamstown",
    "Continent": "OC"
  },
  {
    "Iso2": "PL",
    "Name": "Poland",
    "Iso3": "POL",
    "Unicode": "🇵🇱",
    "Dial": "48",
    "Currency": "PLN",
    "Capital": "Warsaw",
    "Continent": "EU"
  },
  {
    "Iso2": "PM",
    "Name": "Saint Pierre and Miquelon",
    "Iso3": "SPM",
    "Unicode": "🇵🇲",
    "Dial": "508",
    "Currency": "EUR",
    "Capital": "Saint-Pierre",
    "Continent": "NA"
  },
  {
    "Iso2": "ZM",
    "Name": "Zambia",
    "Iso3": "ZMB",
    "Unicode": "🇿🇲",
    "Dial": "260",
    "Currency": "ZMK",
    "Capital": "Lusaka",
    "Continent": "AF"
  },
  {
    "Iso2": "EH",
    "Name": "Western Sahara",
    "Iso3": "ESH",
    "Unicode": "🇪🇭",
    "Dial": "212",
    "Currency": "MAD",
    "Capital": "El-Aaiun",
    "Continent": "AF"
  },
  {
    "Iso2": "EE",
    "Name": "Estonia",
    "Iso3": "EST",
    "Unicode": "🇪🇪",
    "Dial": "372",
    "Currency": "EUR",
    "Capital": "Tallinn",
    "Continent": "EU"
  },
  {
    "Iso2": "EG",
    "Name": "Egypt",
    "Iso3": "EGY",
    "Unicode": "🇪🇬",
    "Dial": "20",
    "Currency": "EGP",
    "Capital": "Cairo",
    "Continent": "AF"
  },
  {
    "Iso2": "ZA",
    "Name": "South Africa",
    "Iso3": "ZAF",
    "Unicode": "🇿🇦",
    "Dial": "27",
    "Currency": "ZAR",
    "Capital": "Pretoria",
    "Continent": "AF"
  },
  {
    "Iso2": "EC",
    "Name": "Ecuador",
    "Iso3": "ECU",
    "Unicode": "🇪🇨",
    "Dial": "593",
    "Currency": "USD",
    "Capital": "Quito",
    "Continent": "SA"
  },
  {
    "Iso2": "IT",
    "Name": "Italy",
    "Iso3": "ITA",
    "Unicode": "🇮🇹",
    "Dial": "39",
    "Currency": "EUR",
    "Capital": "Rome",
    "Continent": "EU"
  },
  {
    "Iso2": "VN",
    "Name": "Vietnam",
    "Iso3": "VNM",
    "Unicode": "🇻🇳",
    "Dial": "84",
    "Currency": "VND",
    "Capital": "Hanoi",
    "Continent": "AS"
  },
  {
    "Iso2": "SB",
    "Name": "Solomon Islands",
    "Iso3": "SLB",
    "Unicode": "🇸🇧",
    "Dial": "677",
    "Currency": "SBD",
    "Capital": "Honiara",
    "Continent": "OC"
  },
  {
    "Iso2": "ET",
    "Name": "Ethiopia",
    "Iso3": "ETH",
    "Unicode": "🇪🇹",
    "Dial": "251",
    "Currency": "ETB",
    "Capital": "Addis Ababa",
    "Continent": "AF"
  },
  {
    "Iso2": "SO",
    "Name": "Somalia",
    "Iso3": "SOM",
    "Unicode": "🇸🇴",
    "Dial": "252",
    "Currency": "SOS",
    "Capital": "Mogadishu",
    "Continent": "AF"
  },
  {
    "Iso2": "ZW",
    "Name": "Zimbabwe",
    "Iso3": "ZWE",
    "Unicode": "🇿🇼",
    "Dial": "263",
    "Currency": "ZWL",
    "Capital": "Harare",
    "Continent": "AF"
  },
  {
    "Iso2": "SA",
    "Name": "Saudi Arabia",
    "Iso3": "SAU",
    "Unicode": "🇸🇦",
    "Dial": "966",
    "Currency": "SAR",
    "Capital": "Riyadh",
    "Continent": "AS"
  },
  {
    "Iso2": "ES",
    "Name": "Spain",
    "Iso3": "ESP",
    "Unicode": "🇪🇸",
    "Dial": "34",
    "Currency": "EUR",
    "Capital": "Madrid",
    "Continent": "EU"
  },
  {
    "Iso2": "ER",
    "Name": "Eritrea",
    "Iso3": "ERI",
    "Unicode": "🇪🇷",
    "Dial": "291",
    "Currency": "ERN",
    "Capital": "Asmara",
    "Continent": "AF"
  },
  {
    "Iso2": "ME",
    "Name": "Montenegro",
    "Iso3": "MNE",
    "Unicode": "🇲🇪",
    "Dial": "382",
    "Currency": "EUR",
    "Capital": "Podgorica",
    "Continent": "EU"
  },
  {
    "Iso2": "MD",
    "Name": "Moldova",
    "Iso3": "MDA",
    "Unicode": "🇲🇩",
    "Dial": "373",
    "Currency": "MDL",
    "Capital": "Chisinau",
    "Continent": "EU"
  },
  {
    "Iso2": "MG",
    "Name": "Madagascar",
    "Iso3": "MDG",
    "Unicode": "🇲🇬",
    "Dial": "261",
    "Currency": "MGA",
    "Capital": "Antananarivo",
    "Continent": "AF"
  },
  {
    "Iso2": "MF",
    "Name": "Saint Martin",
    "Iso3": "MAF",
    "Unicode": "🇲🇫",
    "Dial": "590",
    "Currency": "EUR",
    "Capital": "Marigot",
    "Continent": "NA"
  },
  {
    "Iso2": "MA",
    "Name": "Morocco",
    "Iso3": "MAR",
    "Unicode": "🇲🇦",
    "Dial": "212",
    "Currency": "MAD",
    "Capital": "Rabat",
    "Continent": "AF"
  },
  {
    "Iso2": "MC",
    "Name": "Monaco",
    "Iso3": "MCO",
    "Unicode": "🇲🇨",
    "Dial": "377",
    "Currency": "EUR",
    "Capital": "Monaco",
    "Continent": "EU"
  },
  {
    "Iso2": "UZ",
    "Name": "Uzbekistan",
    "Iso3": "UZB",
    "Unicode": "🇺🇿",
    "Dial": "998",
    "Currency": "UZS",
    "Capital": "Tashkent",
    "Continent": "AS"
  },
  {
    "Iso2": "MM",
    "Name": "Myanmar",
    "Iso3": "MMR",
    "Unicode": "🇲🇲",
    "Dial": "95",
    "Currency": "MMK",
    "Capital": "Nay Pyi Taw",
    "Continent": "AS"
  },
  {
    "Iso2": "ML",
    "Name": "Mali",
    "Iso3": "MLI",
    "Unicode": "🇲🇱",
    "Dial": "223",
    "Currency": "XOF",
    "Capital": "Bamako",
    "Continent": "AF"
  },
  {
    "Iso2": "MO",
    "Name": "Macao",
    "Iso3": "MAC",
    "Unicode": "🇲🇴",
    "Dial": "853",
    "Currency": "MOP",
    "Capital": "Macao",
    "Continent": "AS"
  },
  {
    "Iso2": "MN",
    "Name": "Mongolia",
    "Iso3": "MNG",
    "Unicode": "🇲🇳",
    "Dial": "976",
    "Currency": "MNT",
    "Capital": "Ulan Bator",
    "Continent": "AS"
  },
  {
    "Iso2": "MH",
    "Name": "Marshall Islands",
    "Iso3": "MHL",
    "Unicode": "🇲🇭",
    "Dial": "692",
    "Currency": "USD",
    "Capital": "Majuro",
    "Continent": "OC"
  },
  {
    "Iso2": "MK",
    "Name": "Macedonia",
    "Iso3": "MKD",
    "Unicode": "🇲🇰",
    "Dial": "389",
    "Currency": "MKD",
    "Capital": "Skopje",
    "Continent": "EU"
  },
  {
    "Iso2": "MU",
    "Name": "Mauritius",
    "Iso3": "MUS",
    "Unicode": "🇲🇺",
    "Dial": "230",
    "Currency": "MUR",
    "Capital": "Port Louis",
    "Continent": "AF"
  },
  {
    "Iso2": "MT",
    "Name": "Malta",
    "Iso3": "MLT",
    "Unicode": "🇲🇹",
    "Dial": "356",
    "Currency": "EUR",
    "Capital": "Valletta",
    "Continent": "EU"
  },
  {
    "Iso2": "MW",
    "Name": "Malawi",
    "Iso3": "MWI",
    "Unicode": "🇲🇼",
    "Dial": "265",
    "Currency": "MWK",
    "Capital": "Lilongwe",
    "Continent": "AF"
  },
  {
    "Iso2": "MV",
    "Name": "Maldives",
    "Iso3": "MDV",
    "Unicode": "🇲🇻",
    "Dial": "960",
    "Currency": "MVR",
    "Capital": "Male",
    "Continent": "AS"
  },
  {
    "Iso2": "MQ",
    "Name": "Martinique",
    "Iso3": "MTQ",
    "Unicode": "🇲🇶",
    "Dial": "596",
    "Currency": "EUR",
    "Capital": "Fort-de-France",
    "Continent": "NA"
  },
  {
    "Iso2": "MP",
    "Name": "Northern Mariana Islands",
    "Iso3": "MNP",
    "Unicode": "🇲🇵",
    "Dial": "+1-670",
    "Currency": "USD",
    "Capital": "Saipan",
    "Continent": "OC"
  },
  {
    "Iso2": "MS",
    "Name": "Montserrat",
    "Iso3": "MSR",
    "Unicode": "🇲🇸",
    "Dial": "+1-664",
    "Currency": "XCD",
    "Capital": "Plymouth",
    "Continent": "NA"
  },
  {
    "Iso2": "MR",
    "Name": "Mauritania",
    "Iso3": "MRT",
    "Unicode": "🇲🇷",
    "Dial": "222",
    "Currency": "MRO",
    "Capital": "Nouakchott",
    "Continent": "AF"
  },
  {
    "Iso2": "IM",
    "Name": "Isle of Man",
    "Iso3": "IMN",
    "Unicode": "🇮🇲",
    "Dial": "+44-1624",
    "Currency": "GBP",
    "Capital": "Douglas, Isle of Man",
    "Continent": "EU"
  },
  {
    "Iso2": "UG",
    "Name": "Uganda",
    "Iso3": "UGA",
    "Unicode": "🇺🇬",
    "Dial": "256",
    "Currency": "UGX",
    "Capital": "Kampala",
    "Continent": "AF"
  },
  {
    "Iso2": "TZ",
    "Name": "Tanzania",
    "Iso3": "TZA",
    "Unicode": "🇹🇿",
    "Dial": "255",
    "Currency": "TZS",
    "Capital": "Dodoma",
    "Continent": "AF"
  },
  {
    "Iso2": "MY",
    "Name": "Malaysia",
    "Iso3": "MYS",
    "Unicode": "🇲🇾",
    "Dial": "60",
    "Currency": "MYR",
    "Capital": "Kuala Lumpur",
    "Continent": "AS"
  },
  {
    "Iso2": "MX",
    "Name": "Mexico",
    "Iso3": "MEX",
    "Unicode": "🇲🇽",
    "Dial": "52",
    "Currency": "MXN",
    "Capital": "Mexico City",
    "Continent": "NA"
  },
  {
    "Iso2": "IL",
    "Name": "Israel",
    "Iso3": "ISR",
    "Unicode": "🇮🇱",
    "Dial": "972",
    "Currency": "ILS",
    "Capital": "Jerusalem",
    "Continent": "AS"
  },
  {
    "Iso2": "FR",
    "Name": "France",
    "Iso3": "FRA",
    "Unicode": "🇫🇷",
    "Dial": "33",
    "Currency": "EUR",
    "Capital": "Paris",
    "Continent": "EU"
  },
  {
    "Iso2": "IO",
    "Name": "British Indian Ocean Territory",
    "Iso3": "IOT",
    "Unicode": "🇮🇴",
    "Dial": "246",
    "Currency": "USD",
    "Capital": "Diego Garcia",
    "Continent": "AS"
  },
  {
    "Iso2": "SH",
    "Name": "Saint Helena",
    "Iso3": "SHN",
    "Unicode": "🇸🇭",
    "Dial": "290",
    "Currency": "SHP",
    "Capital": "Jamestown",
    "Continent": "AF"
  },
  {
    "Iso2": "FI",
    "Name": "Finland",
    "Iso3": "FIN",
    "Unicode": "🇫🇮",
    "Dial": "358",
    "Currency": "EUR",
    "Capital": "Helsinki",
    "Continent": "EU"
  },
  {
    "Iso2": "FJ",
    "Name": "Fiji",
    "Iso3": "FJI",
    "Unicode": "🇫🇯",
    "Dial": "679",
    "Currency": "FJD",
    "Capital": "Suva",
    "Continent": "OC"
  },
  {
    "Iso2": "FK",
    "Name": "Falkland Islands",
    "Iso3": "FLK",
    "Unicode": "🇫🇰",
    "Dial": "500",
    "Currency": "FKP",
    "Capital": "Stanley",
    "Continent": "SA"
  },
  {
    "Iso2": "FM",
    "Name": "Micronesia",
    "Iso3": "FSM",
    "Unicode": "🇫🇲",
    "Dial": "691",
    "Currency": "USD",
    "Capital": "Palikir",
    "Continent": "OC"
  },
  {
    "Iso2": "FO",
    "Name": "Faroe Islands",
    "Iso3": "FRO",
    "Unicode": "🇫🇴",
    "Dial": "298",
    "Currency": "DKK",
    "Capital": "Torshavn",
    "Continent": "EU"
  },
  {
    "Iso2": "NI",
    "Name": "Nicaragua",
    "Iso3": "NIC",
    "Unicode": "🇳🇮",
    "Dial": "505",
    "Currency": "NIO",
    "Capital": "Managua",
    "Continent": "NA"
  },
  {
    "Iso2": "NL",
    "Name": "Netherlands",
    "Iso3": "NLD",
    "Unicode": "🇳🇱",
    "Dial": "31",
    "Currency": "EUR",
    "Capital": "Amsterdam",
    "Continent": "EU"
  },
  {
    "Iso2": "NO",
    "Name": "Norway",
    "Iso3": "NOR",
    "Unicode": "🇳🇴",
    "Dial": "47",
    "Currency": "NOK",
    "Capital": "Oslo",
    "Continent": "EU"
  },
  {
    "Iso2": "NA",
    "Name": "Namibia",
    "Iso3": "NAM",
    "Unicode": "🇳🇦",
    "Dial": "264",
    "Currency": "NAD",
    "Capital": "Windhoek",
    "Continent": "AF"
  },
  {
    "Iso2": "VU",
    "Name": "Vanuatu",
    "Iso3": "VUT",
    "Unicode": "🇻🇺",
    "Dial": "678",
    "Currency": "VUV",
    "Capital": "Port Vila",
    "Continent": "OC"
  },
  {
    "Iso2": "NC",
    "Name": "New Caledonia",
    "Iso3": "NCL",
    "Unicode": "🇳🇨",
    "Dial": "687",
    "Currency": "XPF",
    "Capital": "Noumea",
    "Continent": "OC"
  },
  {
    "Iso2": "NE",
    "Name": "Niger",
    "Iso3": "NER",
    "Unicode": "🇳🇪",
    "Dial": "227",
    "Currency": "XOF",
    "Capital": "Niamey",
    "Continent": "AF"
  },
  {
    "Iso2": "NF",
    "Name": "Norfolk Island",
    "Iso3": "NFK",
    "Unicode": "🇳🇫",
    "Dial": "672",
    "Currency": "AUD",
    "Capital": "Kingston",
    "Continent": "OC"
  },
  {
    "Iso2": "NG",
    "Name": "Nigeria",
    "Iso3": "NGA",
    "Unicode": "🇳🇬",
    "Dial": "234",
    "Currency": "NGN",
    "Capital": "Abuja",
    "Continent": "AF"
  },
  {
    "Iso2": "NZ",
    "Name": "New Zealand",
    "Iso3": "NZL",
    "Unicode": "🇳🇿",
    "Dial": "64",
    "Currency": "NZD",
    "Capital": "Wellington",
    "Continent": "OC"
  },
  {
    "Iso2": "NP",
    "Name": "Nepal",
    "Iso3": "NPL",
    "Unicode": "🇳🇵",
    "Dial": "977",
    "Currency": "NPR",
    "Capital": "Kathmandu",
    "Continent": "AS"
  },
  {
    "Iso2": "NR",
    "Name": "Nauru",
    "Iso3": "NRU",
    "Unicode": "🇳🇷",
    "Dial": "674",
    "Currency": "AUD",
    "Capital": "Yaren",
    "Continent": "OC"
  },
  {
    "Iso2": "NU",
    "Name": "Niue",
    "Iso3": "NIU",
    "Unicode": "🇳🇺",
    "Dial": "683",
    "Currency": "NZD",
    "Capital": "Alofi",
    "Continent": "OC"
  },
  {
    "Iso2": "CK",
    "Name": "Cook Islands",
    "Iso3": "COK",
    "Unicode": "🇨🇰",
    "Dial": "682",
    "Currency": "NZD",
    "Capital": "Avarua",
    "Continent": "OC"
  },
  {
    "Iso2": "XK",
    "Name": "Kosovo",
    "Iso3": "XKX",
    "Unicode": "🇽🇰",
    "Dial": "",
    "Currency": "EUR",
    "Capital": "Pristina",
    "Continent": "EU"
  },
  {
    "Iso2": "CI",
    "Name": "Ivory Coast",
    "Iso3": "CIV",
    "Unicode": "🇨🇮",
    "Dial": "225",
    "Currency": "XOF",
    "Capital": "Yamoussoukro",
    "Continent": "AF"
  },
  {
    "Iso2": "CH",
    "Name": "Switzerland",
    "Iso3": "CHE",
    "Unicode": "🇨🇭",
    "Dial": "41",
    "Currency": "CHF",
    "Capital": "Berne",
    "Continent": "EU"
  },
  {
    "Iso2": "CO",
    "Name": "Colombia",
    "Iso3": "COL",
    "Unicode": "🇨🇴",
    "Dial": "57",
    "Currency": "COP",
    "Capital": "Bogota",
    "Continent": "SA"
  },
  {
    "Iso2": "CN",
    "Name": "China",
    "Iso3": "CHN",
    "Unicode": "🇨🇳",
    "Dial": "86",
    "Currency": "CNY",
    "Capital": "Beijing",
    "Continent": "AS"
  },
  {
    "Iso2": "CM",
    "Name": "Cameroon",
    "Iso3": "CMR",
    "Unicode": "🇨🇲",
    "Dial": "237",
    "Currency": "XAF",
    "Capital": "Yaounde",
    "Continent": "AF"
  },
  {
    "Iso2": "CL",
    "Name": "Chile",
    "Iso3": "CHL",
    "Unicode": "🇨🇱",
    "Dial": "56",
    "Currency": "CLP",
    "Capital": "Santiago",
    "Continent": "SA"
  },
  {
    "Iso2": "CC",
    "Name": "Cocos Islands",
    "Iso3": "CCK",
    "Unicode": "🇨🇨",
    "Dial": "61",
    "Currency": "AUD",
    "Capital": "West Island",
    "Continent": "AS"
  },
  {
    "Iso2": "CA",
    "Name": "Canada",
    "Iso3": "CAN",
    "Unicode": "🇨🇦",
    "Dial": "1",
    "Currency": "CAD",
    "Capital": "Ottawa",
    "Continent": "NA"
  },
  {
    "Iso2": "CG",
    "Name": "Republic of the Congo",
    "Iso3": "COG",
    "Unicode": "🇨🇬",
    "Dial": "242",
    "Currency": "XAF",
    "Capital": "Brazzaville",
    "Continent": "AF"
  },
  {
    "Iso2": "CF",
    "Name": "Central African Republic",
    "Iso3": "CAF",
    "Unicode": "🇨🇫",
    "Dial": "236",
    "Currency": "XAF",
    "Capital": "Bangui",
    "Continent": "AF"
  },
  {
    "Iso2": "CD",
    "Name": "Democratic Republic of the Congo",
    "Iso3": "COD",
    "Unicode": "🇨🇩",
    "Dial": "243",
    "Currency": "CDF",
    "Capital": "Kinshasa",
    "Continent": "AF"
  },
  {
    "Iso2": "CZ",
    "Name": "Czech Republic",
    "Iso3": "CZE",
    "Unicode": "🇨🇿",
    "Dial": "420",
    "Currency": "CZK",
    "Capital": "Prague",
    "Continent": "EU"
  },
  {
    "Iso2": "CY",
    "Name": "Cyprus",
    "Iso3": "CYP",
    "Unicode": "🇨🇾",
    "Dial": "357",
    "Currency": "EUR",
    "Capital": "Nicosia",
    "Continent": "EU"
  },
  {
    "Iso2": "CX",
    "Name": "Christmas Island",
    "Iso3": "CXR",
    "Unicode": "🇨🇽",
    "Dial": "61",
    "Currency": "AUD",
    "Capital": "Flying Fish Cove",
    "Continent": "AS"
  },
  {
    "Iso2": "CR",
    "Name": "Costa Rica",
    "Iso3": "CRI",
    "Unicode": "🇨🇷",
    "Dial": "506",
    "Currency": "CRC",
    "Capital": "San Jose",
    "Continent": "NA"
  },
  {
    "Iso2": "CW",
    "Name": "Curacao",
    "Iso3": "CUW",
    "Unicode": "🇨🇼",
    "Dial": "599",
    "Currency": "ANG",
    "Capital": " Willemstad",
    "Continent": "NA"
  },
  {
    "Iso2": "CV",
    "Name": "Cape Verde",
    "Iso3": "CPV",
    "Unicode": "🇨🇻",
    "Dial": "238",
    "Currency": "CVE",
    "Capital": "Praia",
    "Continent": "AF"
  },
  {
    "Iso2": "CU",
    "Name": "Cuba",
    "Iso3": "CUB",
    "Unicode": "🇨🇺",
    "Dial": "53",
    "Currency": "CUP",
    "Capital": "Havana",
    "Continent": "NA"
  },
  {
    "Iso2": "SZ",
    "Name": "Swaziland",
    "Iso3": "SWZ",
    "Unicode": "🇸🇿",
    "Dial": "268",
    "Currency": "SZL",
    "Capital": "Mbabane",
    "Continent": "AF"
  },
  {
    "Iso2": "SY",
    "Name": "Syria",
    "Iso3": "SYR",
    "Unicode": "🇸🇾",
    "Dial": "963",
    "Currency": "SYP",
    "Capital": "Damascus",
    "Continent": "AS"
  },
  {
    "Iso2": "SX",
    "Name": "Sint Maarten",
    "Iso3": "SXM",
    "Unicode": "🇸🇽",
    "Dial": "599",
    "Currency": "ANG",
    "Capital": "Philipsburg",
    "Continent": "NA"
  },
  {
    "Iso2": "KG",
    "Name": "Kyrgyzstan",
    "Iso3": "KGZ",
    "Unicode": "🇰🇬",
    "Dial": "996",
    "Currency": "KGS",
    "Capital": "Bishkek",
    "Continent": "AS"
  },
  {
    "Iso2": "KE",
    "Name": "Kenya",
    "Iso3": "KEN",
    "Unicode": "🇰🇪",
    "Dial": "254",
    "Currency": "KES",
    "Capital": "Nairobi",
    "Continent": "AF"
  },
  {
    "Iso2": "SS",
    "Name": "South Sudan",
    "Iso3": "SSD",
    "Unicode": "🇸🇸",
    "Dial": "211",
    "Currency": "SSP",
    "Capital": "Juba",
    "Continent": "AF"
  },
  {
    "Iso2": "SR",
    "Name": "Suriname",
    "Iso3": "SUR",
    "Unicode": "🇸🇷",
    "Dial": "597",
    "Currency": "SRD",
    "Capital": "Paramaribo",
    "Continent": "SA"
  },
  {
    "Iso2": "KI",
    "Name": "Kiribati",
    "Iso3": "KIR",
    "Unicode": "🇰🇮",
    "Dial": "686",
    "Currency": "AUD",
    "Capital": "Tarawa",
    "Continent": "OC"
  },
  {
    "Iso2": "KH",
    "Name": "Cambodia",
    "Iso3": "KHM",
    "Unicode": "🇰🇭",
    "Dial": "855",
    "Currency": "KHR",
    "Capital": "Phnom Penh",
    "Continent": "AS"
  },
  {
    "Iso2": "KN",
    "Name": "Saint Kitts and Nevis",
    "Iso3": "KNA",
    "Unicode": "🇰🇳",
    "Dial": "+1-869",
    "Currency": "XCD",
    "Capital": "Basseterre",
    "Continent": "NA"
  },
  {
    "Iso2": "KM",
    "Name": "Comoros",
    "Iso3": "COM",
    "Unicode": "🇰🇲",
    "Dial": "269",
    "Currency": "KMF",
    "Capital": "Moroni",
    "Continent": "AF"
  },
  {
    "Iso2": "ST",
    "Name": "Sao Tome and Principe",
    "Iso3": "STP",
    "Unicode": "🇸🇹",
    "Dial": "239",
    "Currency": "STD",
    "Capital": "Sao Tome",
    "Continent": "AF"
  },
  {
    "Iso2": "SK",
    "Name": "Slovakia",
    "Iso3": "SVK",
    "Unicode": "🇸🇰",
    "Dial": "421",
    "Currency": "EUR",
    "Capital": "Bratislava",
    "Continent": "EU"
  },
  {
    "Iso2": "KR",
    "Name": "South Korea",
    "Iso3": "KOR",
    "Unicode": "🇰🇷",
    "Dial": "82",
    "Currency": "KRW",
    "Capital": "Seoul",
    "Continent": "AS"
  },
  {
    "Iso2": "SI",
    "Name": "Slovenia",
    "Iso3": "SVN",
    "Unicode": "🇸🇮",
    "Dial": "386",
    "Currency": "EUR",
    "Capital": "Ljubljana",
    "Continent": "EU"
  },
  {
    "Iso2": "KP",
    "Name": "North Korea",
    "Iso3": "PRK",
    "Unicode": "🇰🇵",
    "Dial": "850",
    "Currency": "KPW",
    "Capital": "Pyongyang",
    "Continent": "AS"
  },
  {
    "Iso2": "KW",
    "Name": "Kuwait",
    "Iso3": "KWT",
    "Unicode": "🇰🇼",
    "Dial": "965",
    "Currency": "KWD",
    "Capital": "Kuwait City",
    "Continent": "AS"
  },
  {
    "Iso2": "SN",
    "Name": "Senegal",
    "Iso3": "SEN",
    "Unicode": "🇸🇳",
    "Dial": "221",
    "Currency": "XOF",
    "Capital": "Dakar",
    "Continent": "AF"
  },
  {
    "Iso2": "SM",
    "Name": "San Marino",
    "Iso3": "SMR",
    "Unicode": "🇸🇲",
    "Dial": "378",
    "Currency": "EUR",
    "Capital": "San Marino",
    "Continent": "EU"
  },
  {
    "Iso2": "SL",
    "Name": "Sierra Leone",
    "Iso3": "SLE",
    "Unicode": "🇸🇱",
    "Dial": "232",
    "Currency": "SLL",
    "Capital": "Freetown",
    "Continent": "AF"
  },
  {
    "Iso2": "SC",
    "Name": "Seychelles",
    "Iso3": "SYC",
    "Unicode": "🇸🇨",
    "Dial": "248",
    "Currency": "SCR",
    "Capital": "Victoria",
    "Continent": "AF"
  },
  {
    "Iso2": "KZ",
    "Name": "Kazakhstan",
    "Iso3": "KAZ",
    "Unicode": "🇰🇿",
    "Dial": "7",
    "Currency": "KZT",
    "Capital": "Astana",
    "Continent": "AS"
  },
  {
    "Iso2": "KY",
    "Name": "Cayman Islands",
    "Iso3": "CYM",
    "Unicode": "🇰🇾",
    "Dial": "+1-345",
    "Currency": "KYD",
    "Capital": "George Town",
    "Continent": "NA"
  },
  {
    "Iso2": "SG",
    "Name": "Singapore",
    "Iso3": "SGP",
    "Unicode": "🇸🇬",
    "Dial": "65",
    "Currency": "SGD",
    "Capital": "Singapur",
    "Continent": "AS"
  },
  {
    "Iso2": "SE",
    "Name": "Sweden",
    "Iso3": "SWE",
    "Unicode": "🇸🇪",
    "Dial": "46",
    "Currency": "SEK",
    "Capital": "Stockholm",
    "Continent": "EU"
  },
  {
    "Iso2": "SD",
    "Name": "Sudan",
    "Iso3": "SDN",
    "Unicode": "🇸🇩",
    "Dial": "249",
    "Currency": "SDG",
    "Capital": "Khartoum",
    "Continent": "AF"
  },
  {
    "Iso2": "DO",
    "Name": "Dominican Republic",
    "Iso3": "DOM",
    "Unicode": "🇩🇴",
    "Dial": "+1-809 and 1-829",
    "Currency": "DOP",
    "Capital": "Santo Domingo",
    "Continent": "NA"
  },
  {
    "Iso2": "DM",
    "Name": "Dominica",
    "Iso3": "DMA",
    "Unicode": "🇩🇲",
    "Dial": "+1-767",
    "Currency": "XCD",
    "Capital": "Roseau",
    "Continent": "NA"
  },
  {
    "Iso2": "DJ",
    "Name": "Djibouti",
    "Iso3": "DJI",
    "Unicode": "🇩🇯",
    "Dial": "253",
    "Currency": "DJF",
    "Capital": "Djibouti",
    "Continent": "AF"
  },
  {
    "Iso2": "DK",
    "Name": "Denmark",
    "Iso3": "DNK",
    "Unicode": "🇩🇰",
    "Dial": "45",
    "Currency": "DKK",
    "Capital": "Copenhagen",
    "Continent": "EU"
  },
  {
    "Iso2": "VG",
    "Name": "British Virgin Islands",
    "Iso3": "VGB",
    "Unicode": "🇻🇬",
    "Dial": "+1-284",
    "Currency": "USD",
    "Capital": "Road Town",
    "Continent": "NA"
  },
  {
    "Iso2": "DE",
    "Name": "Germany",
    "Iso3": "DEU",
    "Unicode": "🇩🇪",
    "Dial": "49",
    "Currency": "EUR",
    "Capital": "Berlin",
    "Continent": "EU"
  },
  {
    "Iso2": "YE",
    "Name": "Yemen",
    "Iso3": "YEM",
    "Unicode": "🇾🇪",
    "Dial": "967",
    "Currency": "YER",
    "Capital": "Sanaa",
    "Continent": "AS"
  },
  {
    "Iso2": "DZ",
    "Name": "Algeria",
    "Iso3": "DZA",
    "Unicode": "🇩🇿",
    "Dial": "213",
    "Currency": "DZD",
    "Capital": "Algiers",
    "Continent": "AF"
  },
  {
    "Iso2": "US",
    "Name": "United States",
    "Iso3": "USA",
    "Unicode": "🇺🇸",
    "Dial": "1",
    "Currency": "USD",
    "Capital": "Washington",
    "Continent": "NA"
  },
  {
    "Iso2": "UY",
    "Name": "Uruguay",
    "Iso3": "URY",
    "Unicode": "🇺🇾",
    "Dial": "598",
    "Currency": "UYU",
    "Capital": "Montevideo",
    "Continent": "SA"
  },
  {
    "Iso2": "YT",
    "Name": "Mayotte",
    "Iso3": "MYT",
    "Unicode": "🇾🇹",
    "Dial": "262",
    "Currency": "EUR",
    "Capital": "Mamoudzou",
    "Continent": "AF"
  },
  {
    "Iso2": "UM",
    "Name": "United States Minor Outlying Islands",
    "Iso3": "UMI",
    "Unicode": "🇺🇲",
    "Dial": "1",
    "Currency": "USD",
    "Capital": "",
    "Continent": "OC"
  },
  {
    "Iso2": "LB",
    "Name": "Lebanon",
    "Iso3": "LBN",
    "Unicode": "🇱🇧",
    "Dial": "961",
    "Currency": "LBP",
    "Capital": "Beirut",
    "Continent": "AS"
  },
  {
    "Iso2": "LC",
    "Name": "Saint Lucia",
    "Iso3": "LCA",
    "Unicode": "🇱🇨",
    "Dial": "+1-758",
    "Currency": "XCD",
    "Capital": "Castries",
    "Continent": "NA"
  },
  {
    "Iso2": "LA",
    "Name": "Laos",
    "Iso3": "LAO",
    "Unicode": "🇱🇦",
    "Dial": "856",
    "Currency": "LAK",
    "Capital": "Vientiane",
    "Continent": "AS"
  },
  {
    "Iso2": "TV",
    "Name": "Tuvalu",
    "Iso3": "TUV",
    "Unicode": "🇹🇻",
    "Dial": "688",
    "Currency": "AUD",
    "Capital": "Funafuti",
    "Continent": "OC"
  },
  {
    "Iso2": "TW",
    "Name": "Taiwan",
    "Iso3": "TWN",
    "Unicode": "🇹🇼",
    "Dial": "886",
    "Currency": "TWD",
    "Capital": "Taipei",
    "Continent": "AS"
  },
  {
    "Iso2": "TT",
    "Name": "Trinidad and Tobago",
    "Iso3": "TTO",
    "Unicode": "🇹🇹",
    "Dial": "+1-868",
    "Currency": "TTD",
    "Capital": "Port of Spain",
    "Continent": "NA"
  },
  {
    "Iso2": "TR",
    "Name": "Turkey",
    "Iso3": "TUR",
    "Unicode": "🇹🇷",
    "Dial": "90",
    "Currency": "TRY",
    "Capital": "Ankara",
    "Continent": "AS"
  },
  {
    "Iso2": "LK",
    "Name": "Sri Lanka",
    "Iso3": "LKA",
    "Unicode": "🇱🇰",
    "Dial": "94",
    "Currency": "LKR",
    "Capital": "Colombo",
    "Continent": "AS"
  },
  {
    "Iso2": "LI",
    "Name": "Liechtenstein",
    "Iso3": "LIE",
    "Unicode": "🇱🇮",
    "Dial": "423",
    "Currency": "CHF",
    "Capital": "Vaduz",
    "Continent": "EU"
  },
  {
    "Iso2": "LV",
    "Name": "Latvia",
    "Iso3": "LVA",
    "Unicode": "🇱🇻",
    "Dial": "371",
    "Currency": "EUR",
    "Capital": "Riga",
    "Continent": "EU"
  },
  {
    "Iso2": "TO",
    "Name": "Tonga",
    "Iso3": "TON",
    "Unicode": "🇹🇴",
    "Dial": "676",
    "Currency": "TOP",
    "Capital": "Nuku'alofa",
    "Continent": "OC"
  },
  {
    "Iso2": "LT",
    "Name": "Lithuania",
    "Iso3": "LTU",
    "Unicode": "🇱🇹",
    "Dial": "370",
    "Currency": "LTL",
    "Capital": "Vilnius",
    "Continent": "EU"
  },
  {
    "Iso2": "LU",
    "Name": "Luxembourg",
    "Iso3": "LUX",
    "Unicode": "🇱🇺",
    "Dial": "352",
    "Currency": "EUR",
    "Capital": "Luxembourg",
    "Continent": "EU"
  },
  {
    "Iso2": "LR",
    "Name": "Liberia",
    "Iso3": "LBR",
    "Unicode": "🇱🇷",
    "Dial": "231",
    "Currency": "LRD",
    "Capital": "Monrovia",
    "Continent": "AF"
  },
  {
    "Iso2": "LS",
    "Name": "Lesotho",
    "Iso3": "LSO",
    "Unicode": "🇱🇸",
    "Dial": "266",
    "Currency": "LSL",
    "Capital": "Maseru",
    "Continent": "AF"
  },
  {
    "Iso2": "TH",
    "Name": "Thailand",
    "Iso3": "THA",
    "Unicode": "🇹🇭",
    "Dial": "66",
    "Currency": "THB",
    "Capital": "Bangkok",
    "Continent": "AS"
  },
  {
    "Iso2": "TF",
    "Name": "French Southern Territories",
    "Iso3": "ATF",
    "Unicode": "🇹🇫",
    "Dial": "",
    "Currency": "EUR",
    "Capital": "Port-aux-Francais",
    "Continent": "AN"
  },
  {
    "Iso2": "TG",
    "Name": "Togo",
    "Iso3": "TGO",
    "Unicode": "🇹🇬",
    "Dial": "228",
    "Currency": "XOF",
    "Capital": "Lome",
    "Continent": "AF"
  },
  {
    "Iso2": "TD",
    "Name": "Chad",
    "Iso3": "TCD",
    "Unicode": "🇹🇩",
    "Dial": "235",
    "Currency": "XAF",
    "Capital": "N'Djamena",
    "Continent": "AF"
  },
  {
    "Iso2": "TC",
    "Name": "Turks and Caicos Islands",
    "Iso3": "TCA",
    "Unicode": "🇹🇨",
    "Dial": "+1-649",
    "Currency": "USD",
    "Capital": "Cockburn Town",
    "Continent": "NA"
  },
  {
    "Iso2": "LY",
    "Name": "Libya",
    "Iso3": "LBY",
    "Unicode": "🇱🇾",
    "Dial": "218",
    "Currency": "LYD",
    "Capital": "Tripolis",
    "Continent": "AF"
  },
  {
    "Iso2": "VA",
    "Name": "Vatican",
    "Iso3": "VAT",
    "Unicode": "🇻🇦",
    "Dial": "379",
    "Currency": "EUR",
    "Capital": "Vatican City",
    "Continent": "EU"
  },
  {
    "Iso2": "VC",
    "Name": "Saint Vincent and the Grenadines",
    "Iso3": "VCT",
    "Unicode": "🇻🇨",
    "Dial": "+1-784",
    "Currency": "XCD",
    "Capital": "Kingstown",
    "Continent": "NA"
  },
  {
    "Iso2": "AE",
    "Name": "United Arab Emirates",
    "Iso3": "ARE",
    "Unicode": "🇦🇪",
    "Dial": "971",
    "Currency": "AED",
    "Capital": "Abu Dhabi",
    "Continent": "AS"
  },
  {
    "Iso2": "AD",
    "Name": "Andorra",
    "Iso3": "AND",
    "Unicode": "🇦🇩",
    "Dial": "376",
    "Currency": "EUR",
    "Capital": "Andorra la Vella",
    "Continent": "EU"
  },
  {
    "Iso2": "AG",
    "Name": "Antigua and Barbuda",
    "Iso3": "ATG",
    "Unicode": "🇦🇬",
    "Dial": "+1-268",
    "Currency": "XCD",
    "Capital": "St. John's",
    "Continent": "NA"
  },
  {
    "Iso2": "AF",
    "Name": "Afghanistan",
    "Iso3": "AFG",
    "Unicode": "🇦🇫",
    "Dial": "93",
    "Currency": "AFN",
    "Capital": "Kabul",
    "Continent": "AS"
  },
  {
    "Iso2": "AI",
    "Name": "Anguilla",
    "Iso3": "AIA",
    "Unicode": "🇦🇮",
    "Dial": "+1-264",
    "Currency": "XCD",
    "Capital": "The Valley",
    "Continent": "NA"
  },
  {
    "Iso2": "VI",
    "Name": "U.S. Virgin Islands",
    "Iso3": "VIR",
    "Unicode": "🇻🇮",
    "Dial": "+1-340",
    "Currency": "USD",
    "Capital": "Charlotte Amalie",
    "Continent": "NA"
  },
  {
    "Iso2": "IS",
    "Name": "Iceland",
    "Iso3": "ISL",
    "Unicode": "🇮🇸",
    "Dial": "354",
    "Currency": "ISK",
    "Capital": "Reykjavik",
    "Continent": "EU"
  },
  {
    "Iso2": "IR",
    "Name": "Iran",
    "Iso3": "IRN",
    "Unicode": "🇮🇷",
    "Dial": "98",
    "Currency": "IRR",
    "Capital": "Tehran",
    "Continent": "AS"
  },
  {
    "Iso2": "AM",
    "Name": "Armenia",
    "Iso3": "ARM",
    "Unicode": "🇦🇲",
    "Dial": "374",
    "Currency": "AMD",
    "Capital": "Yerevan",
    "Continent": "AS"
  },
  {
    "Iso2": "AL",
    "Name": "Albania",
    "Iso3": "ALB",
    "Unicode": "🇦🇱",
    "Dial": "355",
    "Currency": "ALL",
    "Capital": "Tirana",
    "Continent": "EU"
  },
  {
    "Iso2": "AO",
    "Name": "Angola",
    "Iso3": "AGO",
    "Unicode": "🇦🇴",
    "Dial": "244",
    "Currency": "AOA",
    "Capital": "Luanda",
    "Continent": "AF"
  },
  {
    "Iso2": "AQ",
    "Name": "Antarctica",
    "Iso3": "ATA",
    "Unicode": "🇦🇶",
    "Dial": "",
    "Currency": "",
    "Capital": "",
    "Continent": "AN"
  },
  {
    "Iso2": "AS",
    "Name": "American Samoa",
    "Iso3": "ASM",
    "Unicode": "🇦🇸",
    "Dial": "+1-684",
    "Currency": "USD",
    "Capital": "Pago Pago",
    "Continent": "OC"
  },
  {
    "Iso2": "AR",
    "Name": "Argentina",
    "Iso3": "ARG",
    "Unicode": "🇦🇷",
    "Dial": "54",
    "Currency": "ARS",
    "Capital": "Buenos Aires",
    "Continent": "SA"
  },
  {
    "Iso2": "AU",
    "Name": "Australia",
    "Iso3": "AUS",
    "Unicode": "🇦🇺",
    "Dial": "61",
    "Currency": "AUD",
    "Capital": "Canberra",
    "Continent": "OC"
  },
  {
    "Iso2": "AT",
    "Name": "Austria",
    "Iso3": "AUT",
    "Unicode": "🇦🇹",
    "Dial": "43",
    "Currency": "EUR",
    "Capital": "Vienna",
    "Continent": "EU"
  },
  {
    "Iso2": "AW",
    "Name": "Aruba",
    "Iso3": "ABW",
    "Unicode": "🇦🇼",
    "Dial": "297",
    "Currency": "AWG",
    "Capital": "Oranjestad",
    "Continent": "NA"
  },
  {
    "Iso2": "IN",
    "Name": "India",
    "Iso3": "IND",
    "Unicode": "🇮🇳",
    "Dial": "91",
    "Currency": "INR",
    "Capital": "New Delhi",
    "Continent": "AS"
  },
  {
    "Iso2": "AX",
    "Name": "Aland Islands",
    "Iso3": "ALA",
    "Unicode": "🇦🇽",
    "Dial": "+358-18",
    "Currency": "EUR",
    "Capital": "Mariehamn",
    "Continent": "EU"
  },
  {
    "Iso2": "AZ",
    "Name": "Azerbaijan",
    "Iso3": "AZE",
    "Unicode": "🇦🇿",
    "Dial": "994",
    "Currency": "AZN",
    "Capital": "Baku",
    "Continent": "AS"
  },
  {
    "Iso2": "IE",
    "Name": "Ireland",
    "Iso3": "IRL",
    "Unicode": "🇮🇪",
    "Dial": "353",
    "Currency": "EUR",
    "Capital": "Dublin",
    "Continent": "EU"
  },
  {
    "Iso2": "ID",
    "Name": "Indonesia",
    "Iso3": "IDN",
    "Unicode": "🇮🇩",
    "Dial": "62",
    "Currency": "IDR",
    "Capital": "Jakarta",
    "Continent": "AS"
  },
  {
    "Iso2": "UA",
    "Name": "Ukraine",
    "Iso3": "UKR",
    "Unicode": "🇺🇦",
    "Dial": "380",
    "Currency": "UAH",
    "Capital": "Kiev",
    "Continent": "EU"
  },
  {
    "Iso2": "QA",
    "Name": "Qatar",
    "Iso3": "QAT",
    "Unicode": "🇶🇦",
    "Dial": "974",
    "Currency": "QAR",
    "Capital": "Doha",
    "Continent": "AS"
  },
  {
    "Iso2": "MZ",
    "Name": "Mozambique",
    "Iso3": "MOZ",
    "Unicode": "🇲🇿",
    "Dial": "258",
    "Currency": "MZN",
    "Capital": "Maputo",
    "Continent": "AF"
  }
]



