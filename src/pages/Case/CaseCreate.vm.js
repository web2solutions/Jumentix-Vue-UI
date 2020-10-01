/* global session moment */
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { update, getCollection, getOne, getOnLocalCollection, getFromApi, fillField } from '../../helpers/helpers';
import Sortable from 'sortablejs';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'CaseCreate',
  data: () => ({
    pagination: {
      sortBy: 'name',
      descending: true,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    paginationPhase: {
      sortBy: 'order'
    },
    paginationName: {
      sortBy: 'name'
    },
    dragging: false,
    rules: {
      required: value => !!value || 'Required.',
    },
    caseID: '',
    caseSchema: {
      type: '',
      status: '',
      family: '',
      display_name: '',
      case_number: '',
      group: [],
      client: [],
      service: [],
      phase: [],
      notes: [
        {
          _id: '',
          author: '',
          type: '',
          form: '',
          subject: '',
          note: '',
          priority: '',
          incident: '',
          bill_code: '',
          drawee: '',
          duration_hour: 0,
          duration_minute: 0,
          startDate: '',
          endDate: '',
          file: [
            {
              label: '',
              file: '',
              memo: ''
            }
          ]
        }
      ],
      is_placement: false,
      cases: [],
      startDate: new Date().toISOString().substr(0, 10),
      endDate: '',
      file: [
        {
          label: '',
          file: '',
          memo: '',
        }
      ]
    },
    startDatePicker: false,
    endDatePicker: false,
    caseStatusItem: [],
    caseTypeItem: [],
    caseFamilyItem: [],
    clientsHeaders: [
      { text: 'Name', align: 'left', value: 'who' },
      { text: 'Role', align: 'left', value: 'role' },
      { text: 'Sub Role', align: 'left', value: 'sub_role' },
      { text: 'Type', value: 'type' },
      { text: 'Join to Case', align: 'center', width: 100, value: '' }
    ],
    casesHeaders: [
      { text: 'Name', align: 'left' }
    ],
    notesHeaders: [
      { text: 'Subject', align: 'left', value: 'subject' },
      { text: 'Type', align: 'left', value: 'type' },
      { text: 'Author', align: 'left', value: 'author' }
    ],
    serviceHeaders: [
      { text: 'Who', align: 'left', value: 'who' },
      { text: 'Role', align: 'left', value: 'role' },
      { text: 'Whose', align: 'left', value: 'whose' },
      { text: 'Group', align: 'left', value: 'group' },
      { text: 'Select Worker', align: 'center', width: 100, value: '' }
    ],
    groupsHeaders: [
      { text: 'Name', align: 'left', value: 'id' },
      { text: 'Action', align: 'center', width: 100, value: '' }
    ],
    phasesHeaders: [
      { text: '', align: 'left', sortable: false },
      { text: 'Name', align: 'left', value: 'phase' },
      { text: 'Tasks', align: 'left', value: 'tasks', width: 90 },
      { text: 'Order', align: 'left', value: 'order', width: 90 }
    ],
    tasksHeaders: [
      { text: 'Name', align: 'left', value: 'phase' },
      { text: 'Assignment', align: 'left', value: 'assignment' },
      { text: 'Role', align: 'left', value: 'role' },
      // { text: 'Sub Role', align: 'left', value: 'sub_role' },
      { text: 'Who', align: 'left', value: 'who' },
      { text: 'Order', align: 'centerclick', value: 'order', width: 90 },
      { text: 'Assign Task', align: 'center', value: '' }
    ],
    snack: false,
    snackColor: '',
    snackText: '',
    max25chars: v => v.length <= 25 || 'Input too long!',
    subRoleItems: [],
    clientItems: [],
    clientSelected: [],
    caseGroupItem: [],
    groupSelected: [],
    phaseSelected: [],
    groupSelectedItems: [],
    caseGroupServiceItem: [],
    serviceSelected: [],
    actions: [
      {
        text: 'View Item',
        icon: 'visibility',
        click: this.handleViewItem
      },
      {
        text: 'Edit Item',
        icon: 'edit',
        click: this.handleEditItem
      },
      {
        text: 'Delete Item',
        icon: 'delete',
        click: this.handleDeleteItem
      }
    ],
    showAll: true,
    caseGroupPhaseItem: [],
    tasksItems: [],
    subTasksItems: [],
    noteSelected: [],
    taskSelected: [],
    subTaskSelected: []
  }),
  computed: {
    computedCaseStartDate (e) {
      return this.caseSchema.startDate ? moment(this.caseSchema.startDate).format('L') : '';
    },
    computedCaseEndDate (e) {
      return this.caseSchema.endDate ? moment(this.caseSchema.endDate).format('L') : '';
    },
    selectedAllGroup () {
      return this.groupSelectedItems.length === this.caseGroupItem.length
    },
    selectedSomeGroup () {
      return this.groupSelectedItems.length > 0 && !this.selectedAllGroup
    },
    groupSelectionIcon () {
      if (this.selectedAllGroup) return 'check_box'
      if (this.selectedSomeGroup) return 'indeterminate_check_box'
      return 'check_box_outline_blank'
    }
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
  },
  watch: {
    groupSelectedItems (e) {
      this.caseGroupServiceItem = [];
      this.caseSchema.phase = [];
      this.groupSelected = [];
      let index = 0
      if (e.length > 0) {
        e.forEach(group => {
          group.service.forEach(service => {
            service.group = group._id;
            console.log('group.service', service);
            this.caseGroupServiceItem.push(service)
          });
        });

        // this.caseSchema.phase = [...new Set(this.caseSchema.phase)];
        // let tasksTotal = 0;

        /* e.phase.forEach(async (phases, index) => {
          let phaseData = await getOnLocalCollection('Phase', phases.phase);
          tasksTotal += phaseData.data.task.length;
          this.caseSchema.phase[index].tasksTotal = tasksTotal;
        }); */
      }

      console.log('groupSelected', e)
      console.log('this.caseSchema.phase', this.caseSchema.phase)
      // console.log('this.caseGroupServiceItem', this.caseGroupServiceItem)
    }
  },
  created () {
    this.feedItem('CaseStatus');
    this.feedItem('CaseType');
    this.feedItem('Family');
    this.feedItem('Group');
  },
  mounted () {
    const _self = this;
    Sortable.create(
      this.$refs.sortablePhases.$el.getElementsByTagName('tbody')[0],
      {
        handle: '.sortHandle',
        onEnd ({ newIndex, oldIndex }) {
          const rowSelected = _self.caseSchema.phase.splice(oldIndex, 1)[0];
          _self.caseSchema.phase.splice(newIndex, 0, rowSelected);
          _self.caseSchema.phase.forEach((element, index) => {
            _self.caseSchema.phase[index].order = index;
          });
        }
      }
    );
  },
  methods: {
    async getItem (entity, id) {
      if (entity === 'Family') this.clientItems = []
      if (!id) return;

      let { data, error } = await getOne(entity, id);
      if (error) {
        console.log(error);
      } else {
        switch (entity) {
          case 'Family':
            this.clientItems = data.member;
            break;
          case 'Group':
            this.caseGroupItem = data;
            break;
        
          default:
            break;
        }
        // console.log('getItem', entity, data);
      }
    },
    async feedItem (entity) {
      let populate = entity === 'Group' ? 'phase' : ''; 
      let { data, error } = await getFromApi(entity, this, false, populate);
      if (error) {
        console.log(error);
      } else {
        switch (entity) {
          case 'CaseStatus':
            this.caseStatusItem = data;
            break;
          case 'CaseType':
            this.caseTypeItem = data;
            break;
          case 'Family':
            this.caseFamilyItem = data;
            break;
          case 'Group':
            this.caseGroupItem = data;
            break;
        
          default:
            break;
        }
        console.log('feedItem', entity, data);
      }
    },
    xfillField (collection, _id, fieldId) {
      if (collection.collection === 'Role' && this.subRoleItems[_id] === undefined) this.fillSubRoles(_id)
      fillField(this, collection, _id, fieldId);
    },
    async createCase () {
      let payload = Object.assign({}, this.caseSchema);

      payload.group = []
      this.groupSelected.forEach(group => {
        payload.group.push(group._id)
      });

      this.caseSchema.service.forEach((service, index) => {
        payload.service[index].who = service.human;
      });

      console.log('Create Payload >>>>: ', payload)
      console.log('>> this.caseSchema >>>>: ', this.caseSchema)
      console.log('>> groupSelected >>>>: ', this.groupSelected)
      console.log('>> caseGroupServiceItem >>>>: ', this.caseGroupServiceItem)
      console.log('>> phaseSelected >>>>: ', this.phaseSelected)
      console.log('>> taskSelected >>>>: ', this.taskSelected)
    },
    save (id) {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    clicked () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'clicked >>>>>'
    },
    async fillSubRoles (id) {
      if (this.subRoleItems[id] === undefined) this.subRoleItems[id] = []
      console.log('fillSubRoles Data SubRoles: >>>>>>>>>>>>> ', id, this.subRoleItems[id], this.subRoleItems);
      let where = { 'role': id };
      let { data, error } = await getFromApi('SubRole', this, where);
      if (error) {
        console.log(error);
      } else {
        // if (data.length > 0) {
        this.subRoleItems[id] = data;
        // }
        // console.log('Data SubRoles: >>>>>>>>>>>>> ', this.subRoleItems[id], this.subRoleItems);
      }
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Select a item'
    },
    setSubRole (e) {
      console.log('setSubRole', e)
    },
    close () {
      console.log('Dialog closed')
    },
    removeChip (item) {
      console.log('removeChip', item)
      const index = this.groupSelectedItems.indexOf(item)
      if (index >= 0) this.groupSelectedItems.splice(index, 1)
    },
    toggleGroupSelection () {
      this.$nextTick(() => {
        if (this.selectedAllGroup) {
          this.groupSelectedItems = []
        } else {
          this.groupSelectedItems = []
          this.caseGroupItem.forEach(group => {
            this.groupSelectedItems.push(group)
          });
          // this.caseSchema.group = this.caseGroupItem.slice()
        }
      })
    },
    groupClicked (e) {
      this.caseSchema.phase = [];
      this.groupSelected = [e];
      console.log('groupClicked', this.groupSelected)
      if (this.showAll === false) this.caseGroupServiceItem = this.groupSelected[0].service;

      this.caseSchema.phase = this.groupSelected[0].phase;

      this.caseSchema.phase.forEach((phases, index) => {
        this.caseSchema.phase[index].group = this.groupSelected[0]._id
        this.caseSchema.phase[index].order = index;
      });

      // this.groupSelected.phase.forEach(async (phases, index) => {            
      //   let phaseData = await getOnLocalCollection('Phase', phases);
      //   this.caseSchema.phase.push({ phase: phases, group: this.groupSelected[0]._id, name: phaseData.data.name, task: phaseData.data.task, order: index })
      // });

      console.log('groupClicked', this.showAll, this.caseGroupServiceItem, this.caseSchema.phase)
      // this.caseGroupServiceItem = props.item.task
    },
    handleViewItem () { 
      // 
    },
    handleEditItem () { 
      // 
    },
    handleDeleteItem () { 
      //
    },
    showAllSevicesGroup () {
      this.caseGroupServiceItem = []
      if (this.groupSelectedItems.length > 0) {
        this.groupSelectedItems.forEach(group => {
          group.service.forEach(service => {
            this.caseGroupServiceItem.push(service)
          });
        });
      }
      this.showAll = true;
      // console.log('groupSelected', )
      console.log('this.caseGroupServiceItem', this.caseGroupServiceItem)
    },
    async feedTasks (e, phase) {
      console.log('this.caseSchema.phase', this.caseSchema.phase, phase)
      const prevItem = this.caseSchema.phase.find(item => item.isSelected);
      if (prevItem) this.$delete(prevItem, 'isSelected');
      this.$set(phase, 'isSelected', true)

      this.tasksItems = [];
      this.subTasksItems = [];
      let populate = 'task';
      let where = { '_id': e };
      
      let { data, error } = await getFromApi('Phase', this, where, populate);
      // let { data, total, error } = await getOne('Phase', e);
      if (error) {
        console.log(error);
      } else {
        if (data.length > 0) {
          this.tasksItems = data[0].task;
          this.taskSelected = this.tasksItems;
        }

        console.log('Data: >>>>>>>>>>>>> ', data);
      }
      console.log(e);
    },
    async feedSubTasksOFF (e) {
      console.log('feedSubTasks: >>>>>>>>>>>>> ', e);
      this.subTasksItems = [];
      this.subTasksItems = e;
      if (e.length > 0) {
        
        let tasksArray = [];
        let populate = 'task';
        e.forEach(task => {
          tasksArray.push({ _id: task });
        });
        let where = tasksArray.length !== 0 ? { $or: tasksArray } : '';
        
        let { data, total, error } = await getFromApi('TaskTemplate', this, where, populate);
        if (error) {
          console.log(error);
        } else {
          if (data.length > 0) {
            this.subTasksItems = data;
            this.subTaskSelected = this.subTasksItems;
          }
          console.log('Data SubTasks: >>>>>>>>>>>>> ', data);
        }
      }
    },
    clickTask (item, index) {
      this.tasksItems.forEach((task, index) => {
        // this.tasksItems[index].selected = false;
        // if (item._id === task._id) this.tasksItems[index].selected = true;
        console.log('tasksItems.forEach', this.tasksItems[index], task)
      });
      console.log('clickTask', item, index)
    },
    feedSubTasks (dataItems, item) {
      this.subTasksItems = item.task;
      
      if (this.subTasksItems.length > 0) {
        setTimeout(() => {
          let row = this.$refs['sub-tasks'];
          let wrapper = this.$refs.scroll.$el
          this.$vuetify.goTo(row, { container: wrapper });
        }, 500); 
      }
      const prevItem = this[dataItems].find(e => e.isSelected);
      if (prevItem) this.$delete(prevItem, 'isSelected');
      this.$set(item, 'isSelected', true)
    },
    addNewItem (e) {
      console.log('addNewItem', e);
    }

  }
};
