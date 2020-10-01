/* global session store $route */
import Vue from 'vue';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import xKanban from './components/xKanban/xKanban';
import TaskSubGroup from './components/TaskSubGroup';
import TaskAdd from './components/TaskAdd/TaskAdd';

import {
  getFromApi,
  getOne,
  create,
  getLocalCollection,
  update,
  showSnack
} from '../../helpers/helpers';

export default {
  components: {
    VuePerfectScrollbar,
    xKanban,
    TaskSubGroup,
    TaskAdd
  },
  name: 'TasksGroup',
  data: () => ({
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    snack: false,
    snackColor: '',
    snackText: '',
    fab: false,
    TaskGroup: '',
    TaskStatus: '',
    groupID: '',
    stages: [],
    blocks: [],
    panelIndex: -9,
    taskUngroupedItems: [],
    taskItems: [],
    taskHeaders: [
      {
        text: 'Task Name',
        align: 'left',
        value: 'name'
      },
      { text: 'Task Type', align: 'center', value: 'type' },
      { text: 'Task Notification', align: 'center', value: 'notification_type' },
      { text: 'Task Status', align: 'center', value: 'status' },
      { text: 'Action', value: '', align: 'center', sortable: false },
    ],
    loading: true,
    allTaskGroup: [],
    allTaskSubGroup: [],
    groups: [],
    groupsItems: [],
    rules: {
      required: value => {
        if (Array.isArray(value)) {
          return value.length > 0 || 'Required.';
        } else {
          return !!value || 'Required.';
        }
      },
      counter: value => value.length <= 20 || 'Max 20 characters',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
      }
    },
    dialog_loading: true,
    addSubGroupDialog: false,
    addSubGroup: {
      name: '',
      task: [],
      task_group: '',
      group: []
    },
    defaultAddSubGroup: {
      name: '',
      task: [],
      task_group: '',
      group: []
    }
    // config: {}
  }),
  computed: {
    localBlocks () {
      console.log('this.blocks COMPUTED >>>>>>', this.blocks);
      return this.blocks;
      
    },
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

  },
  mounted () {  
    this.groupID = this.$route.params.id;
    this.addSubGroup.task_group = this.groupID;
    this.feedItems('TaskStatus');
    this.getGroup(this.groupID);

    this.bus.$on('taskCreated', (task) => {
      console.log('taskCreated _+_+_+_+_+_+_+_+_+_+_+_+_+_+_+_+', task, this.groupID);
      this.getGroup(this.groupID);
    });

    this.bus.$on('openAddDialog', (dialog) => {
      this.openAddDialog(dialog);
    });
  },
  created () {
    this.bus = new Vue();
  },
  methods: {
    async getGroup (groupID) {
      let { data, total, error } = await getOne('TaskGroup', groupID);
      if (error) {
        console.log('ERROR GET TaskGroup: ', error);
        if (error === 'getById TaskGroup') this.$router.push({ path: '/tasks' });
      }
      else 
      {
        this.TaskGroup = data;
        if (this.TaskGroup.task.length > 0) this.feedItems('Task', this.TaskGroup.task, 'status');
        // this.dialog_loading = false;
      }
    },
    async feedItems (entity, where = false, populate = '') {
      this.dialog_loading = true;
      let whereID = [];
      if (where) {
        where.forEach(element => {
          whereID.push({ '_id': element });
        });
        where = { $or: whereID };
      }
      let { data, total, error } = await getFromApi(entity, this, where, populate);
      // let { data, total, error } = await getLocalCollection(entity, this);
      if (error) {
        console.log(error);
      } else {
        let result = null;
        switch (entity) {
          case 'TaskStatus':
            this.stages = [];
            this.TaskStatus = data;
            this.TaskStatus.forEach(status => {
              this.stages.push(status);
            });

            // this.dialog_loading = false;
            break;
          case 'Task':
            this.blocks = data;
            this.blocks.forEach((block, i) => {
              this.blocks[i].statusID = block.status.id;
              this.blocks[i].status = block.status.label;
            });

            // this.dialog_loading = false;
            break;
        
          default:
            break;
        }
        this.dialog_loading = false;
        return data;
      }
      // console.log(this.stages);
    },
    async updateBlock (id, status, i) {
      
      const task = this.blocks.filter(item => {
        return item.id === id;
      });

      let newStatus = this.TaskStatus.filter(item => {
        return item.label === status;
      });

      const payload = { ...task[0] };
      payload.status = newStatus[0].id;

      let { data, total, error } = await update('Task', payload, id);
      if (error)
      {
        console.error('error on update Task', error);
      }
      else
      {
        showSnack(this, false, 'Task ' + payload.name + ' Status Updated successfully!');
        // this.bus.$emit('taskCreated', data);    
      }
    },
    async fillUngrouped () {
      console.log('fillUngrouped');
      this.loading = true;
      let allTaskGrouped = [];

      // this.feedItems('Task');

      let { data, total, error } = await getLocalCollection('TaskGroup');
      if (error) {
        console.log(error);
      } else {
        data.forEach(group => {
          group.task.forEach(task => {
            allTaskGrouped.push(task);
          });
        });
      }

      let TaskSubGroupData = await getLocalCollection('TaskSubGroup');
      if (TaskSubGroupData.error) {
        console.log(TaskSubGroupData.error);
      } else {
        TaskSubGroupData.data.forEach(group => {
          group.task.forEach(task => {
            allTaskGrouped.push(task);
          });
        });
      }

      allTaskGrouped = [...new Set(allTaskGrouped)]; // Remove Duplicad

      let TaskData = await getLocalCollection('Task');
      if (TaskData.error) {
        console.log(TaskData.error);
      } else {

        this.taskUngroupedItems = TaskData.data.filter(t => !allTaskGrouped.includes(t.id));
        this.loading = false;

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
          case 'Group':
            this.groupsItems = data;
            break;
          case 'TaskGroup':
            this.groups = data;
            break;
          case 'Task':
            this.taskItems = data;
            break;

          default:
            break;
        }
        this.dialog_loading = false;
        
      }
    },
    closeNew () {
      this.addGroupDialog = false;
      this.addSubGroupDialog = false;
      setTimeout(() => {

        this.addGroup = Object.assign({}, this.defaultAddGroup);
        this.addSubGroup = Object.assign({}, this.defaultAddSubGroup);

      }, 300);
    },
    openAddDialog (dialog) {
      if (dialog === 'group') {
        this.addGroupDialog = true;
      } else {
        this.addSubGroupDialog = true;
      }
      this.feedSelects('Group');
      this.feedSelects('TaskGroup');
      this.feedSelects('Task');
    },
    async addNew (entity, ref, payload) {
      if (this.$refs[ref].validate()) {
        this.dialog_loading = true;
        let { data, error } = await create(entity, payload);
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
          console.log(data);
          this.addSubGroupDialog = false;
          this.$router.push({ path: '/tasks-sub-group/' + data.id });

          setTimeout(() => {
            // this.addGroup = Object.assign({}, this.defaultAddGroup);
            this.addSubGroup = Object.assign({}, this.defaultAddSubGroup);
            // this.getData('TaskGroup');
          }, 300);
        }
      }
    }
  }
};
