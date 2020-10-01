/* global session */
import { create, update, getCollection, remove, getFromApi } from '../../helpers/helpers';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import Country from '@/api/country';
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
    pagination: {
      sortBy: '_id',
      descending: false,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    loading: false,
    countrys: Country,
    selected: [],
    selectedSubRoles: [],
    search: '',
    rules: {
      required: value => !!value || 'Required.',
      min: value => value.length > 4 || 'String is too short (' + value.length + ' chars), minimum 5 .',

    },
    programSchema: {
      name: '',
      role: [],
    },
    programSchemaDefault: {
      name: '',
      role: [],
    },
    programDialog: false,
    programHeaders: [
      {
        text: 'Name',
        align: 'left',
        value: 'name'
      },
      { text: 'Actions', value: 'name', align: 'right', sortable: false }
    ],
    editedProgramIndex: -1,
    programItems: [],
    programRolesItem: [],
    roles: [],
    programRoleSchema: {
      role: '',
      sub_roles: []
    },
    programRoleSchemaDefault: {
      role: '',
      sub_roles: []
    },
    programRoleDialog: false,
    programRoleHeaders: [
      {
        text: 'Name',
        align: 'left',
        value: 'name'
      },
      // { text: '', value: 'name', align: 'right', sortable: false }
    ],
    editedSubRoleIndex: -1,
    programRoles: [],
    programSubRoles: [],
    programRoleInitDialog: false,
    roleInitIndex: null,
    rolesItem: [],
    subRolesItem: [],
    subRoleSelectedTitle: '',
    programSubRolesItem: []
  }),
  computed: {
    programFormTitle () {
      return this.editedProgramIndex === -1 ? 'New Program' : 'Edit Program';
    },
    programRoleFormTitle () {
      return this.editedSubRoleIndex === -1 ? 'New Sub Role' : 'Edit Sub Role';
    }
  },
  watch: {
    selectedSubRoles (e) {
      // console.log('selectedSubRoles', e, this.rolesItem[this.roleInitIndex]);
      let sub_role_Items = [];
      e.forEach(element => {
        sub_role_Items.push(element._id)
      });

      // console.log(this.programSchema.role.filter(t => t.role === this.rolesItem[this.roleInitIndex]._id).length);
      if (this.programSchema.role.filter(t => t.role === this.rolesItem[this.roleInitIndex]._id).length === 0) {
        this.programSchema.role.push({ role: this.rolesItem[this.roleInitIndex]._id, sub_roles: sub_role_Items });
      } else {
        this.programSchema.role.forEach(role => {
          if (e.length > 0 && role.role === e[0].role) { 
            
            role.sub_roles = sub_role_Items;
            // console.log('ROLE ____________', role, e);
          } else {
            //
          }
        });
      }
      // console.log('this.programSchema', this.programSchema);
    },
    selected (e) {
      // console.log('selectedRoles', e, this.selected);
      // console.log('this.programSchema', this.programSchema);
    }
  },
  created () {
    this.feedItem('Role');
    this.feedItem('Program');
  },
  mounted () {
    // this.$vuetify.goTo('#programTop');
  },
  methods: {
    async feedItem (entity) {
      let { data, total, error } = await getCollection(entity, 1000);
      if (error) {
        console.log(error);
      } else {
        switch (entity) {
          case 'Role':
            this.rolesItem = data;
            break;
          case 'Program':
            this.programItems = data.filter(d => {
              if (d.deleted === true) return false;
              return true;
            });
            break;
        
          default:
            break;
        }
        // this.rolesItem.forEach(element => { element.clicked = false });
        // console.log('feedItem', entity, data);
      }
    },
    editItem (item, e) {
      console.log('Edit >>>>>>>', e);
      switch (e) {
        case 'role':
          this.selected = [];
          this.editedProgramIndex = this.programItems.indexOf(item);
          this.programSchema = Object.assign({}, item);

          this.programSchema.role.forEach(role => {
            let roleItem = this.rolesItem.find(x => x._id === role.role);
            roleItem.sub_roles = role.sub_roles;
            this.selected.push(roleItem);
          });
          this.programDialog = true;
          break;

        default:
          break;
      }
    },

    deleteItem (item, e) {
      let index = null;
      // console.log('deleteItem', this.programSchema.sub_roles, item);
      Swal.fire({
        title: 'Delete item?',
        text: 'You won\'t be able to revert this!',
        type: 'error',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete it!'
      }).then((result) => {
        if (result.value) {
          switch (e) {
            case 'role':
              this.delete('Program', item._id)
              index = this.programItems.indexOf(item);
              this.programItems.splice(index, 1);
              break;

            default:
              break;
          }
          Swal.fire('Deleted!', 'Now you need to save the main form to save the changes.', 'warning')
        }
      })
      
      
    },
    close (item) {
      switch (item) {
        case 'role':
          this.programDialog = false;
          this.selected = [];
          this.selectedSubRoles = [];
          this.subRolesItem = [];
          setTimeout(() => {
            this.programSchema = Object.assign({}, this.programSchemaDefault);
            this.editedProgramIndex = -1;
          }, 300);
          break;
  
        default:
          break;
      }

      if (this.editedProgramIndex > -1) this.programRoles = [];
    },

    save (item) {
      if (this.$refs[item].validate() === true) {
        switch (item) {
          case 'role':
            console.log('SAVE >>>', item, this.programSchema);
            // this.programSchema.role = this.selected;
            if (this.editedProgramIndex > -1) {
              this.update(this.programSchema);
              // Object.assign(this.programItems[this.editedProgramIndex], this.programSchema);
            } else {
              // this.programItems.push(this.programSchema);
              this.create(this.programSchema);
            }
            break;
        
          default:
            break;
        }
        
        this.close(item);

      }
    },
    async create (e) {
      let { data, total, error } = await create('Program', e);
      if (error) {
        console.log(error);
      } else {
        this.programItems.push(data);
      }
    },
    async update (e) {
      let { data, total, error } = await update('Program', e, e._id);
      if (error) {
        console.log(error);
      } else {
        // this.programItems.push(data);
        Object.assign(this.programItems[this.editedProgramIndex], data);
      }
    },
    async delete (entity, id) {
      console.log('Delete >>>>>>>>> ', entity, id);
      let { error, data } = await remove(entity, id);
      if (error)
      {
        console.error('error on load', error);
        return { data, error };
      } 
      else
      {
        console.log(entity, 'Deleted successfully', data);
        this.feedItem('Program');
      }
    },
    async feedProgramSubRoles (e) {
      this.subRolesItem = [];
      this.programSubRolesItem = [];
      e.selected = true;
      // e.selected = !e.selected;
      console.log('feedProgramSubRoles >>>>>>>>>>>> e', e);
      this.subRoleSelectedTitle = e.name;
      this.roleInitIndex = this.rolesItem.indexOf(e);
      let where = { role: e._id };
      
      let { data, total, error } = await getFromApi('SubRole', this, where);
      if (error) {
        console.log(error);
      } else {
        if (e.sub_roles) {
          e.sub_roles.forEach(element => {
            let sub_roleItem = data.find(x => x._id === element);
            this.programSubRolesItem.push(sub_roleItem);
          });
        } else {
          this.subRolesItem = data;
        }
      }
      
      // console.log('e >', e);
      // console.log('this.subRolesItem', this.subRolesItem);
      // console.log('this.rolesItem', this.rolesItem[this.roleInitIndex]);
      // console.log('feedProgramSubRoles <<<<<<<<<<<');

    },
    async feedSubRoles (e) {
      this.subRolesItem = [];
      this.programSubRolesItem = [];
      e.selected = true;
      this.subRoleSelectedTitle = e.name;
      this.roleInitIndex = this.rolesItem.indexOf(e);
      let where = { role: e._id };
      
      let { data, total, error } = await getFromApi('SubRole', this, where);
      if (error) {
        console.log(error);
      } else {
        this.subRolesItem = data;
        if (e.sub_roles) {
          e.sub_roles.forEach(element => {
            let sub_roleItem = data.find(x => x._id === element);
            this.selectedSubRoles.push(sub_roleItem);
          });
        } else {
          this.subRolesItem = data;
        }
      }
      
      console.log('e >', e);
      console.log('this.subRolesItem', this.subRolesItem);
      console.log('this.rolesItem', this.rolesItem[this.roleInitIndex]);
      console.log('feedSubRoles <<<<<<<<<<<');

    },
    feedProgramRoles (e) {
      console.log('feedProgramRoles', e);
      this.programRolesItem = [];
      this.programSubRolesItem = [];
      e.role.forEach(element => {
        let roleItem = this.rolesItem.find(x => x._id === element.role);
        roleItem.sub_roles = element.sub_roles;
        this.programRolesItem.push(roleItem);
      });
      // console.log('feedProgram', e, this.rolesItem);
      // console.log('feedRoles', this.programRolesItem);
    }
  }
};
