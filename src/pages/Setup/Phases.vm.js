/* global session moment */
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { getFromApi, getOne, create, update, remove } from '../../helpers/helpers';
export default {
  components: {
  },
  name: 'Phases',
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
    headers: [
      { text: 'Name', align: 'left', value: 'name' },
      { text: 'Tasks', align: 'left', value: 'task' },
      { text: 'Actions', align: 'right', value: 'task' }
    ],
    phaseHeaders: [
      { text: 'Name', align: 'left', value: 'name' },
      { text: 'Assignment', align: 'left', value: 'assignment' },
      { text: 'Role', align: 'left', value: 'role' },
      { text: 'Sub Role', align: 'left', value: 'sub_role' },
      { text: 'Order', align: 'left', value: 'order' }
    ],
    tasksHeaders: [
      { text: 'Name', align: 'left', value: 'name' },
      { text: 'Assignment', align: 'left', value: 'assignment' },
      { text: 'Role', align: 'left', value: 'role' }
    ],
    phaseSchema: {
      name: '',
      task: []
    },
    phasesItems: [],
    editedPhaseIndex: -1,
    phaseDialog: false,
    tasksItems: [],
    editedTasksIndex: -1,
    tasksDialog: false,
    phaseTasksItem: [],
    tasksItem: [],
    tasksItemOFF: [
      { id: 1, name: 'Upload Drive License', assignment: 'All', role: 'Parent', sub_role: '', order: 1 },
      { id: 2, name: 'Pay for Bread', assignment: 'Any', role: 'Parent', sub_role: 'Father', order: 2 },
      { id: 3, name: 'Task containing sub tasks', assignment: 'All', role: 'Parent', sub_role: '', order: 3 },
      { id: 4, name: 'Take Medicine', assignment: 'One', role: 'Child', sub_role: '', order: 4 }
    ],
    selected: [],
    rules: {
      required: value => !!value || 'Required.',
    }
  }),
  computed: {
    phaseFormTitle () {
      return this.editedPhaseIndex === -1 ? 'New Phase' : 'Edit Phase';
    },
    taskPhaseFormTitle () {
      return this.editedPhaseIndex === -1 ? 'Add Task to Phase' : 'Edit Task Phase';
    }
  },
  watch: {
    tasksDialog (e) {
      this.feedGrid('Phase');
      this.feedGrid('TaskTemplate');
      if (e === true && this.editedPhaseIndex > -1) {
        this.selected = this.phaseSchema.task;
        // this.editedTasksIndex = this.phasesItems.indexOf(item);
      }
    }
  },
  created () {
    // let self = this;
    // this.feedGrid('Phases');
    this.feedGrid('Phase');
    this.feedGrid('TaskTemplate');
  },
  mounted () {
    // this.$vuetify.goTo('#RolesTop');
  },
  methods: {
    async feedGrid (entity) {
      let populate = entity === 'Phase' ? 'task' : '';
      let { data, total, error } = await getFromApi(entity, this, false, populate);
      if (error) {
        console.log(error);
      } else {
        switch (entity) {
          case 'Phase':
            this.phasesItems = data;
            break;
          case 'TaskTemplate':
            this.tasksItem = data;
            break;
        
          default:
            break;
        }
      }
    },
    
    editItem (item, e) {
      console.log('editItem', item, e);
      switch (e) {
        
        case 'phase':
          this.editedPhaseIndex = this.phasesItems.indexOf(item);
          this.phaseSchema = Object.assign({}, item);
          this.phaseTasksItem = this.phaseSchema.task;
          this.phaseDialog = true;
          break;

        default:
          break;
      }
    },

    deleteItem (item, e) {
      let index = null;
      // console.log('deleteItem', item);
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
            case 'phase':
              this.delete('Phase', item._id)
              index = this.phasesItems.indexOf(item);
              this.phasesItems.splice(index, 1);
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
        case 'phase':
          this.phaseDialog = false;
          setTimeout(() => {
            this.phaseSchema = Object.assign({}, this.phaseSchemaDefault);
            this.editedPhaseIndex = -1;
            this.selected = [];
            this.phaseTasksItem = [];
          }, 300);
          break;
        
        case 'task':
          this.tasksDialog = false;
          setTimeout(() => {
            // this.selected = [];
          }, 300);
          break;
  
        default:
          break;
      }
    },

    save (item) {
      if (this.$refs[item].validate() === true) {
        switch (item) {
          case 'phase':
            // console.log(item);
            if (this.editedPhaseIndex > -1) {
              this.update(this.phaseSchema);
            } else {
              this.create(this.phaseSchema);
            }
            break;
          
          case 'task':

            if (this.editedPhaseIndex > -1) {
              Object.assign(this.phaseTasksItem[this.editedPhaseIndex], this.selected);
              Object.assign(this.phasesItems[this.editedPhaseIndex], this.selected);
            } else {
              this.phaseTasksItem = this.selected;
            }
            this.phaseTasksItem = this.selected;
            this.phaseSchema.task = this.phaseTasksItem;
            this.close(item);
            break;
        
          default:
            break;
        }
        
        

      } else {
        Swal.fire(
          'Attention!',
          'All required fields must be completed.',
          'warning'
        );
        // this.$vuetify.goTo('#usersTop');
      }
    },
    async create (payload) {
      for (let payloadField in payload) {
        if (payload.hasOwnProperty(payloadField)) {
          // console.log(payloadField);
          if (payload[payloadField] === '' || payload[payloadField] === null) {
            delete payload[payloadField]
            continue
          }
        }
      }
      console.log('CREATE PAYLOAD >>', payload);
      payload.task.forEach((task, index) => {
        payload.task[index] = task.id;
      });
      
      let { data, total, error } = await create('Phase', payload);
      if (error) {
        console.log(error);
      } else {
        // this.phasesItems.push(data);
        this.feedGrid('Phase');
        console.log('CREATE >>', data);
        this.close('phase');
      }
    },
    async update (payload) {
      for (let payloadField in payload) {
        if (payload.hasOwnProperty(payloadField)) {
          // console.log(payloadField);
          if (payload[payloadField] === '' || payload[payloadField] === null) {
            delete payload[payloadField]
            continue
          }
        }
      }
      payload.task.forEach((task, index) => {
        payload.task[index] = task.id;
      });
      console.log('UPDATE PAYLOAD >>', payload);
      let { data, total, error } = await update('Phase', payload, payload._id);
      if (error) {
        console.log(error);
      } else {
        // this.programItems.push(data);
        Object.assign(this.phasesItems[this.editedPhaseIndex], data);
        this.feedGrid('Phase');
        console.log('UPDATE >>', data);
        this.close('phase');
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
        this.feedItem('Phase');
      }
    },
    fillField (collection, id, elementId) {
      window.setTimeout(() => {

        this._fillField(collection, id, elementId);
      }, 700);
    },

    async _fillField (collection, id, elementId) {
      // let { data, total, error } = await getOnLocalCollection(collection, id);
      // console.log('_fillField successfully', collection, id, elementId);
      if (id !== undefined) {
        let where = { _id: id };
      
        let { data, total, error } = await getOne(collection, id);
        if (error)
        {
          console.error('error get ' + collection, error);
          return { data, error };
        } 
        else
        {
          if (data) {
            document.getElementById(elementId).innerHTML = data.name;
          }
          else
          {
            document.getElementById(elementId).innerHTML = '';
          }
          
        }
      } 
      else
      {
        document.getElementById(elementId).innerHTML = '';
      }
      
    }
    
  }
};
