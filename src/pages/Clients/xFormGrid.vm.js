/* global session store $route */
// import Vue from 'vue';
import { 
  setFormFields, bus, mountDataForGrid, 
  mountDataForGridWithId, getGridWidth, 
  getFormType, getFormRequired, getFormRules, 
  getFormInfo, getFormLabel, isFormMultiple
} from '../../helpers/helpers';
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
    // bus().$emit('close');

  },
  watch: {
    
  },
  methods: {
    bus () {
      return bus;
    },
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
    getFormLabel (property) {
      // console.log();
      return getFormLabel(property);
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
      // console.log();
      return this.swagger.definitions[entityName].properties[propertyName];
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
      console.log('Dialog closed');
    }
  }
};
