/* global session store $route jsPDF */

import Vue from 'vue';
import fromCDN from 'from-cdn';
import xGrid from '../../components/xCRUD/xGrid.vue';
import xCrudControls from '../../components/xCRUD/xCrudControls.vue';
import xForm from '../../components/xCRUD/xForm.vue';
import {
  setGriHeaders,
  setFormFields,
  feedGrid,
  setXCrudMediatorDataSync,
  setXCrudMainListeners
} from '../../helpers/helpers';
import session from '../../helpers/session';
export default {
  // name: 'Human',
  components: {
    xGrid,
    xForm,
    xCrudControls
  },
  data: () => ({
    entity: '',
    itemKey: '',
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 10, // -1 for All
      totalItems: 0
    },
    operators: {
      items: [],
      all: {
        equal: {
          label: 'Equal'
        },
        contains: {
          label: 'Contains'
        },
        doesNotcontains: {
          label: 'Does not contains'
        },
        isNull: {
          label: 'Is null'
        },
        isNotNull: {
          label: 'Is not null'
        }
      },
      text: {
        isEmpty: {
          label: 'Is empty'
        },
        isNotEmpty: {
          label: 'Is not empty'
        },
        startsWith: {
          label: 'Starts with'
        },
        endsWith: {
          label: 'Ends with'
        },
      }
    },
    query_operators: {
      text: [
        { text: 'Equal', value: 'eq' },
        { text: 'Not equal', value: 'ne' },
        { text: 'Is null', value: 'isNull' },
        { text: 'Is not null', value: 'isNotNull' },
        { text: 'Is empty', value: 'isEmpty' },
        { text: 'Is not empty', value: 'isNotEmpty' },
        { text: 'Contains', value: 'contains' },
        { text: 'Does not contains', value: 'doesNotContains' },
        { text: 'Starts with', value: 'startsWith' },
        { text: 'Ends with', value: 'endsWith' },
      ],
      date_number: [
        { text: 'Equal', value: 'eq' },
        { text: 'Not equal', value: 'ne' },
        { text: 'Is null', value: 'isNull' },
        { text: 'Is not null', value: 'isNotNull' },
        { text: 'Greater than', value: 'gt' },
        { text: 'Greather than and', value: 'gte' },
        { text: 'Lower than', value: 'lt' },
        { text: 'Lower than and', value: 'lte' },
        { text: 'Between', value: 'between' },
        { text: 'Not between', value: 'notBetween' },
      ],
    },
    totalDocuments: 0,
    headers: [],
    collection_links: [],
    loading: true,
    dialog: false,
    dialog_loading: false,
    dialog_create: false,
    dialog2: true,
    documents: [],
    original_documents: [],
    snack: false,
    selected: [],
    snackColor: '',
    snackText: '',
    search: '',
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
        editedIndex: -1,
        valid: false,                                            
      }
    },
    displayWhat: 'grid',
    currentFormMode: null, // create / update
    where: false,
    uploaders: [],
    hideSubFields: {
      user: ['human']
    },
  }),
  computed: {
    swagger () {
      return this.store.state.swagger;
    }
  },
  created: function () {
    this.ready = fromCDN([
      '//cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js',
      '//cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js'
    ]);
    this.bus = new Vue();
  },
  mounted () {
    if (typeof this.$route.meta.entity === 'undefined')
    {
      console.error('Can not start xCrud. Entity is undefined');
      return;
    }
    if (this.$route.meta.entity === '' || this.$route.meta.entity === null)
    {
      console.error('Can not start xCrud. Entity is undefined');
      return;
    }
    if (typeof this.swagger.definitions[this.$route.meta.entity] === 'undefined')
    {
      console.error('Can not start xCrud. There is no swagger schema defined for ' + this.$route.meta.entity);
      return;
    }
    let properties = this.swagger.definitions[this.$route.meta.entity].properties;
    if (!this.bus) this.bus = new Vue();
    this.entity = this.$route.meta.entity;
    this.itemKey = this.$route.meta.itemKey;
    setGriHeaders(this, properties);
    setFormFields(this);
    setXCrudMediatorDataSync(this);
    setXCrudMainListeners(this);
  },
  beforeRouteEnter (to, from, next) {
    // console.log(to);
    if (!session.isOnline())
    {
      // return;
      next({ path: '/login' });
    }
    else
    {
      next();
    }
  },
  watch: {
    pagination: {
      handler () {
        // console.log('triggered pagination in human.vm');
        this.selected = [];
        feedGrid(this, this.where);
      },
      deep: true
    }
  },
  methods: {
    
  }
};
