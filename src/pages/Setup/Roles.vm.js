/* global session moment store */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { getFromApi, create, update, getLocalCollection, getOnLocalCollection } from '../../helpers/helpers';
import Swal from 'sweetalert2/dist/sweetalert2.js';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'Roles',
  props: {
    bus: {
      type: Object,
      default: function () { return {} },
    }
  },
  data: () => ({
    loading: false,
    selected: [],
    rules: {
      required: value => !!value || 'Required.'
    },
    roleSchema: {
      _ids: '',
      name: '',
      label: '',
      type: 'Family',
      canDelete: false
    },
    roleSchemaDefault: {
      _ids: '',
      name: '',
      label: '',
      type: 'Family',
      canDelete: true
    },
    roleDialog: false,
    roleHeaders: [
      {
        text: 'Name',
        align: 'left',
        value: 'roleSchema.name'
      },
      { text: 'Label', value: 'roleSchema.label' },
      { text: 'Type', value: 'roleSchema.type' },
      { text: 'Can delete?', value: 'roleSchema.canDelete' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    editedRoleIndex: -1,
    roles: [],
    subRoleSchema: {
      name: '',
      label: '',
      canDelete: false
    },
    subRoleSchemaDefault: {
      name: '',
      label: '',
      canDelete: false
    },
    subRoleDialog: false,
    subRoleHeaders: [
      {
        text: 'Name',
        align: 'left',
        value: 'subRoleSchema.name'
      },
      { text: 'Label', value: 'subRoleSchema.label' },
      { text: 'Can delete?', value: 'subRoleSchema.canDelete' },
      { text: 'Actions', value: 'name', sortable: false }
    ],
    editedSubRoleIndex: -1,
    subRoles: [],
    subRolesInit: [],
    subRoleInitDialog: false,
    roleInitIndex: null,
    btnAddSubRoleInit: true,
    newRoleID: ''
  }),
  computed: {
    roleFormTitle () {
      return this.editedRoleIndex === -1 ? 'New Role' : 'Edit Role';
    },
    subRoleFormTitle () {
      return this.editedSubRoleIndex === -1 ? 'New Sub Role' : 'Edit Sub Role';
    }
  },
  watch: {

  },
  created () {
    // let self = this;
  },
  mounted () {
    this.feedItems('Role');
    // this.$vuetify.goTo('#roleTop');
  },
  methods: {
    goToUrl (e) {
      this.$router.push({ path: '/setup/' + e });
    },
    addNewRole () {
      const ObjectID = require('bson-objectid');
      this.newRoleID = (ObjectID()).toString();
      this.roleDialog = true;

      console.log('addNewRole >>>>>>>>>', this.newRoleID);
    },
    editItem (item, e) {
      console.log('EditItem >>>>>>>>>', e, item);
      switch (e) {
        case 'role':
          this.editedRoleIndex = this.roles.indexOf(item);
          this.roleSchema = Object.assign({}, item);
          this.roleDialog = true;
          this.feedSubRoles(item);
          console.log(this.roles[this.editedRoleIndex], this.roleSchema);
          break;

        case 'subRole':
          this.editedSubRoleIndex = this.subRoles.indexOf(item);
          this.subRoleSchema = Object.assign({}, item);
          this.subRoleDialog = true;
          break;
        
        case 'subRoleInit':
          this.editedSubRoleIndex = this.subRolesInit.indexOf(item);
          this.subRoleSchema = Object.assign({}, item);
          this.subRoleInitDialog = true;
          break;

        default:
          break;
      }
    },

    deleteItem (item, e) {
      let index = null;
      console.log('DeleteItem >>>>>>>>>', this.roleSchema.sub_roles, item);
      switch (e) {
        case 'role':
          index = this.roles.indexOf(item);
          confirm('Are you sure you want to delete this item?') && this.roles.splice(index, 1);
          break;

        case 'subRole':
          index = this.subRoles.indexOf(item);
          confirm('Are you sure you want to delete this item?') && this.subRoles.splice(index, 1);
          break;

        default:
          break;
      }
      
    },
    close (item) {
      console.log('Close >>>>>>>>>', item);
      switch (item) {
        case 'role':
          this.roleDialog = false;
          setTimeout(() => {
            this.roleSchema = Object.assign({}, this.roleSchemaDefault);
            this.editedRoleIndex = -1;
            this.subRoles = [];
            // this.newRoleID = '';
            this.feedItems('Role');
          }, 300);
          break;

        case 'subRole':
          this.subRoleDialog = false;
          setTimeout(() => {
            this.subRoleSchema = Object.assign({}, this.subRoleSchemaDefault);
            this.editedSubRoleIndex = -1;
            // this.subRoles = [];
          }, 300);
          break;
        
        case 'subRoleInit':
          this.subRoleInitDialog = false;
          setTimeout(() => {
            this.subRoleSchema = Object.assign({}, this.subRoleSchemaDefault);
            this.editedSubRoleIndex = -1;
            // this.subRoles = [];
          }, 300);
          break;
  
        default:
          break;
      }

      // if (this.editedRoleIndex > -1) this.subRoles = [];
    },

    save (item) {
      console.log('Save >>>>>>>>>', item);
      if (item === 'roles' || this.$refs[item].validate() === true) {
        switch (item) {
          case 'role':
            if (this.editedRoleIndex > -1) {
              Object.assign(this.roles[this.editedRoleIndex], this.roleSchema);
              this.update('Role', this.roleSchema, this.roles[this.editedRoleIndex]._id);
            } else {
              // this.roleSchema._id = this.newRoleID;
              this.create('Role', this.roleSchema);
              
              this.roles.push(this.roleSchema);
            }
            break;

          case 'subRole':
            if (this.editedSubRoleIndex > -1) {
              Object.assign(this.subRoles[this.editedSubRoleIndex], this.subRoleSchema);
              this.update('SubRole', this.subRoleSchema, this.subRoles[this.editedSubRoleIndex]._id);
              
            } else {
              this.subRoleSchema.role = this.newRoleID;
              console.log('this.subRoleSchema', item, this.subRoleSchema);
              this.create('SubRole', this.subRoleSchema);
              this.subRoles.push(this.subRoleSchema);
            }
            break;
          
          case 'subRoleInit':

            console.log('subRoleInit', this.roleInitIndex, this.editedSubRoleIndex);
            if (this.editedSubRoleIndex > -1) {
              Object.assign(this.subRolesInit[this.editedSubRoleIndex], this.subRoleSchema);
              this.update('SubRole', this.subRoleSchema, this.subRolesInit[this.editedSubRoleIndex]._id);
              
            } else {
              this.subRoleSchema.role = this.newRoleID;
              console.log('this.subRoleSchema', item, this.subRoleSchema);
              this.create('SubRole', this.subRoleSchema);
              this.subRolesInit.push(this.subRoleSchema);
              
            }
            break;

          case 'roles':
            this.bus.$emit('nextStep', 4);
            break;
  
        
          default:
            break;
        }
        
        this.close(item);

      } else {
        Swal.fire(
          'Attention!',
          'All required fields must be completed.',
          'warning'
        );
        this.$vuetify.goTo('#' + item + 'Top');
      }
    },
    async feedSubRoles (e) {
      let roleID = e._id;
      this.newRoleID = roleID;
      this.roleInitIndex = this.roles.indexOf(e);
      let { data, total, error } = await getLocalCollection('SubRole', this);
      if (error) {
        console.log(error);
      } else {
        if (this.roleDialog === true) {
          this.subRoles = data.filter(item => { return item.role === roleID });
        } else {
          this.subRolesInit = data.filter(item => { return item.role === roleID });
          this.btnAddSubRoleInit = false;
        }
        // console.log('feedSubRoles', this.roleInitIndex, roleID, e, data);
      }
    },
    async create (item, payload) {
      let newPayload = payload;
      if (item === 'Role') { 
        payload._id = this.newRoleID;
        payload.id = this.newRoleID;
        console.log('itemRole >>>', payload);
      }
      console.log(item, 'Create payload >>>>>>>>> ', payload, this.newRoleID, payload._id);
      let { error, data } = await create(item, payload);
      if (error)
      {
        console.error('error on load', error);
        this.snackbar = {
          show: true,
          color: 'red',
          text: error
        };
        return { data, error };
      } 
      else
      {
        console.log(item, ' Created successfully', data);
      }
    },
    async update (item, payload, id) {
      console.log(item, ' updated payload >>>>>>>>> ', id, payload);
      let { error, data } = await update(item, payload, id);
      if (error)
      {
        console.error('error on load', error);
        this.snackbar = {
          show: true,
          color: 'red',
          text: error
        };
        return { data, error };
      } 
      else
      {
        console.log(item, ' updated successfully', data);
      }
    },
    async feedItems (entity) {
      let { data, total, error } = await getLocalCollection(entity, this);
      if (error) {
        console.log(error);
      } else {
        // console.log(entity, data);
        switch (entity) {
          case 'Role':
            this.roles = data;
            break;
          case 'SubRole':
            this.subRoles = data;
            break;
        
          default:
            break;
        }
        
      }
    }
    
  }
};
