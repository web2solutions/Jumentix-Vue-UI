/* global session store $route moment */
import { update, create, getFromApi, getLocalCollection, getOnLocalCollection } from '../../helpers/helpers';
import session from '../../helpers/session';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import Swal from 'sweetalert2/dist/sweetalert2.js';
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
    dialog_loading: false,
    fab: false,
    advancedSearch: null,
    item_text: 'name',
    item_value: '_id',
    dialogEnableLogin: false,
    dialogChangePass: false,
    dialogAddCase: false,
    caseItemsSelect: [],
    roleItemsSelect: [],
    caseModalStartDate: false,
    caseModalEndDate: false,
    caseAdd: {
      case: null,
      role: null,
      startDate: null,
      endDate: null
    },
    defaultCaseAdd: {
      case: null,
      role: null,
      startDate: null,
      endDate: null
    },
    dialogAddRelationship: false,
    humanItemsSelect: [],
    relationshipItemsSelect: [],
    relationshipModalStartDate: false,
    relationshipModalEndDate: false,
    relationshipAdd: {
      human: null,
      relationship_type: null,
      startDate: null,
      endDate: null,
      memo: null
    },
    defaultRelationshipAdd: {
      human: null,
      relationship_type: null,
      startDate: null,
      endDate: null,
      memo: null
    },
    caseSelected: null,
    caseSelect: null,
    person: '',
    search: '',
    userData: null,
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
      { text: 'Status', value: 'status', align: 'center' },
      { text: '', value: '', align: 'center' }
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
    queryBack: null
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
  created: function () {
    
  },
  mounted () {
    // console.log('this.$router', this.$route);
    // console.log('this.$router.currentRoute', this.$router);
    this.switchpassValue = Math.random().toString(36).slice(-10);
    this.userID = this.$route.params.id;
    this.queryBack = this.$route.params.query ? this.$route.params.query : {};
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
  beforeRouteUpdate (to, from, next) {
    this.$route.params.id = to.params.id;
    console.log('beforeRouteUpdate ', this.$route.params.id, to.params.id);
    let userID = to.params.id;
    this.getUser(userID);
    next();
  },
  methods: {
    async getUser (UserID) {
      this.dialog_loading = true;
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
          // console.log('userData: ', this.humanData.user);
          if (this.humanData.user) {
            this.userData = this.humanData.user;
            this.humanData.user = this.userData.id;
            this.userDataAccess = this.userData.access ? this.userData.access : [];
          }
          

          this.humanData.human_relationship.forEach(async element => {
            let { error, data, status } = await getOnLocalCollection('Human', element.human);
            if (error) {
              console.log('ERROR GET Good: ', error);
            }
            else 
            {
              element['human_name'] = data.name;
              element['human_id'] = data.id;
              element['case'] = [];
            }

            let HumanRelationship = await getOnLocalCollection('HumanRelationship', element.relationship_type);
            
            // console.log('relationshipItems', HumanRelationship);
            if (HumanRelationship.error) {
              console.log('ERROR GET Good: ', HumanRelationship.error);
            }
            else 
            {
              element['relationship_type_name'] = HumanRelationship.data.name;
            }

            let HumanInCase = await getLocalCollection('Case');
            
            // console.log('HumanInCase', HumanInCase);
            if (HumanInCase.error) {
              console.log('ERROR GET Good: ', HumanInCase.error);
            }
            else 
            {
              HumanInCase.data.forEach(async elementCase => {
                elementCase.human.forEach((elementHuman, i) => {
                  if (element.human === elementHuman.human) {
                    let hasCase = false;
                    for (let i = 0; i < element['case'].length; i++) {
                      // console.log('for >>>>', element['case'][i].human, elementHuman.human);
                      if (element['case'][i].id === elementCase.id) {
                        hasCase = true;
                        break;
                      }
                    }
                    if (hasCase === false) {
                      element['case'].push({ name: elementCase.display_name, id: elementCase.id, human: elementHuman.human, index: i });
                    }
                  }
                });
              });
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
              
              let caseElement = element;
                
              caseElement['caseName'] = caseData.case_number + ' - ' + caseData.display_name;

              let { error, data, status } = await getOnLocalCollection('Program', caseData.program);
              if (error) {
                console.log('ERROR GET Good: ', error);
              }
              else 
              {
                caseElement['program'] = data.name;
              }

              let CaseStatusData = await getOnLocalCollection('CaseStatus', caseData.status);
              if (CaseStatusData.error) {
                console.log('ERROR GET Good: ', CaseStatusData.error);
              }
              else 
              {
                caseElement['status'] = CaseStatusData.data.label;
              }
                
              let CaseHumanRoleData = await getOnLocalCollection('CaseHumanRole', element.role);
              if (CaseHumanRoleData.error) {
                console.log('ERROR GET Good: ', CaseHumanRoleData.error);
              }
              else 
              {
                caseElement['roleName'] = CaseHumanRoleData.data.role;
              }
                
              this.caseItems.push(caseElement);
                
            }

          });
          this.dialog_loading = false;
        }
        else
        {
          this.showSnack('Human not found.');
        }
        
      }
    },
    async feedSelects (entity) {
      this.dialog_loading = true;
      let { data, total, error } = await getLocalCollection(entity);
      if (error) {
        console.log(error);
      } else {
        // console.log(entity, data);
        switch (entity) {
          case 'CaseNoteType':
            this.typeItems = data;
            break;
          case 'Human':
            this.humanItemsSelect = data;
            break;
          case 'User':
            if (data) {
              this.userItems = data;
            }
            break;
          case 'Case':
            if (data) {
              this.caseItemsSelect = data;
            }
            break;
          case 'CaseHumanRole':
            if (data) {
              this.roleItemsSelect = data;
            }
            break;
          case 'HumanRelationship':
            if (data) {
              this.relationshipItemsSelect = data;
            }
            break;

          default:
            break;
        }
        this.dialog_loading = false;
        
      }
    },
    selectFilter (item, i) {
      // console.log('selectFilter', this);
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
        this.dialog_loading = true;
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
            this.dialog_loading = false;
          }, 300);

          
        }
      }
    },
    async updateHuman () {
      this.dialog_loading = true;
      if (this.userData) {
        this.humanData.user = this.userData.id;
      }

      if (this.humanData.birthDate) {
        this.humanData.birthDate = new Date(this.humanData.birthDate).toISOString().substring(0, 10);
      }

      // console.log('Update Human1: ', this.humanData, this.userID);
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
            this.dialog_loading = false;
          }
        }
        else
        {
          this.getUser(data.id);
          this.dialog_loading = false;
        }
      }
    },
    dialogAdd (entity) {
      switch (entity) {
        case 'Case':
          this.feedSelects('Case');
          this.feedSelects('CaseHumanRole');
          this.dialogAddCase = true;
          break;
        
        case 'Relationship':
          this.feedSelects('Human');
          this.feedSelects('HumanRelationship');
          this.dialogAddRelationship = true;
          break;
      
        default:
          break;
      }

    },
    async addItems (item) {
      // console.log('validou', this.caseAdd);
      if (this.$refs[item].validate()) {
        this.dialog_loading = true;
        let payload = null;
        switch (item) {
          case 'case':
            // payload = this.caseAdd;
            this.caseAdd.startDate = new Date(this.caseAdd.startDate).toISOString();
            if (this.caseAdd.endDate) {
              this.caseAdd.endDate = new Date(this.caseAdd.endDate).toISOString();
            }
            else {
              delete this.caseAdd.endDate;
            }
            this.humanData.case.push(this.caseAdd);
            this.dialogAddCase = false;
            this.caseAdd = Object.assign({}, this.defaultCaseAdd);
            break;
          case 'Relationship':
            // payload = this.caseAdd;
            this.relationshipAdd.startDate = new Date(this.relationshipAdd.startDate).toISOString();
            if (this.relationshipAdd.endDate) {
              this.relationshipAdd.endDate = new Date(this.relationshipAdd.endDate).toISOString();
            }
            else {
              delete this.relationshipAdd.endDate;
            }
            if (this.relationshipAdd.memo === null) delete this.relationshipAdd.memo;
            this.humanData.human_relationship.push(this.relationshipAdd);
            this.dialogAddRelationship = false;
            this.relationshipAdd = Object.assign({}, this.defaultRelationshipAdd);
            break;
        
          default:
            break;
        }
        // console.log('validou', this.humanData);
        this.updateHuman();
        /* let { data, error } = await update('Human', this.humanData, this.userID);
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
          console.log('Contact Updated: ', data);
          this.getUser(this.userID);
        } */
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
    },
    deleteItem (entity, item) {
      Swal.fire({
        title: entity === 'case' ? 'Delete ' + entity + '?' : 'Delete Relationship?',
        text: 'You won\'t be able to revert this!',
        type: 'error',
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
      }).then((result) => {
        if (result.value) {
          const index = this.humanData[entity].indexOf(item);
          this.humanData[entity].splice(index, 1);
          let items = entity === 'case' ? this.caseItems : this.relationshipItems;
          items.splice(index, 1);
          this.updateHuman();
          Swal.fire(
            'Deleted!',
            'Contact updated successfully.',
            'warning'
          );
        }
      });

      // this.bus.$emit('deleteItem', item);
    }
  }
};
