/* global session store $route jsPDF */

import Vue from 'vue';
import fromCDN from 'from-cdn';
import xGrid from '../../components/xCRUD/xGrid.vue';
import xCrudControls from '../../components/xCRUD/xCrudControls.vue';
import xForm from '../../components/xCRUD/xForm.vue';
// import CasesAdd from './CasesAdd.vue';
import Mediator from '../../Mediator';
import {
  setGriHeaders,
  setFormFields,
  feedGrid,
  setXCrudMediatorDataSync,
  setXCrudMainListeners,
  getDataFromApi,
  getLocalCollection,
  mountDataForGridBasedOnSawgger
} from '../../helpers/helpers';
import session from '../../helpers/session';
// chart
import EChart from '@/components/chart/echart';
import MiniChart from '@/components/widgets/chart/MiniChart';
// end chart
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    VuePerfectScrollbar,
    xGrid,
    xForm,
    xCrudControls,
    MiniChart,
    EChart,
    // CasesAdd
  },
  name: 'Case',
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
    search: null,
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
    displayWhat: 'dashboard',
    currentFormMode: null, // create / update
    where: false,
    uploaders: [],
    hideSubFields: {
      // user: ['human']
    },
    shortMonth: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    shortWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dataset: {
      newUsers: [],
      onlineUsers: []
    },
    searchType: 'Case Number',
    itemsMenu: [
      { title: 'Case Number' },
      { title: 'Contact Name' }
    ],
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
    
    // Fake Randon new users
    this.dataset.newUsers = this.shortMonth.map(m => {
      return {
        'month': m,
        'Total New Users': Math.floor(Math.random() * 4000) + 200,
      };
    });

    // Fake Randon Online users
    this.dataset.onlineUsers = this.shortWeek.map(m => {
      return {
        'Day': m,
        'Total Online Users': Math.floor(Math.random() * 4000) + 200,
      };
    });

    console.log('this.dataset.onlineUsers', Mediator.client.send.request.serverClientList());

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
    // setXCrudMainListeners(this);

    this.bus.$on('cardClick', (newQuery) => {
      console.log('CARDCLICK _+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+', newQuery);
      this.cardClick(newQuery);
    });
    /* this.bus.$on('createItem', (isEmpty = true) => {
      this.displayWhat = 'create';
    }); */

    /* this.bus.$on('doTextSearch', (search) => {
      // this.feedGrid(this.entity, search, object);
      this.doTextSearch(search);
    }); */

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
        console.log('triggered pagination in human.vm');
        console.log('>>>>> search: ', this.search);
        console.log('>>>>> this.where: ', this.where);
        console.log('][]][][][][][][][][}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}');

        this.selected = [];
        // feedGrid(this, this.where);
        if (this.searchType === 'Case Number' && this.search) {
          console.log('Case Number -=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');
          console.log('>>>>> search: ', this.search);
          console.log('>>>>> this.where: ', this.where);
          console.log('][]][][][][][][][][}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}');
          // feedGrid(this, this.where);
        }
        else
        {
          console.log('Contact Name -=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');
          console.log('>>>>> search: ', this.search);
          console.log('>>>>> this.where: ', this.where);
          console.log('][]][][][][][][][][}{}{}{}{}{}{}{}{}{}{}{}{}{}{}{}');
          // this.feedGrid(this.search);
        }
      },
      deep: true
    },
    displayWhat: {
      handler (val) {
        console.log('displayWhat', val, this.displayWhat);
      },
      deep: true
    }
  },
  methods: {
    doTextSearch (search) {
      console.log('doTextSearch', search);
      if (search)
      {
        if (this.searchType === 'Case Number') {
          console.log('Case Number', search);
          this.bus.$emit('doTextSearch', search);
          return;
        }
        else
        {
          console.log('Contact Name', search);
          this.feedGrid(search, 'Human');
        }
      }
      else
      {
        console.log('Search Null', search);
        this.bus.$emit('doTextSearch', '');
        return; 
      }
      
    },
    doClearSearch () {
      this.bus.$emit('doTextSearch', '');
    },
    createNew (type) {
      console.log(type);
      this.displayWhat = 'create';
      setTimeout(() => {
        this.bus.$emit('createNew', type);
      }, 300);
      
    },
    selectFilter (item, i) {
      switch (item.title) {
        case 'Contact Name':
          this.searchType = item.title;
          this.search = null;
          // this.entity = 'Human';
          break;

        case 'Case Number':
          this.searchType = item.title;
          this.search = null;
          // this.entity = 'Case';
          break;
        
        default:
          this.searchType = 'Case Number';
          this.search = null;
          break;
      }
      // console.log(this.searchType, this.items, this.items.length);
    },
    async feedGrid (search) {
      this.bus.$emit('displayWhat', 'grid');
      console.log('feedGrid >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      console.log('>>>>> search: ', search);
      console.log('>>>>> this.where: ', this.where);
      console.log('feedGrid <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
     
      let populate = search ? 'human.human' : '';

      this.dialog_loading = true;
      this.loading = true;
      let {
        allData,
        data,
        total,
        error
      } = await getDataFromApi(this.entity, this, this.where, populate);
      if (error) {
        console.error(error);
        return;
      }

      let newAllData = JSON.parse(JSON.stringify(allData)); // Clone allData
      let newData = data;

      function filterByLastName (item, i, j) {

        let isTrue = false;

        item.human.forEach((element, index) => {
          // Fix allData modified by populete(human.human)
          newAllData[i].human[index].human = element.human.id;

          if (element.human.last_name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
              element.human.first_name.toLowerCase().indexOf(search.toLowerCase()) > -1) isTrue = true;

        });

        return isTrue;
      }

      if (search) {
        console.log('SEARCH >>>>>>>>>>>>>>');
        // this.where = null;
        newData = data.filter(filterByLastName);
      }

      this.selected = [];
      this.original_documents = [];
      this.documents = [];
      this.original_documents = newAllData;
      // console.log(this.original_documents, newData);
      this.totalDocuments = total;
      // this.documents = mountDataForGridBasedOnSawgger(this.swagger, this.entity, this.headers, newData);
      this.dialog_loading = false;
      this.loading = false;

      console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< this.where: ', this.where);

    },
    cardClick (newQuery) {
      this.bus.$emit('displayWhat', 'grid');
      console.log('cardClick >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      console.log('>>>>> newQuery: ', newQuery);
      console.log('>>>>> this.where: ', this.where);
      this.where = newQuery;
      console.log('>>>>> this.where2: ', this.where);
      console.log('cardClick <<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
      this.bus.$emit('displayWhat', 'grid');
      this.feedGrid();
      // alert('WORK!');
    }
  }
  
};
