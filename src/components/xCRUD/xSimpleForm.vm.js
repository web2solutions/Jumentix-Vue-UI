/* eslint-disable */
/* global session store $route, FileReader */
import Vue from 'vue';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import currency from 'v-currency-field';
import 'v-currency-field/dist/index.css';
import xForm from './xForm.vue';
// import xSimpleFormGrid from './xSimpleFormGrid.vue';
import UploadButton from '../UploadButton.vue';
import flatpickr from 'flatpickr';
import * as CDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/material_blue.css';
import 'flatpickr/dist/themes/light.css';
import {
  getDefaultGridColumnSettings,
  getDefaultSubFormObject,
  getFormIsUploader,
  getDefaultFormFieldSettings,
  setFieldCollectionSettings,
  getFormType,
  getFormDefault,
  setFormFields,
  setXCrudMediatorDataSync,
  setXCrudMainListeners,
  editItem,
  createItem

} from '../../helpers/helpers';
Vue.use(currency);
Vue.use(CKEditor);
// import session from '../../helpers/session';
export default {
  name: 'xSimpleForm',
  components: {
    // xSimpleFormGrid,
    xForm,
    'upload-btn': UploadButton
  },
  props: {
    entity: {
      default: '',
      type: String
    },
    bus: {
      default: {},
      type: Object
    },
    formData: {
      default: () => ({}),
      type: Object
    },
    hideFields: {
      default: function () { return [] },
      type: Array
    },
    /** displayWhat: {
      default: 'crud',
      type: String
    }, */
  },
  data: () => ({
    pickers: [],
    pickersObj: [],
    noImage: '',
    activePhotoField: false,
    progressValue: 0,
    progressBuffer: 100,
    indeterminate: false,
    editor: ClassicEditor,
    editorData: '<p>Content of the editor.</p>',
    editorConfig: { },
    dialog_loading: false,
    documents: [],
    original_documents: [],
    selected: [],
    snack: false,
    snackColor: '',
    snackText: '',
    form_search: {
      name: 'search',
      fields: [],
      values: { 
        createdAt: '',
        createdAt_2: '',
        updatedAt: '',
        updatedAt_2: '',
      },
      user_values: {
        createdAt: '',
        createdAt_2: '',
        updatedAt: '',
        updatedAt_2: '',
      },
      operators: { 
        createdAt: '',
        createdAt_2: '',
        updatedAt: '',
        updatedAt_2: '',
      },
      matching_operator: 'or',
      headers: { },
      defaultItem: { },
      newItem: { },
      dialog: false,
      editedIndex: -1,
      valid: false,                                      
    },
    forms: {
        crud: {
          name: 'crud',
          fields: [],
          values: { },
          labels: { },
          user_values: { },
          headers: { },
          defaultItem: { },
          newItem: { },
          dialog: false,
          editedIndex: 0,
          valid: false,                                             
        }                                 
    },
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
    displayWhat: 'crud',
    currentFormMode: 'update', // create / update
    where: false,
    uploaders: []
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
    // console.log('xSimpleFORM mounted -----------');
    if (this.entity === '' || this.entity === null)
    {
      console.error('Can not start xSimpleForm. Entity is undefined');
      return;
    }
    if (typeof this.swagger.definitions[this.entity] === 'undefined')
    {
      console.error('Can not start xSimpleForm. There is no swagger schema defined for ' + this.entity);
      return;
    }

    let properties = this.swagger.definitions[this.entity].properties;

    Vue.set(this, 'pickers', []);
    Vue.set(this, 'pickersObj', []);
    Vue.set(this, 'original_documents', [this.formData]);
    Vue.set(this.forms, 'crud', {
          name: 'crud',
          fields: [],
          values: { },
          labels: { },
          user_values: { },
          headers: { },
          defaultItem: { },
          newItem: { },
          dialog: false,
          editedIndex: 0,
          valid: false,                                             
    } );
    
    //setGriHeaders(this, properties);
    setFormFields(this);
    setXCrudMediatorDataSync(this);
    setXCrudMainListeners(this);
    // setXCrudMediatorDataSync(this);
    
    // console.log(this.formData);
    // this.forms.crud.user_values = this.data
    
    if (Object.keys(this.formData).length === 0) {
      createItem(this);
    }
    else
    {
      editItem(this, 0);
    }
    
    // Vue.set(this.forms.crud, 'user_values', this.formData);
  },
  watch: {

  },
  methods: {
    
  }
};
