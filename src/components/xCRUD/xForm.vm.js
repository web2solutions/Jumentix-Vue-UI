/* global session store $route, FileReader */
import Vue from 'vue';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import currency from 'v-currency-field';
import 'v-currency-field/dist/index.css';
import xFormGrid from './xFormGrid.vue';
import UploadButton from '../UploadButton.vue';
import { setFormFields, mountDataForGrid, mountDataForGridWithId, getGridWidth, getVmFieldById  } from '../../helpers/helpers';

import flatpickr from 'flatpickr';
import * as CDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/material_blue.css';
import 'flatpickr/dist/themes/light.css';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
Vue.use(currency);
Vue.use(CKEditor);
// import session from '../../helpers/session';
export default {
  name: 'xForm',
  components: {
    xFormGrid,
    'upload-btn': UploadButton,
    VuePerfectScrollbar
  },
  props: {
    entity: {
      default: '',
      type: String
    },
    bus: {
      type: Object,
      default: function () { return {} },
    },
    hideFields: {
      default: function () { return [] },
      type: Array
    },
    hideSubFields: {
      default: function () { return {} },
      type: Object
    },
    hideCloseButton: {
      default: false,
      type: Boolean
    },
    isFormSimple: {
      default: false,
      type: Boolean
    },
    isHideOnFormSimpleSave: {
      default: true,
      type: Boolean
    },
    displayWhat: {
      default: 'crud',
      type: String
    },
    dialog: {
      default: false,
      type: Boolean
    },
    loading: {
      default: false,
      type: Boolean
    },
    dialog_loading: {
      default: false,
      type: Boolean
    },
    showHeadline: {
      default: true,
      type: Boolean
    },
    selected: {
      default: function () { return [] },
      type: Array
    },
    forms: {
      type: Object,
      default: function () { return {} },
    },
    form_search: {
      type: Object,
      default: function () { return {} },
    },
    query_operators: {
      type: Object,
      default: function () { return {} },
    },

    currentFormMode: {
      default: 'create',
      type: String
    },
    uploaders: {
      default: function () { return [] },
      type: Array
    },
  },
  
  data: () => ({
    steps: [
      
    ],
    tourCallbacks: {
      onPreviousStep: this.previousStepCallback,
      onNextStep: this.nextStepCallback
    },
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
    noImage: '',
    activePhotoField: false,
    currency_config: {
      decimal: '.',
      thousands: ',',
      prefix: 'US$ ',
      suffix: '',
      precision: 2,
      masked: false,
      allowBlank: false,
      min: Number.MIN_SAFE_INTEGER,
      max: Number.MAX_SAFE_INTEGER
    },
    progressValue: 0,
    progressBuffer: 100,
    indeterminate: false,
    editor: ClassicEditor,
    editorData: '<p>Content of the editor.</p>',
    editorConfig: { }
  }),
  computed: {
    swagger () {
      return this.store.state.swagger;
    },
    computeLogo () {
      return '/static/logo.png';
    },
  },
  created () {
    // this.getAll ();
  },
  mounted () {
    // console.log('xFORM mounted -----------');
    // this.pickers = [];
    // this.pickersObj = [];

    Vue.set(this, 'pickers', []);
    Vue.set(this, 'pickersObj', []);
    // console.log(this.pickers);
    // console.log(this.pickersObj);

    this.bus.$on('mountPicker', (field, formName, values, isSearch) => { 
      this.mountPicker(field, formName, values, isSearch);
    });
    this.bus.$on('clearPicker', (field, formName, isSearch) => {
      this.clearPicker(field.id, formName, isSearch);
    });
    this.bus.$on('fileProgress', (event) => {
      // console.log(event);
      // console.log(event.loaded);
      // console.log(event.total);
      // this.progressBuffer = event.total;
      // console.log(Math.floor((event.loaded / event.total) * 100));
      this.progressValue = Math.floor((event.loaded / event.total) * 100);
      if (event.total === event.loaded)
      {
        this.indeterminate = true;
      }
    });
    this.bus.$on('fileProgressComplete', (event) => {
      this.indeterminate = false;
    });

    // this.$tours['crudTour'].start();
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
        this.bus.$emit('clearFieldsValues', 'crud');
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
      this.bus.$emit('save');
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
      // console.log('mountPicker', pkId);
      // console.log('field', field);
      // console.log(this.form_search.operators[field.id]);
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

      pk = flatpickr(pkId, config);
      if (!pk || typeof pk.setDate !== 'function') return;
      pk.setDate(values[id], true, config.dateFormat);
      this.pickers.push(pkId);
      this.pickersObj.push(pk);
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
      // console.log('toggleCalendar', pkId);
      let index = this.pickers.indexOf(pkId);
      // console.log(index);
      // console.log(this.pickers);
      // console.log(this.pickersObj);
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
    },
    uploadBase64: function (file, fieldId) {
      let reader  = new FileReader();
      reader.addEventListener('load', (e) => {
        this.bus.$emit('readPhotoFile', fieldId, reader.result);
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      }
    },
    previousStepCallback (currentStep) {
      // console.log('[Vue Tour] A custom previousStep callback has been called on step ' + (currentStep + 1))
    },
    nextStepCallback (currentStep) {
      // console.log('[Vue Tour] A custom nextStep callback has been called on step ' + (currentStep + 1))
  
      if (currentStep === 1) {
        // console.log('[Vue Tour] A custom nextStep callback has been called from step 2 to step 3')
      }
    }
  }
};
