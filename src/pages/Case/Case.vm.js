/* global session store $route jsPDF */

import Vue from 'vue';
import fromCDN from 'from-cdn';
import xGrid from './components/xGrid.vue';
import xCrudControls from '../../components/xCRUD/xCrudControls.vue';
import xForm from '../../components/xCRUD/xForm.vue';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {
  setGriHeaders,
  setFormFields,
  feedGrid,
  setXCrudMediatorDataSync,
  setXCrudMainListeners,
  getFromApi,
  getDataFromApi,
  getLocalCollection,
  clearFieldsValues,
  mountFieldQuery,
  create,
  deleteItem,
  mountDataForGridBasedOnSawgger
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
    EChart
  },
  name: 'Client',
  data: () => ({
    fab: false,
    fabAdd: false,
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
      headers: {},
      defaultItem: {},
      newItem: {},
      dialog: false,
      editedIndex: -1,
      valid: false,
    },
    forms: {
      crud: {
        name: 'crud',
        fields: [],
        values: {},
        labels: {},
        user_values: {},
        headers: {},
        defaultItem: {},
        newItem: {},
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
      CaseStatus: [],
      CaseType: [],
      CaseNoteType: [],
      CaseNoteStatus: []
    },
    searchType: 'Case Number',
    itemsMenu: [
      { title: 'Case Number' },
      { title: 'Contact Name' }
    ],
    searchCaseItems: [],
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
    caseTypes: [],
    color: Material,
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
        'Day': m,
        'Total Complete Cases': Math.floor(Math.random() * 4000) + 200,
      };
    });

    // Fake Randon Online users
    this.dataset.onlineUsers = this.shortWeek.map(m => {
      return {
        'month': m,
        'Total New Cases': Math.floor(Math.random() * 4000) + 200,
      };
    });

  },
  mounted () {
    // console.log('this.$router', this.$route.params.query);
    if (!this.bus) this.bus = new Vue();

    if (typeof this.$route.meta.entity === 'undefined') {
      console.error('Can not start xCrud. Entity is undefined');
      return;
    }
    if (this.$route.meta.entity === '' || this.$route.meta.entity === null) {
      console.error('Can not start xCrud. Entity is undefined');
      return;
    }
    if (typeof this.swagger.definitions[this.$route.meta.entity] === 'undefined') {
      console.error('Can not start xCrud. There is no swagger schema defined for ' + this.$route.meta.entity);
      return;
    }
    let properties = this.swagger.definitions[this.$route.meta.entity].properties;

    this.entity = this.$route.meta.entity;
    this.itemKey = this.$route.meta.itemKey;
    // this.forceRerender();
    setGriHeaders(this, properties);
    setFormFields(this);
    setXCrudMediatorDataSync(this);
    // this.headers.push({ $collection: false, align: 'left', hide: false, id: 'tasks', label: 'Tasks', sortable: true, text: 'Tasks', width: '100%' });
    setXCrudMainListeners(this);
    this.feedItems('SearchCase');
    this.feedItems('CaseType');
    this.feedItems('CaseNoteType');
    this.feedItems('CaseStatus');
    this.feedItems('Program');
    this.feedItems('Group');
    this.feedItems('Case');

    this.bus.$on('doAdvancedSearcha', (val) => {
      this.documents = [];
      this.doAdvancedSearch(val);
      // console.log('doAdvancedSearch ON', val, this.where);
    });

    if (this.$route.params.query) {
      this.where = this.$route.params.query;
      this.doAdvancedSearch(this.where);
    }

    this.bus.$on('cardClick', (newQuery) => {
      // console.log('CARDCLICK _+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+', newQuery);
      this.cardClick(newQuery);
    });



  },
  beforeRouteEnter (to, from, next) {
    if (!session.isOnline()) {
      next({ path: '/login' });
    }
    else {
      next();
    }
  },
  watch: {
    pagination: {
      handler () {
        this.where = this.queryObj;
        // console.warn('triggered pagination in human.vm', this.where, this.queryObj, this.search);
        this.selected = [];

        if (this.searchType !== 'Contact Name') {
          feedGrid(this, this.queryObj);
        }
        else {
          this.feedGrid(this.search);
        }
      },
      deep: true
    },
    displayWhat: {
      handler (val) {
        if (val === 'search') this.advancedSearch = false;
      },
      deep: true
    }
  },
  methods: {
    doTextSearch (search) {
      // console.log('doTextSearch', search);
      if (search) {
        if (this.searchType === 'Case Number') {
          // console.log('Case Number', search);
          this.bus.$emit('doTextSearch', search);
          return;
        }
        else {
          // console.log('Contact Name', search);
          this.feedGrid(search, 'Human');
        }
      }
      else {
        // console.log('Search Null', search);
        this.bus.$emit('doTextSearch', '');

        return;
      }

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
    },
    async feedItems (entity) {

      let { data, total, error } = await getLocalCollection(entity, false);
      // let { data, total, error } = await getFromApi(entity, this);
      if (error) {
        console.log(error);
      } else {
        if (data.length > 0) {
          if (entity === 'Case') {
            data.forEach(caseItem => {
              if (caseItem.status) {
                this.dataset.CaseStatus.forEach((element, i) => {
                  // console.log('caseStatus', element.name);
                  if (element._id === caseItem.status) return this.dataset.CaseStatus[i].value++;
                });

                this.dataset.CaseType.forEach((element, i) => {
                  // console.log('CaseType', element.name);
                  if (element.id === caseItem.type) return this.dataset.CaseType[i].value++;
                });
              }
              if (caseItem.notes.length > 0) {
                // let status = `${caseItem.status.label.toString()[0].toUpperCase()}${caseItem.status.label.toString().slice(1)}`;
                caseItem.notes.forEach(note => {
                  this.dataset.CaseNoteType.forEach((element, i) => {
                    if (element.id === note.type) return this.dataset.CaseNoteType[i].value++;
                  });
                });

              }
            });
            this.$refs.CaseStatus.pie.init();
            this.$refs.CaseType.pie.init();
            this.$refs.CaseNoteType.pie.init();
          }
          else {
            switch (entity) {
              case 'SearchCase':
                data = data.filter(d => {
                  if (d.deleted === true || session.user().id !== d.createdBy) return false;
                  return true;
                });
                this.searchCaseItems = data;
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
                this.dataset[entity] = data.map(status => {
                  return {
                    '_id': status.id,
                    'name': status.status,
                    'value': 0
                  };
                })
                this.$refs[entity].pie.pathOption[0][1] = this.dataset[entity];
                this.$refs[entity].pie.init();
                this.$refs.CaseNoteStatus.pie.pathOption[0][1] = this.dataset[entity];
                this.$refs.CaseNoteStatus.pie.init();
                break;
              case 'CaseType':
                data = data.filter(d => {
                  if (d.deleted === true) return false;
                  return true;
                });
                this.dataset[entity] = data.map(item => {
                  return {
                    'id': item.id,
                    'name': item.type,
                    'value': 0
                  };
                })
                this.$refs[entity].pie.pathOption[0][1] = this.dataset[entity];
                this.$refs[entity].pie.init();
                break;

              case 'CaseNoteType':
                data = data.filter(d => {
                  if (d.deleted === true) return false;
                  return true;
                });
                this.dataset[entity] = data.map(item => {
                  return {
                    'id': item.id,
                    'name': item.type,
                    'value': 0
                  };
                })
                this.$refs[entity].pie.pathOption[0][1] = this.dataset[entity];
                this.$refs[entity].pie.init();
                break;
              case 'Group':
                data = data.filter(d => {
                  if (d.deleted === true) return false;
                  return true;
                });
                this.groupItems = data;
                break;
              case 'Humans':
                this.caseTypes = data;
                break;
              default:
                break;
            }
          }
        }
      }
      // console.log(entity, this.dataset[entity], this.dataset.CaseStatus, this.dataset.CaseType);
    },
    async doAdvancedSearch (value) {

      this.bus.$emit('displayWhat', 'grid');
      let logicalOperator = '$' + this.form_search.matching_operator;
      // console.log('value++_______++++++++++', value);
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
        this.searchType = 'Case Number';
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
        // if (this.programModel) innerQuery[logicalOperator].push({ program: { $elemMatch: { 'program': this.programModel }}});
        if (this.programModel) innerQuery[logicalOperator].push({ program: this.programModel });


        if (this.groupModel) innerQuery[logicalOperator].push({ group: { $elemMatch: { 'group': this.groupModel }}});

        if (this.caseStatusModel) innerQuery[logicalOperator].push({ status: this.caseStatusModel });

        this.queryObj = {
          $and: [innerQuery]
        };

        clearFieldsValues(this, 'search');
      }
      // console.log('XXXXXX----->>>>>>>>>>>>> doAdvancedSearch client', logicalOperator, value, this.queryObj);
      if (this.queryObj.$and[0]) {
        if (this.queryObj.$and[0][logicalOperator]) {
          if (this.queryObj.$and[0][logicalOperator].length > 0) {
            this.where = this.queryObj;
            feedGrid(this, this.queryObj);
            // console.log('documents', this.where, this.original_documents);
            return;
          }
          else {
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
      // setting.push(this.queryObj); // = JSON.parse(JSON.stringify(this.queryObj));
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

      let { data, total, error } = await create('SearchCase', payload);
      if (error) {
        console.log(error);
      } else {
        this.dialog_loading = false;
        // console.log('CREATED SEARCH', data);
        this.feedItems('SearchCase');
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
          self.entity = 'SearchCase';
          console.log(self, item);
          await deleteItem(self, item);
          this.feedItems('SearchCase');
          Swal.fire(
            'Deleted!',
            'Your record has been deleted.',
            'success'
          );
        }
      });
    },
    async feedGrid (search) {

      this.documents = [];
      this.bus.$emit('displayWhat', 'grid');
      // console.log('feedGrid >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      // console.log('>>>>> search: ', search);
      // console.log('>>>>> this.where: ', this.where);
      // console.log('feedGrid <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');

      let populate = search ? 'human.human' : '';

      this.dialog_loading = true;
      this.loading = true;
      let {
        allData,
        data,
        total,
        error
      } = await getDataFromApi(this.entity, this, null, populate);
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
        // console.log('SEARCH >>>>>>>>>>>>>>');
        // this.where = null;
        newData = data.filter(filterByLastName);
      }

      this.selected = [];
      this.original_documents = [];
      this.documents = [];
      this.original_documents = newAllData;
      // console.log(this.original_documents, newData);
      this.totalDocuments = total;
      this.documents = mountDataForGridBasedOnSawgger(this.swagger, this.entity, this.headers, newData);
      this.dialog_loading = false;
      this.loading = false;
      // console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< this.where: ', this.where, this.headers);

    },
    cardClick (newQuery) {
      this.documents = [];
      // console.log('cardClick - this.documents', this.documents);
      this.where = newQuery;
      this.doAdvancedSearch(this.where);

    }
  }

};
