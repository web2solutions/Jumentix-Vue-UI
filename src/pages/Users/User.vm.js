/* global session store $route moment */
import { update, create, getFromApi, getLocalCollection, getOnLocalCollection, getOne } from '../../helpers/helpers';
import session from '../../helpers/session';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import swal from 'sweetalert2';
export default {
  name: 'UsersDetails',
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
    UserID: null,
    snack: false,
    snackColor: '',
    snackText: '',
    valid: true,
    model: null,
    searchType: 'Name',
    isLoading: false,
    fab: false,
    advancedSearch: null,
    item_text: 'name',
    item_value: '_id',
    dialogEnableLogin: false,
    dialogChangePass: false,
    person: '',
    search: '',
    userData: '',
    humanData: '',
    show1: false,
    switchpass: true,
    switchpassValue: null,
    switchAsk: false,
    itemsMenu: [
      { title: 'Name' },
      { title: 'Case Number' }
    ],
    headersCase: [
      { text: 'Case #', value: 'case' },
      { text: 'Program', value: 'program', align: 'center' },
      { text: 'Role', value: 'role', align: 'center' },
      { text: 'Date Open', value: 'date_open', align: 'center' },
      { text: 'Date Close', value: 'date_close', align: 'center' },
      { text: 'Status', value: 'status', align: 'center' }
    ],
    caseItems: [],
    headersRelations: [
      { text: 'Relations', value: 'relations' },
      { text: 'Relationship', value: 'relationship', align: 'center' },
      { text: 'Case', value: 'case', align: 'center' },
      { text: 'Start', value: 'start', align: 'center' },
      { text: 'End', value: 'end', align: 'center' }
    ],
    relationshipItems: [],
    headersForm: [
      { text: 'Form', value: 'form' },
      { text: 'Last Update', value: 'last_update', align: 'center' },
      { text: 'Author', value: 'author', align: 'center' }
    ],
    itemsForm: [
      { 
        form: 'Initial Contact',
        last_update: '05/01/2019',
        author: 'Heart of Adoptions',
      }
    ],
    headersLogin: [
      { text: 'Login Date/Time', value: 'login' },
      { text: 'System', value: 'system', align: 'center' },
      { text: 'IP Address', value: 'ip', align: 'center' }
    ],
    itemsLogin: [
      { 
        login: '05/08/2019 3:50pm',
        system: 'MAC',
        ip: '209.124.1.141',
      }
    ],
    headersNotes: [
      { text: 'Date', value: 'date' },
      { text: 'author', value: 'author', align: 'center' },
      { text: 'Subject', value: 'subject', align: 'center' },
    ],
    itemsNotes: [
      { 
        date: '05/08/2019 3:50pm',
        author: 'J. Johnson',
        subject: 'Spoke about adoption',
      }
    ],
    rules: {
      required: value => !!value || 'Required.',
      counter: value => value.length <= 20 || 'Max 20 characters',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
      }
    },
    userRoleItems: ['admin', 'staff', 'parent', 'child', 'agency', 'caseworker', 'manager'],
    userItems: [],
    addUserSelect: false,
    userSelected: null,
    userSelect: null,
    addUserDialog: false,
    addUser: {
      username: '',
      password: '',
      roles: [],
      human: '',
      portal_access: false
    },
    passwordShow: false,
    userDataAccess: [],
  }),
  computed: {

  },
  watch: {
    userSelected (e) {
      this.humanData.user = e;
    },
    switchpass (e) {
      if (e === true) {
        this.switchpassValue = Math.random().toString(36).slice(-10);
      }
      else
      {
        // this.switchpassValue = null;
      }
    }
  },
  mounted () {
    this.switchpassValue = Math.random().toString(36).slice(-10);
    this.userID = this.$router.currentRoute.params.id;
    this.getUser(this.userID);
    // this.feedSelects('Human');
    // this.feedSelects('CaseNoteType');
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
  methods: {
    async getUser (UserID) {
      this.relationshipItems = [];
      this.caseItems = [];

      let populate = 'case.case, user';
      let where = { '_id': UserID };
      
      let { data, total, error } = await getFromApi('Human', this, where, populate);

      if (error) {
        console.log('ERROR GET Human: ', error);
        this.showSnack('ERROR GET Human: ', error);
      }
      else 
      {
        // console.log('Human: ', data);
        if (data.length > 0) {
          this.humanData = data[0];
          this.userData = this.humanData.user;
          this.userDataAccess = this.userData.access;

          this.humanData.human_relationship.forEach(async element => {
            let { error, data, status } = await getOnLocalCollection('Human', element.human);
            if (error) {
              console.log('ERROR GET Good: ', error);
            }
            else 
            {
              element['human'] = data.name;
              element['id'] = data.id;
            }

            let HumanRelationship = await getOnLocalCollection('HumanRelationship', element.relationship_type);
            
            console.log('relationshipItems', HumanRelationship);
            if (HumanRelationship.error) {
              console.log('ERROR GET Good: ', HumanRelationship.error);
            }
            else 
            {
              element['relationship_type'] = HumanRelationship.data.name;
            }

            this.relationshipItems.push(element);
            // console.log('relationshipItems', this.relationshipItems);
          });

          this.humanData.case.forEach(async element => {
            let caseData = await getOnLocalCollection('Case', element.case);
            if (caseData.error) {
              console.log('ERROR GET Good: ', error);
            }
            else 
            {
              caseData = caseData.data;
                
              element['case'] = caseData.case_number;

              let { error, data, status } = await getOnLocalCollection('Program', caseData.program);
              if (error) {
                console.log('ERROR GET Good: ', error);
              }
              else 
              {
                element['program'] = data.name;
              }

              let CaseStatusData = await getOnLocalCollection('CaseStatus', caseData.status);
              if (CaseStatusData.error) {
                console.log('ERROR GET Good: ', CaseStatusData.error);
              }
              else 
              {
                element['status'] = CaseStatusData.data.label;
              }
                
              let CaseHumanRoleData = await getOnLocalCollection('CaseHumanRole', element.role);
              if (CaseHumanRoleData.error) {
                console.log('ERROR GET Good: ', CaseHumanRoleData.error);
              }
              else 
              {
                element['role'] = CaseHumanRoleData.data.role;
              }
                
              this.caseItems.push(element);
                
            }

          });
        }
        else
        {
          this.showSnack('Human not found.');
        }
        
      }
    },
    async feedSelects (entity) {
      let { data, total, error } = await getLocalCollection(entity);
      if (error) {
        console.log(error);
      } else {
        // console.log(data);
        switch (entity) {
          case 'CaseNoteType':
            this.typeItems = data;
            break;
          case 'Human':
            this.authorItems = data;
            break;
          case 'User':
            if (data) {
              this.userItems = data;
            }
            break;
        
          default:
            break;
        }
        
      }
    },
    selectFilter (item, i) {
      console.log('selectFilter', this);
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
    },
    showSnack (errorMessage = false, message = 'Data saved') {
      this.snack = true;
      this.snackColor = errorMessage ? 'error' : 'success';
      this.snackText = errorMessage ? errorMessage : message;
    },
    dialogEnableLoginClose () {
      this.dialogEnableLogin = false;
      this.userSelected = null;
      this.addUserSelect = null;
    },
    async createNewUser () {
      if (this.$refs.addUser.validate()) {
        let { data, error } = await create('User', this.addUser);
        if (error)
        {
          console.error('error on update', error);
          this.snackbar = {
            show: true,
            color: 'red',
            text: error
          };
          return { data, error };
        } 
        else
        {
          this.addUserDialog = false;
          this.userItems.push(data);
          setTimeout(() => {
            this.addUser = Object.assign({}, this.defaultAddUser);
            this.userSelected = data.id;
          }, 300);

          
        }
      }
    },
    async updateHuman () {
      if (this.userData) {
        this.humanData.user = this.userData.id;
      }

      if (this.humanData.birthDate) {
        this.humanData.birthDate = new Date(this.humanData.birthDate).toISOString().substring(0, 10);
      }

      let { data, error } = await update('Human', this.humanData, this.userID);
      if (error)
      {
        console.error('error on update', error);
        this.snackbar = {
          show: true,
          color: 'red',
          text: error
        };
        return { data, error };
      } 
      else
      {
        // console.log('Update Human: ', data);
        if (this.userData) {
          let userUpdate = await update('User', this.userData, this.userData.id);
          if (userUpdate.error)
          {
            console.error('error on update', userUpdate.error);
            this.snackbar = {
              show: true,
              color: 'red',
              text: userUpdate.error
            };
            return { data, error };
          } 
          else
          {
            // console.log('Update User: ', userUpdate.data);
            this.getUser(data.id);
            this.closeEnableLogin();
          }
        }
        else
        {
          this.getUser(data.id);
        }
      }
    },
    closeNewUser () {
      this.addUserDialog = false;
      setTimeout(() => {

        this.addUser = Object.assign({}, this.defaultAddUser);

      }, 300);
    },
    closeEnableLogin () {
      this.dialogEnableLogin = false;
    }
  },
  beforeRouteUpdate (to, from, next) {
    let userID = to.params.id;
    this.getUser(userID);
    next();
  }
};