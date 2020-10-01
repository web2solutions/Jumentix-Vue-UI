/* global session store $route */
// import Vue from 'vue';
import { 
  setFormFields,  mountDataForGrid, 
  mountDataForGridWithId, getGridWidth, 
  getFormType, getFormRequired, getFormRules, getFieldCollectionSettings, 
  getFormInfo, getFormLabel, isFormMultiple, getOnLocalCollection
} from '../../helpers/helpers';
import moment from 'moment-timezone';
import session from '../../helpers/session';
// import session from '../../helpers/session';
export default {
  name: 'xFormGrid',
  props: [
    'label',
    'id',
    'forms',
    'schema',
    'collection',
    'schemaName',
    '$collection',
    'editable',
    'info',
    'bus',
    'isUploader'
  ],
  data: () => ({
    snack: false,
    snackColor: '',
    snackText: '',
    max25chars: v => v.length <= 25 || 'Input too long!',
  }),
  computed: {
    swagger () {
      return this.store.state.swagger;
    }
  },
  created () {
    // this.getAll ();
  },
  mounted () {
    // this.bus().$emit('close');

  },
  watch: {
    
  },
  methods: {
    getHeadersAsObject (headers = []) {
      let headersObj = {};
      headers.forEach(h => { headersObj[h.id] = h });
      return headersObj;
    },
    isFormMultiple (property) {
      // console.log();
      return isFormMultiple(property);
    },
    getFormType (property) {
      // console.log();
      return getFormType(property);
    },
    getFieldCollectionSettings (property) {
      // console.log();
      return getFieldCollectionSettings(property);
    },
    getFormLabel (property) {
      // console.log();
      return getFormLabel(property);
    },
    fillField (collection, _id, fieldId) {
      window.setTimeout(() => {
        this._fillField(collection, _id, fieldId);
      }, 700);
    },
    _fillField (collection, _id, fieldId) {
      (async (elId, collection, _id) => {
        if (!_id) {
          if (document.getElementById(fieldId) !== null) {
            document.getElementById(fieldId).innerHTML = 'none';
          } else {
            console.warn('element does not exist ' + fieldId);
          }
          return;
        }
        try {
          
          let { error, data } = await getOnLocalCollection(collection.collection, _id);
          
          let keys = collection.labelKey.split(',');
          let text = '';
          keys.forEach(k => {
            text += ' ' + data[k.toString().trim()].toString().trim();
          });
          document.getElementById(elId).innerHTML = text;
        } catch (error) {
          // console.log(error);
          console.warn('error on filling field', fieldId);
          console.warn('searching for:', collection.collection);
          console.warn('value:', _id);
          console.warn('target div id:', elId);
        }
      })(fieldId, collection, _id);
    },
    getFormInfo (property) {
      // console.log();
      return getFormInfo(property);
    },
    getGridWidth (property) {
      // console.log();
      return getGridWidth(property);
    },
    getFormRequired (entityDefinition, fieldName) {
      // console.log();
      return getFormRequired(entityDefinition, fieldName);
    },
    getFormRules (entityDefinition, fieldName, property) {
      // console.log();
      return getFormRules(entityDefinition, fieldName, property);
    },
    getEntity (entityName) {
      // console.log();
      return this.swagger.definitions[entityName];
    },
    getProperty (entityName, propertyName) {
      // console.log(entityName, propertyName);
      return this.swagger.definitions[entityName] ? this.swagger.definitions[entityName].properties[propertyName] : false;
    },
    formatDate (date) {
      // console.log('formatDate', date);
      return moment.tz(date, session.user().timezone).format('ll');
    },
    formatDateTime (date) {
      // console.log('formatDateTime', date);
      return moment.tz(date, session.user().timezone).format('llll');
    },
    getGridDisplay (property) {
      let display = 'visible';
      let w = getGridWidth(property);
      if (w === '0')
      {
        display = 'none';
      }
      // console.log(w);
      return display;
    },
    getGridWidthForForm (property) {
      let w = getGridWidth(property);
      if (w.indexOf('%') < 0)
      {
        w = String(w) + 'px';
      }
      // console.log(w);
      return w;
    },
    async getOnLocalCollection (collection, _id) {
      // console.log(collection, _id);
      let { error, data } = await getOnLocalCollection(collection, _id);
      // console.log(error);
      // console.log(data);
      return data ? data : error;
    },

    async getlabel (schemaName, headerName, _id) 
    {

      // console.log(schemaName, headerName);
      
      let definition = this.getProperty(schemaName, headerName);
      if (!definition) return 'error';
      // console.log(definition);
      if (!definition['x-ui']) return 'error';
      if (!definition['x-ui']['collection-link']) return 'error';
      let collection = definition['x-ui']['collection-link'];
      
      let { error, data } = await getOnLocalCollection(collection, _id);
      // console.log(definition['x-ui']);
      // console.log(definition['x-ui']['collection-link']);
      // console.log(definition['x-ui']['collection-link-label']);
      // console.log(definition['x-ui']['collection-link-value']);
      // console.log(error, data);
      // console.log('--------------------');
      return 'aaaaaaaaaa';
    },
    save () {
      this.snack = true;
      this.snackColor = 'success';
      this.snackText = 'Data saved';
    },
    cancel () {
      this.snack = true;
      this.snackColor = 'error';
      this.snackText = 'Canceled';
    },
    open () {
      this.snack = true;
      this.snackColor = 'info';
      this.snackText = 'Dialog opened';
    },
    close () {
      // console.log('Dialog closed');
    }
  }
};
