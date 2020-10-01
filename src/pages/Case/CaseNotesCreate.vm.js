/* global session store $route moment */
import { getOnLocalCollection, create, getLocalCollection } from '../../helpers/helpers';
import session from '../../helpers/session';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import swal from 'sweetalert2';
export default {
  name: 'CaseNotesCreate',
  components: {
    VuePerfectScrollbar
  },
  data: () => ({
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    valid: true,
    model: null,
    searchType: 'Name',
    isLoading: false,
    fab: false,
    advancedSearch: null,
    item_text: 'name',
    item_value: '_id',
    billiable: false,
    rangeSelect: false,
    startDate: null,
    endDate: null,
    modalStart: null,
    modalDuration: null,
    modalEnd: null,
    modalDate: null,
    typeModel: false,
    typeItems: null,
    typeSelect: false,
    typeSearch: '',
    authorModel: false,
    authorItems: null,
    authorSelect: null,
    authorSearch: null,
    incidentSelect: false,
    incidentSearch: '',
    prioritySelect: false,
    prioritySearch: '',
    columns: 6,
    dialog: false,
    search: '',
    itemsMenu: [
      { title: 'Name' },
      { title: 'Case Number' }
    ],
    incidentItems: ['Yes', 'No'],
    priorityItems: ['Low', 'Medium', 'High'],
    headers: [
      { text: '', value: '', align: 'center', sortable: false },
      {
        text: 'Type',
        align: 'center',
        value: 'type'
      },
      { text: 'Date', value: 'endDate', align: 'center' },
      { text: 'Author', value: 'author', align: 'center' },
      { text: 'Subject', value: 'subject', align: 'center' },
      { text: 'Tag', value: 'tag', align: 'center' },
      { text: 'Version', value: '', align: 'center' },
      { text: 'Action', value: '', align: 'center', sortable: false },
    ],
    caseItems: [],
    editedIndex: -1,
    caseDataDuration: null,
    caseData: {
      author: '',
      subject: '',
      note: '',
      type: '',
      startDate: '',
      duration_hour: '',
      duration_minute: '',
      incident: 'Yes',
      priority: 'Medium',
      drawee: '',
      case: '',
      form_id: '',
      bill_code: ''
    },
    caseSelected: {
      case_number: '',
      status: '',
      human: [],
      startDate: ''
    },
    formItems: null
  }),
  computed: {
    swagger () {
      return this.store.state.swagger;
    },
    formTitle () {
      return this.editedIndex === -1 ? 'New Case' : 'Edit Case';
    }
  },
  watch: {
    dialog (val) {
      val || this.close();
    }
  },
  created () {
    this.feedSelects('Human');
    this.feedSelects('CaseNoteType');
    this.feedSelects('Case');
    this.feedSelects('Wallet');
    this.feedSelects('Form');
  },
  beforeRouteEnter (to, from, next) {
    if (!session.isOnline())
    {
      // return;
      next({ path: '/login' });
    }
    else
    {
      next();
    }
    session.swagger({
      success: response => {
        // console.log('beforeRouteEnter: ', response);
        store.commit('setSwagger', response);
        next();
      },
      error: (xhr, ajaxOptions, thrownError) => {
        console.log(thrownError);
        next();
      }
    });
  },
  methods: {
    async feedSelects (entity) {
      let { data, total, error } = await getLocalCollection(entity, this);
      if (error) {
        console.log(error);
      } else {
        switch (entity) {
          case 'CaseNoteType':
            this.typeItems = data;
            break;
          case 'Human':
            this.authorItems = data;
            break;
          case 'Wallet':
            this.walletItems = data;
            break;
          case 'Case':
            this.caseItems = data;
            break;
          case 'Form':
            this.formItems = data;
            break;
        
          default:
            break;
        }
        console.log(entity, data);
      }
    },
    async save () {
      if (this.$refs.form.validate()) {
        // create
        if (this.endDate) this.caseData.endDate = new Date(this.endDate).toISOString();
        this.caseData.startDate = new Date(this.startDate).toISOString();

        if (this.caseData.drawee === null || this.caseData.drawee === '') delete this.caseData.drawee;

        if (this.caseDataDuration) {
          let duration = this.caseDataDuration.split(':');
          this.caseData.duration_hour = Number(duration[0]);
          this.caseData.duration_minute = Number(duration[1]);
        }
        else
        {
          delete this.caseData.duration_hour;
          delete this.caseData.duration_minute;
        }
        console.log('create (this.caseData)', this.caseData);

        let { data, total, error } = await create('CaseNote', this.caseData);
        if (error) {
          console.log('CaseNote Create Error', error);
        } else {
          console.log('CaseNote Create', data);
          swal.fire({
            type: 'success',
            title: 'Casenote created successfully',
            showConfirmButton: false,
            timer: 2500,
            onClose: () => {
              this.$router.push({ path: 'case-notes' });
            }
          });
        }
      }
      else
      {
        swal.fire({
          type: 'error',
          title: 'All fields must be filled',
          showConfirmButton: false,
          timer: 2500,
          onClose: () => {
            this.advancedSearch = true;
          }
        });
      }
    },
    selectFilter (item, i) {
      this.items = [];
      this.model = null;

      switch (item.title) {
        case 'Name':
          this.searchType = item.title;
          this.item_text = 'name';
          this.item_value = '_id';
          this.entity = 'Human';
          break;

        case 'Case Number':
          this.searchType = item.title;
          this.item_text = 'name';
          this.item_value = '_id';
          this.entity = 'Human';
          break;

        default:
          this.searchType = 'Name';
          break;
      }
      // console.log(this.searchType, this.items, this.items.length);
    },
    resetSearch () {

      this.caseData = {
        subject: '',
        note: '',
        type: '',
        startDate: '',
        duration: '',
        endDate: '',
        author: '',
        id: '',
        incident: '',
        priority: '',
        updatedAt: '',
      };
    },
    async caseChange (item) {
      if (item) {
        this.caseData.case = item.id;
        this.caseSelected.case_number = item.case_number;
        this.caseSelected.startDate = moment.tz(item.startDate, session.user().timezone).format('llll');
        // this.caseSelected.startDate = new Date(item.startDate).toISOString().substr(0, 10);

        let { data, total, error } = await getOnLocalCollection('CaseStatus', item.status);
        if (error) {
          console.log(error);
        } else {
          this.caseSelected.status = data.label;
        }

        item.human.forEach(async human => {
          let { data, total, error } = await getOnLocalCollection('Human', human.human);
          if (error) {
            console.log(error);
          } else {
            this.caseSelected.human.push(data.name);
          }          
        });
      }
      
    },
    closeTest () {
      if (this.$refs.form.validate()) {
        this.advancedSearch = false;
      } 
      else 
      {
        swal.fire({
          type: 'error',
          title: 'All fields must be filled',
          showConfirmButton: false,
          timer: 2500,
          onClose: () => {
            this.advancedSearch = true;
          }
        });
      }
      console.log('closeTest: ', this.caseData);
    },
  }
};