/* global session store $route moment */
import { getOne, getLocalCollection, getFromApi, remove } from '../../helpers/helpers';
import session from '../../helpers/session';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import swal from 'sweetalert2';
export default {
  name: 'UsersListing',
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
    dialog: false,
    dialogEnableLogin: false,
    dialogChangePass: false,
    person: '',
    search: '',
    userData: '',
    humanData: '',
    show1: false,
    switchpass: true,
    switchAsk: false,
    itemsMenu: [
      { title: 'Name' },
      { title: 'Case Number' }
    ],
    headers: [
      { text: 'Username', value: 'username' },
      { text: 'Type', value: 'roles', align: 'center' },
      { text: 'Status', value: 'status', align: 'center' },
      { text: 'Last Login', value: 'last_login', align: 'center' },
      { text: 'Action', value: '', align: 'center', sortable: false },
    ],
    usersItems: [],
    editedIndex: -1,
    usersData: {
      username: '',
      roles: '',
      status: '',
      last_login: ''
    },
    actionItems: [
      { title: 'Add to Case' },
      { title: 'Email' },
      { title: 'Enable' },
      { title: 'Suspend' },
      { title: 'Add Task' },
      { title: 'Add Calendar Event' },
      { title: 'Add Contact Note' },
      { title: 'Add File' }
    ]
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
    this.initialize();
    // this.feedSelects('Human');
    // this.feedSelects('CaseNoteType');
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
    async initialize () {
      let entity = 'human';
      let populate = 'user';
      let { data, total, error } = await getFromApi(entity, this, null, populate);
      
      if (error) {
        console.log(error);
      } else {
        if (data.length >= 1) {
          this.pagination.totalItems = this.total;
          this.count = total;
          this.isLoading = false;
          this.usersItems = data;

          // console.log('data', this.usersItems);
        }
        
      }
      return this.usersItems;
      
    },
    async feedSelects (entity) {
      let { data, total, error } = await getLocalCollection(entity, this);
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
        
          default:
            break;
        }
        
      }
    },
    editItem (item) {
      this.editedIndex = this.usersItems.indexOf(item);
      this.usersData = Object.assign({}, item);
      this.dialog = true;
    },
    async save () {
      try {
        if (this.editedIndex > -1) {
          // update
          try {
            await this.update(this.usersData, this.usersData._id);
            Object.assign(this.usersItems[this.editedIndex], this.usersData);
          } catch (e) {
            console.log('ERROR UPDATE', e);
          }
        } 
        else 
        {
          if (this.$refs.form.validate()) {
            // create
            try {
              this.usersItems.push(this.usersData);
              let response =  await this.create(this.usersData);
              console.log('Response', response);
              swal.fire({
                type: 'success',
                title: 'Casenote created successfully',
                showConfirmButton: false,
                timer: 2500,
                onClose: () => {
                  this.$router.push({ path: 'case-notes' });
                }
              });
            } catch (e) {
              console.log('ERROR CREATE', e);
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
        }
      } catch (e) {
        console.log(e);
        return Error(e);
      }
    },
    async create (payload) {
      try {
        // payload.author = session.user().human.id;
        payload.end_date = new Date(payload.end_date).toISOString();
        payload.start_date = new Date(payload.start_date).toISOString();
        console.log('create (payload)', payload);
        let data = JSON.stringify(payload);
        console.log('Data: ', data);
        delete data.id;
        delete data._id;
        let type = 'POST';
        // let url = this.entity;
        let url = 'CaseNote';
        let response = await session.http({ type, url, data });
        // console.log(type, url, data);
        return response;
      } catch (e) {
        console.log(e);
        return Error(e);
      }
    },
    async update (payload, id) {
      try {
        payload.author = session.user().human.id;
        payload.end_date = new Date(payload.end_date).toISOString();
        let data = JSON.stringify(payload);
        delete data.id;
        delete data._id;
        let type = 'PUT';
        let url = `CaseNote/${id}`;
        let response = await session.http({ type, url, data });
        // console.log(response);
        return response;
      } catch (e) {
        console.log(e);
        return Error(e);
      }
    },
    close () {
      this.dialog = false;
      setTimeout(() => {
        this.usersData = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
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

      this.usersData = {
        subject: '',
        note: '',
        note_type: '',
        start_date: '',
        end_date: '',
        author: '',
        id: '',
        incident: '',
        priority: '',
        updatedAt: '',
      };
    },
    change (item) {
      console.log(item);
      if (item) this.usersData.author = item.id;
      
      console.log(this.usersData, item.id);
    },
    inputType (item) {
      if (item) this.usersData.note_type = item.id;
      console.log(this.usersData, item.id);
    },
    validate () {
      console.log(this.$refs.form);
      if (this.$refs.form.validate()) {
        this.snackbar = true;
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
    selectAction () {
      alert('Button Clicked');
    }
  }
};