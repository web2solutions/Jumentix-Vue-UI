/* global session store $route jsPDF */

import Vue from 'vue';
import fromCDN from 'from-cdn';
import xGrid from './components/xCRUD/xGrid.vue';
import xCrudControls from './components/xCRUD/xCrudControls.vue';
import xForm from './components/xCRUD/xForm.vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import ClientsAdd from './ClientsAdd.vue';
import {
  setGriHeaders,
  setFormFields,
  feedGrid,
  setXCrudMediatorDataSync,
  setXCrudMainListeners,
  getFromApi,
  getOnLocalCollection,
  clearFieldsValues,
  mountFieldQuery,
  create,
  deleteItem
} from '../../helpers/helpers';
import session from '../../helpers/session';
// chart
import EChart from '@/components/chart/echart';
import MiniChart from '@/components/widgets/chart/MiniChart';
import BoxChart from '@/components/widgets/chart/BoxChart';
import Material from 'vuetify/es5/util/colors';
// end chart
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    VuePerfectScrollbar,
    xGrid,
    xForm,
    xCrudControls,
    MiniChart,
    BoxChart,
    EChart,
    ClientsAdd
  },
  name: 'Client',
  data: () => ({
    componentKey: 0,
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
      onlineUsers: [],
      humanTypes: [
        {
          value: 0,
          name: 'Admin'
        },
        {
          value: 0,
          name: 'Caseworker'
        },
        {
          value: 0,
          name: 'Child'
        },
        {
          value: 0,
          name: 'Parent'
        },
        {
          value: 0,
          name: 'Staff'
        },
        {
          value: 0,
          name: 'Agency'
        },
        {
          value: 0,
          name: 'Caseworker,manager'
        }
      ]
    },
    searchClientItems: [],
    queryObj: {},
    saveSearchDialog: false,
    advancedSearch: false,
    searchesSaveList: [
      { title: 'My Active clients', icon: '../../static/icon/3.png' },
      { title: 'My Completed Familys', icon: '../../static/icon/4.png' },
      { title: 'China Active Families', icon: '../../static/icon/5.png' },
      { title: 'Families with Tasks', icon: '../../static/icon/6.png' }
    ],
    imgName: '',
    searchName: '',
    programItems: [],
    caseStatusItems: [],
    assignToItems: [],
    groupItems: [],
    programModel: '',
    caseStatusModel: '',
    assignToModel: '',
    groupModel: '',
    humanTypes: [],
    color: Material,
  }),
  computed: {
    swagger () {
      return this.store.state.swagger;
    },
    online_users () {
      // console.log('this.store.state.online_users', this.store.state.online_users);
      return this.store.state.online_users;
    }
  },
  created: function () {
    
    this.ready = fromCDN([
      '//cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js',
      '//cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js'
    ]);
    this.bus = new Vue();

    // console.log('>>>>>>>>>>>>>', this.online_users);
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

  },
  mounted () {
    // console.log('this.$router', this.$route);
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
    this.forceRerender();
    setGriHeaders(this, properties);
    setFormFields(this);
    setXCrudMediatorDataSync(this);
    setXCrudMainListeners(this);
    this.feedItems('SearchClient');
    this.feedItems('Program');
    this.feedItems('CaseStatus');
    this.feedItems('Group');
    this.feedItems('Human');

    this.bus.$on('createItem', (isEmpty = true) => {
      this.displayWhat = 'create';
    });

    this.bus.$on('doAdvancedSearcha', (val) => {
      this.documents = [];
      this.doAdvancedSearch(val);
      // console.log('doAdvancedSearch ON', val);
    });

    if (this.$route.params.query) {
      this.where = this.$route.params.query;
      this.doAdvancedSearch(this.where);
    }

    this.bus.$on('cardClick', (newQuery) => {
      // console.log('CARDCLICK _+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+', newQuery);
      this.cardClick(newQuery);
    });

    if (this.$route.params.action === 'edit') {
      this.editContact(this.$route.params.id);
      //  console.log('$route.params.action', this.$route.params.id, this.original_documents);
    }
  },
  beforeRouteEnter (to, from, next) {
    if (!session.isOnline())
    {
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
        this.where = this.queryObj;
        // console.warn('triggered pagination in human.vm', this.where, this.queryObj);
        this.selected = [];
        feedGrid(this, this.queryObj);
      },
      deep: true
    },
    displayWhat: {
      handler (val) {
        if (val === 'search') this.advancedSearch = false;

        if (val === 'dashboard') this.advancedSearch = false;
      },
      deep: true
    },
    online_users: function (newData, oldData) {
      // console.log('online_users >>>>>>>>>>>: ', newData, oldData);
    }
  },
  methods: {
    forceRerender () {
      this.$forceUpdate();
      this.componentKey += 1;
    },
    doClearSearch () {
      this.bus.$emit('doTextSearch', '');
    },
    createNew (type) {
      this.displayWhat = 'create';
      setTimeout(() => {
        this.bus.$emit('createNew', type);
      }, 300);
      
    },
    async feedItems (entity) {

      if (entity === 'Human') {
        let { data, total, error } = await getFromApi(entity, this, null, 'user');
        if (data.length > 0) {
          data.forEach(human => {
            if (human.user) {
              let role = `${human.user.roles.toString()[0].toUpperCase()}${human.user.roles.toString().slice(1)}`;
              
              this.dataset.humanTypes.forEach((element, i) => {
                if (element.name === role) return this.dataset.humanTypes[i].value++;
              });
            }
          });
        }
        this.$refs.contactChart.pie.init();
      }

      let { data, total, error } = await getFromApi(entity, this);

      if (error) {
        console.log(error);
      } else {
        if (data.length > 0) {
          switch (entity) {
            case 'SearchClient':
              data = data.filter(d => {
                if (d.deleted === true || session.user().id !== d.createdBy) return false;
                return true;
              });
              this.searchClientItems = data;
              break;
            case 'Program':
              data = data.filter(d => {
                if (d.deleted === true) return false;
                return true;
              });
              this.programItems = data;
              break;
            case 'CaseStatus':
              data = data.filter(d => {
                if (d.deleted === true) return false;
                return true;
              });
              this.caseStatusItems = data;
              break;
            case 'Group':
              data = data.filter(d => {
                if (d.deleted === true) return false;
                return true;
              });
              this.groupItems = data;
              break;
            case 'Humans':
              this.humanTypes = data;
              break;
            default:
              break;
          }
        }
      }
    },
    async doAdvancedSearch (value) {

      this.bus.$emit('displayWhat', 'grid');
      let logicalOperator = '$' + this.form_search.matching_operator;
      if (value) {
        this.advancedSearch = false;
        
        if (typeof (value[0]) === 'undefined') {
          this.queryObj = value;
          return;
        } else {
          this.queryObj = JSON.parse(value[0]);
          return;
        }
      } else {
        this.advancedSearch = true;
        let objValues = JSON.parse(JSON.stringify(this.form_search.user_values));
        let objOperators = JSON.parse(JSON.stringify(this.form_search.operators));
        let innerQuery = {};
        innerQuery[logicalOperator] = [];

        delete objValues._id;
        delete objOperators._id;
        for (let property in objValues) {
          if (objValues.hasOwnProperty(property)) {
            let objQuery = mountFieldQuery(objValues, objOperators, property, innerQuery, logicalOperator);
            innerQuery = objQuery.innerQuery;
          }
        }
        if (this.programModel) innerQuery[logicalOperator].push({ program: { $elemMatch: { 'program': this.programModel }}});

        if (this.groupModel) innerQuery[logicalOperator].push({ group: { $elemMatch: { 'group': this.groupModel }}});

        if (this.caseStatusModel) {
          let where = { status: this.caseStatusModel };
          let { error, data } = await getFromApi('Case', this, where);
          if (error) {
            console.error(error);
           
          } else {
            data.forEach(element => {
              element.human.forEach(human => {
                innerQuery[logicalOperator].push({ _id: { $eq: human.human }});
              });
              
            });
          }
        }
        this.queryObj = {
          $and: [innerQuery]
        };
        
        clearFieldsValues(this, 'search');
      }
      if (this.queryObj.$and[0]) {
        if (this.queryObj.$and[0][logicalOperator]) {
          if (this.queryObj.$and[0][logicalOperator].length > 0) {
            this.where = this.queryObj;
            feedGrid(this, this.queryObj);
            return;
          }
          else
          {
            this.queryObj = false;
          }
        }
      }
    },
    async saveSearch () {
      this.saveSearchDialog = false;
      this.advancedSearch = false;
      this.dialog_loading = true;
      let setting = {};
      setting[0] = JSON.stringify(this.queryObj);
      let payload = {
        'human': session.user().human.id,
        'name': this.searchName,
        'settings': setting,
        'file': [
          {
            'file': 'string',
            'label': this.searchName,
            'name': this.imgName[1],
            'mimetype': 'image/png',
            'path': 'static/icon/' + this.imgName[1],
            'webPath': 'static/icon/' + this.imgName[1],
            'size': 12300,
          }
        ]
      };
      // console.log(payload, this.queryObj);
      
      let { data, total, error } = await create('SearchClient', payload);
      if (error) {
        console.log(error);
      } else {
        this.dialog_loading = false;
        this.feedItems('SearchClient');
      }
    },
    thumbSelect (val) {
      let element = val.target.parentElement;
      let x = document.getElementsByClassName('selected');      
      if (x.length > 0) x[0].classList.remove('selected');
      element.classList.toggle('selected');
      let path = val.target.src;
      this.imgName = path.split('icon/');      
    },
    async deleteSearch (item) {
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
          let self = this;
          self.entity = 'SearchClient';
          // console.log(self, item);
          await deleteItem(self, item);
          this.feedItems('SearchClient');
          Swal.fire(
            'Deleted!',
            'Your record has been deleted.',
            'success'
          );
        }
      });
    },
    cardClick (newQuery) {
      this.documents = []; // reset search
      this.where = newQuery;
      this.doAdvancedSearch(this.where);
    },
    async editContact (id) {

      let { error, data } = await getOnLocalCollection('Human', id);
      if (error) {
        console.log(error);
      } else {
        this.original_documents = [];
        this.original_documents.push(data);
        this.bus.$emit('editCRUDItem', 0);
        // console.log('Edit Result: ', this.original_documents);
      }
    }
  }
  
};
