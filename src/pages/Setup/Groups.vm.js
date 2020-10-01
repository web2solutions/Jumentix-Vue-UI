/* global session moment */
import { getOne, getFromApi, create, update, remove } from '../../helpers/helpers';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import Country from '@/api/country';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'Services',
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
    selectedServices: [],
    search: '',
    rules: {
      required: value => !!value || 'Required.',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
      }
    },
    groupSchema: {
      name: '',
      service: [],
      phase: [],
      program: []
    },
    groupSchemaDefault: {
      name: '',
      service: [],
      phase: [],
      program: []
    },
    groupDialog: false,
    groupHeaders: [
      {
        text: 'Name',
        align: 'left',
        value: 'name'
      },
      { text: 'Actions', value: 'name', align: 'right', sortable: false }
    ],
    editedGroupIndex: -1,
    groupItems: [],
    phaseSelected: [],
    phaseSchema: {
      organization: '',
      human: '',
      role: '',
      startDate: '',
      endDate: '',
      isOutside: false
    },
    phaseSchemaDefault: {
      organization: '',
      human: '',
      role: '',
      startDate: '',
      endDate: '',
      isOutside: false
    },
    phaseDialog: false,
    phaseHeaders: [
      { text: 'Name', width: '100px', align: 'left', value: 'name' },
      { text: 'Tasks', align: 'left', value: 'tasks' },
      { text: 'Order', align: 'left', value: 'order' },
      { text: 'Action', align: 'right', value: 'order' },
    ],
    phaseHeadersGroup: [
      { text: 'Name', width: '100px', align: 'left', value: 'name' },
      { text: 'Tasks', align: 'left', value: 'tasks' },
      { text: 'Order', align: 'left', value: 'order' },
    ],
    phaseAddHeaders: [
      { text: 'Name', width: '100%', align: 'left', value: 'name' },
    ],
    editedPhaseIndex: -1,
    phaseItems: [],
    phasesItemSelected: [],
    organizationItem: [],
    organizationHumanItem: [],
    roleItems: [],
    serviceSchema: {
      organization: '',
      human: '',
      role: '',
      startDate: '',
      endDate: '',
      isOutside: false
    },
    serviceSchemaDefault: {
      organization: '',
      human: '',
      role: '',
      startDate: '',
      endDate: '',
      isOutside: false
    },
    serviceDialog: false,
    serviceHeaders: [
      { text: 'Name', align: 'left', value: 'human' },
      { text: 'Role', align: 'left', value: 'role' },
      { text: 'Start Date', align: 'left', value: 'startDate' },
      { text: 'End Date', align: 'left', value: 'endDate' },
      { text: 'Actions', value: 'name', align: 'right', sortable: false }
    ],
    serviceHeadersGroup: [
      { text: 'Name', align: 'left', value: 'human' },
      { text: 'Role', align: 'left', value: 'role' },
      { text: 'Start Date', align: 'left', value: 'startDate' },
      { text: 'End Date', align: 'left', value: 'endDate' }
    ],
    editedServiceIndex: -1,
    servicesItem: [],
    serviceStartDatePicker: false,
    serviceEndDatePicker: false,
    groupServicesItem: [],
    groupProgramItem: [],
    groupPhaseItem: [],
    groupTaskItem: [],
    services: [],
    groupServiceSchema: {
      name: '',
      label: '',
      canDelete: true
    },
    groupServiceSchemaDefault: {
      name: '',
      label: '',
      canDelete: true
    },
    groupServiceDialog: false,
    programHeaders: [
      { 
        width: '100%', 
        text: 'Name',
        align: 'left',
        value: 'name'
      },
      // { text: '', value: 'name', align: 'right', sortable: false }
    ],
    editedSubServiceIndex: -1,
    groupServices: [],
    groupSubServices: [],
    groupServiceInitDialog: false,
    serviceInitIndex: null,
    programItem: [],
    subServiceSelectedTitle: '',
    tasksItem: [],
    tasksItemOFF: [
      { id: 1, name: 'Upload Drive License', assignment: 'All', role: 'Parent', sub_role: '', order: 1 },
      { id: 2, name: 'Pay for Bread', assignment: 'Any', role: 'Parent', sub_role: 'Father', order: 2 },
      { id: 3, name: 'Task containing sub tasks', assignment: 'All', role: 'Parent', sub_role: '', order: 3 },
      { id: 4, name: 'Take Medicine', assignment: 'One', role: 'Child', sub_role: '', order: 4 }
    ],
    tasksHeaders: [
      { text: 'Name', align: 'left', value: 'name' },
      { text: 'Assignment', align: 'left', value: 'assignment' },
      { text: 'Role', align: 'left', value: 'role' },
      { text: 'Sub Role', align: 'left', value: 'sub_role' }
    ]
  }),
  computed: {
    groupFormTitle () {
      return this.editedGroupIndex === -1 ? 'New group' : 'Edit group';
    },
    serviceFormTitle () {
      return this.editedSubServiceIndex === -1 ? 'New Service' : 'Edit Service';
    },
    phaseFormTitle () {
      return this.editedPhaseIndex === -1 ? 'New Phase' : 'Edit Phase';
    },
    computedServiceStartDate (e) {
      return this.serviceSchema.startDate ? moment(this.serviceSchema.startDate).format('L') : '';
    },
    computedServiceEndDate (e) {
      return this.serviceSchema.endDate ? moment(this.serviceSchema.endDate).format('L') : '';
    }
  },
  watch: {
    selectedServices (e) {
      console.log('selectedServices', e, this.selectedServices);
      console.log('this.groupSchema', this.groupSchema);
    },
    serviceDialog (e) {
      if (e === true) {
        this.feedItems('Organization');
        this.feedItems('Role');
      }
    },
    phaseDialog (e) {
      if (e === true) {
        this.feedItems('Phase');
      }
    },
    groupDialog (e) {
      if (e === true) {
        this.feedItems('Program');
        this.feedItems('Phase');
      }
    }
  },
  created () {
    this.feedItems('Group');
  },
  mounted () {
    // this.$vuetify.goTo('#groupTop');
  },
  methods: {
    async feedItems (entity) {
      let populate = entity === 'Phase' ? 'task' : '';
      let where = entity === 'Role' ? { type: 'Service' } : false;
      let { data, total, error } = await getFromApi(entity, this, where, populate);
      if (error) {
        console.log(error);
      } else {
        switch (entity) {
          case 'Group':
            this.groupItems = data;
            break;

          case 'Program':
            this.programItem = data;
            // this.programItem.forEach(element => { element.clicked = false });
            // console.log(entity, this.programItem);
            break;

          case 'Organization':
            this.organizationItem = data;
            break;
          
          case 'Role':
            this.roleItems = data;
            break;
        
          case 'Phase':
            this.phaseItems = data;
            break;
  
          default:
            break;
        }
      }
    },
    async editItem (item, e) {

      console.log('Edit >>>>>>>', e, item);
      switch (e) {
        case 'group':
          this.groupDialog = true;
          if (this.programItem.length === 0) await this.feedItems('Program');
          if (this.phaseItems.length === 0) await this.feedItems('Phase');

          this.editedGroupIndex = this.groupItems.indexOf(item);
          this.groupSchema = Object.assign({}, item);

          this.groupSchema.program.forEach(program => {
            this.selected.push(this.programItem.filter(p => p.id === program)[0])
          });
          
          this.groupSchema.phase.forEach(phase => {
            this.phasesItemSelected.push(this.phaseItems.filter(p => p.id === phase)[0])
          });
          this.phaseSelected = this.phasesItemSelected;

          console.log('Phase', this.groupSchema.phase);
          console.log('Phase Item', this.phaseItems);
          console.log('Phase phasesItemSelected', this.phasesItemSelected);

          // this.selected = this.groupSchema.program;
          this.servicesItem = this.groupSchema.service;
          

          console.log('groupSchema', this.groupSchema);
          console.log('Selected:', this.selected);
          break;
        
        case 'service':
          this.editedServiceIndex = this.servicesItem.indexOf(item);
          this.serviceSchema = Object.assign({}, item);
          this.serviceDialog = true;

          console.log('serviceSchema', this.serviceSchema);
          console.log('Selected:', this.selected);
          break;

        case 'phase':
          this.editedPhaseIndex = this.phaseItems.indexOf(item);
          this.phaseSchema = Object.assign({}, item);
          // this.phaseSelected = this.phaseSchema.phase;
          this.phaseDialog = true;

          console.log('phaseSchema', this.phaseSchema);
          console.log('Selected:', this.phaseSelected);
          break;
  

        default:
          break;
      }
    },

    deleteItem (item, e) {
      let index = null;
      console.log('deleteItem', e, item, this.groupSchema);
      switch (e) {
        case 'group':
          index = this.groupItems.indexOf(item);
          confirm('Are you sure you want to delete this item?') && this.groupItems.splice(index, 1);
          break;

        case 'service':
          index = this.servicesItem.indexOf(item);
          confirm('Are you sure you want to delete this item?') && this.servicesItem.splice(index, 1);
          break;

        case 'phase':
          index = this.phasesItemSelected.indexOf(item);
          confirm('Are you sure you want to delete this item?') && this.phasesItemSelected.splice(index, 1);
          this.tasksItem = [];
          break;

        default:
          break;
      }
      
    },
    close (item) {
      switch (item) {
        case 'group':
          this.groupDialog = false;
          this.selected = [];
          this.servicesItem = [];
          this.phaseSelected = [];
          this.phasesItemSelected = [];
          this.tasksItem = [];
          setTimeout(() => {
            this.groupSchema = Object.assign({}, this.groupSchemaDefault);
            this.editedGroupIndex = -1;
          }, 300);
          break;
        
        case 'service':
          this.serviceDialog = false;
          // this.servicesItem = [];
          setTimeout(() => {
            this.serviceSchema = Object.assign({}, this.serviceSchemaDefault);
            this.editedServiceIndex = -1;
          }, 300);
          break;

        case 'phase':
          this.phaseDialog = false;
          setTimeout(() => {
            // this.phaseSchema = Object.assign({}, this.phaseSchemaDefault);
            this.editedServiceIndex = -1;
          }, 300);
          break;
  
        default:
          break;
      }

      if (this.editedGroupIndex > -1) this.groupServices = [];
    },

    save (item) {
      console.log(item, this.groupSchema);
      if (this.$refs[item].validate() === true) {
        switch (item) {
          case 'group':
            this.groupSchema.program = [];
            this.selected.forEach(program => {
              this.groupSchema.program.push(program.id);
            });

            if (this.editedGroupIndex > -1) {
              this.update(this.groupSchema);
              // Object.assign(this.groupItems[this.editedGroupIndex], this.groupSchema);
            } else {
              this.create(this.groupSchema);
            }
            console.log('SAVE', item, this.groupSchema, this.groupItems);
            break;
          
          case 'service':
            this.serviceSchema.startDate = this.serviceSchema.startDate !== '' ? new Date(this.serviceSchema.startDate).toISOString() : new Date().toISOString();
            if (this.serviceSchema.endDate !== '') {
              this.serviceSchema.endDate = new Date(this.serviceSchema.endDate).toISOString();
            }
            else {
              delete this.serviceSchema.endDate;
            }
            // this.serviceSchema.endDate = this.serviceSchema.endDate !== '' ? new Date(this.serviceSchema.endDate).toISOString() : delete this.serviceSchema.endDate;
            if (this.editedServiceIndex > -1) {
              Object.assign(this.servicesItem[this.editedServiceIndex], this.serviceSchema);
            } else {
              this.servicesItem.push(this.serviceSchema);
              this.groupSchema.service = this.servicesItem;
            }
            console.log('SAVE', item, this.serviceSchema, this.servicesItem);
            break;
          
          case 'phase':
            this.groupSchema.phase = [];
            this.phasesItemSelected = [];
            this.phasesItemSelected = this.phaseSelected;

            this.phasesItemSelected.forEach(phase => {
              this.groupSchema.phase.push(phase.id);
            });            

            console.log('SAVE', item, this.phasesItemSelected, this.phaseItems);
            break;
        
          default:
            break;
        }
        this.close(item);

      }
    },
    async create (e) {
      console.log('Create >>>>>>>>> Payload', e);
      let { data, total, error } = await create('Group', e);
      if (error) {
        console.log(error);
      } else {
        this.groupItems.push(data);

        console.log('Create >>>>>>>>> Success', data);
      }
    },
    async update (e) {
      console.log('Update >>>>>>>>> Payload', e);
      let { data, total, error } = await update('Group', e, e._id);
      if (error) {
        console.log(error);
      } else {
        Object.assign(this.groupItems[this.editedGroupIndex], data);
        console.log('Update >>>>>>>>> Success', data);
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
    feedGroup (e) {
      this.feedItems('Phase');
      this.feedItems('Program');
      this.groupProgramItem = [];
      this.groupServicesItem = [];
      this.groupPhaseItem = [];
      this.groupTaskItem = [];
      

      e.program.forEach(program => {
        this.groupProgramItem.push(this.programItem.filter(p => p.id === program)[0])
      });

      e.phase.forEach(phase => {
        this.groupPhaseItem.push(this.phaseItems.filter(p => p.id === phase)[0])
      });

      this.groupServicesItem = e.service.length > 0 ? e.service : [];

      console.log('feedgroup - e', e);
      console.log('feedgroup - groupProgramItem', this.groupProgramItem);
      console.log('feedgroup - roupServicesItem', this.groupServicesItem);
      console.log('feedgroup - groupPhaseItem', this.groupPhaseItem);
      this.$forceUpdate();
    },
    async fillHumans (e) {
      this.serviceSchema.isOutside = !e.system_owner;
      this.serviceSchema.role = '';
      if (e.human.length > 0) {
        let humanList = [];
        
        e.human.forEach(human => {
          humanList.push({ _id: human.human })
        });

        let where = { $and: humanList };
        let { data, total, error } = await getFromApi('Human', this, where, 'user');
        if (error) {
          console.log(error);
        } else {
          this.organizationHumanItem = data;
        }
      } else {
        this.organizationHumanItem = [];
      }
      
    },
    setHumanRole (e) {
      this.serviceSchema.role = this.serviceSchema.organization.human.filter(h => h.human === e)[0].role;
    },
    async feedTasks (e) {
      console.log('feedTasks', e);
      if (e.task.length > 0) {
        let taskList = [];
        
        e.task.forEach(task => {
          taskList.push({ _id: task })
        });

        let where = { $and: taskList };
        let { data, total, error } = await getFromApi('TaskTemplate', this, where);
        if (error) {
          console.log(error);
        } else {
          this.tasksItem = data;
        }
      } else {
        this.tasksItem = [];
      }
    },
    fillField (collection, id, elementId) {
      window.setTimeout(() => {

        this._fillField(collection, id, elementId);
      }, 700);
    },
    async _fillField (collection, id, elementId) {
      if (id !== undefined) {
        let { data, total, error } = await getOne(collection, id);
        if (error)
        {
          console.error('error get ' + collection, error);
          return { data, error };
        } 
        else
        {
          
          if (data) {
            console.log('_fillField >>>>>>>>', collection, id, elementId, data.name);
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
