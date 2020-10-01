/* global session store $route */
// import Vue from 'vue';
import xFormGrid from './xFormGrid.vue';
import { setFormFields, bus, mountDataForGrid, mountDataForGridWithId, getGridWidth, getVmFieldById  } from '../../helpers/helpers';
// import flatPickr from 'vue-flatpickr-component';
import flatpickr from 'flatpickr';
import * as CDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/material_blue.css';
import 'flatpickr/dist/themes/light.css';

// import session from '../../helpers/session';
export default {
  name: 'xForm',
  components: {
    xFormGrid,
    // flatPickr
  },
  props: [
    'dialog',
    'dialog_loading',
    'dialog_create',
    'entity', 
    'selected', 
    'loading', 
    'forms',
    'form_search',
    'query_operators',
    'close'],
  data: () => ({
    title: '',
    selectedFormName: '',
    modal: false,
    date: new Date().toISOString().substr(0, 10),
    createdAt_menu_1: false,
    createdAt_menu_2: false,
    createdAt_1: new Date().toISOString().substr(0, 10),
    createdAt_2: new Date().toISOString().substr(0, 10),
    pickers: [],
    pickersObj: [],
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
    bus.$on('mountPicker', (field, formName, values, isSearch) => { 
      this.mountPicker(field, formName, values, isSearch);
    });
    bus.$on('clearPicker', (field, formName, isSearch) => {
      this.clearPicker(field.id, formName, isSearch);
    });
  },
  watch: {

    forms: {
      handler (val) {
        // console.log(val);
        // console.log('watched forms on xForm');
        this.title = this.getFormTitle();
      },
      deep: true
    },
    dialog (val) {
      // console.log(val);
      // console.log('watched dialog on xForm', this.forms.crud.editedIndex);
      if (!val)
      {
        bus.$emit('clearFieldsValues', 'crud');
      }
      this.title = this.getFormTitle();
    }
  },
  methods: {
    getFormTitle () {
      // console.log('getFormTitle () on xForm', this.forms.crud.editedIndex);
      return this.forms.crud.editedIndex === -1 ? 
        'Add ' + this.entity : 
        'Edit ' + this.entity;
    },
    save (column) {
      bus.$emit('save');
    },
    bus () {
      return bus;
    },
    
    mountPicker (field, formName, values, isSearch = false, isRange = false) {
      if (isSearch) formName = 'search';
      const id = field.id;
      let config = {
        altInput: true,
        dateFormat: 'Y-m-d\\TH:i:S\\.\\0\\0\\0\\Z',
        static: true,
        plugins: [new CDatePlugin({
          confirmIcon: '<i class="fa fa-check"></i>', // your icon's html, if you wish to override
          confirmText: 'click here to set',
          showAlways: true,
          theme: 'light' // or "dark",
        })],
      };
      let pkId = `#${formName}_picker_${id}`;
      console.log('mountPicker', pkId);
      console.log(this.form_search.operators[field.id]);
      let pk = null;
      if (field.type === 'date-time')
      {
        config.enableTime = true;
        config.time_24hr = true;
        config.altFormat = 'F j, Y H:i';
        config.noCalendar = false;
      }
      else if (field.type === 'date')
      {
        config.enableTime = false;
        config.time_24hr = true;
        config.altFormat = 'F j, Y';
        config.noCalendar = false;
      }
      else if (field.type === 'time')
      {
        config.enableTime = true;
        config.time_24hr = true;
        config.altFormat = 'H:i';
        config.noCalendar = true;
      }

      if (isSearch)
      {
        config.enableTime = true;
        config.time_24hr = true;
        delete config.altFormat;
        config.noCalendar = false;
        
        config.altInput = false;
        delete config.dateFormat;
      }

      if (isRange)
      {
        config.mode = 'range';
      }

      if (this.pickers.indexOf(pkId) > -1)
      {
        pk = this.pickersObj[this.pickers.indexOf(pkId)];
        pk.setDate(values[id], true, config.dateFormat);
      }
      else
      {
        pk = flatpickr(pkId, config);
        pk.setDate(values[id], true, config.dateFormat);
        this.pickers.push(pkId);
        this.pickersObj.push(pk);
      }
    },
    clearPicker (fieldName, formName) {
      let pkId = `#${formName}_picker_${fieldName}`;
      let index = this.pickers.indexOf(pkId);
      if (this.pickersObj[index])
      {
        this.pickersObj[index].destroy();
        this.pickers.splice(index, 1);
        this.pickersObj.splice(index, 1);
      }
    },
    toggleCalendar (pkId) {
      console.log('toggleCalendar', pkId);
      let index = this.pickers.indexOf(pkId);
      console.log(index);
      console.log(this.pickers);
      console.log(this.pickersObj);
      if (this.pickersObj[index])
      {
        this.pickersObj[index].toggle();
      }
    },
    selectSearchOperator (fieldName, operator) {
      let isRange = operator === 'between' || operator === 'notBetween' ? true : false;
      let field = getVmFieldById(fieldName, this.forms.crud.fields);
      this.clearPicker(fieldName, 'search');
      if (field)
      {
        this.mountPicker(field, 'search', this.form_search.user_values, true, isRange);
      }
    },
    mountDataForGridX (a, b) {
      if (!b) return [];
      return mountDataForGrid(a, b);
    },
    getHeadersAsObject (headers = []) {
      let headersObj = {};
      headers.forEach(h => { headersObj[h.id] = h });
      return headersObj;
    },
    getGridWidth (property) {
      return getGridWidth(property);
    },
    
    getGridWidthForForm (property) {
      let w = getGridWidth(property);
      if (w.indexOf('%') < 0)
      {
        w = String(w) + 'px';
      }
      else
      {
        w = 'auto';
      }
      // console.log(w);
      return w;
    }
  }
};
