/* global session */
import {
  getFromApi,
  create,
  getLocalCollection
} from '../../helpers/helpers';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'Sample',
  data: () => ({
    pagination: {
      sortBy: '_id',
      descending: true,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    groups: [],
    groupsItems: [],
    taskItems: [],
    search: '',
    noResult: false,
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
    addGroupDialog: false,
    addGroup: {
      name: '',
      task: [],
      group: []
    },
    defaultAddGroup: {
      name: '',
      task: [],
      group: []
    },
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
  }),
  computed: {

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
    //
  },
  created () {
    // console.log('created');
    // this.feedSelects('Task');
  },
  mounted () {
    // console.log('mounted');
    this.getData('TaskGroup');
  },
  methods: {
    async getData (entity, search = null) {
      this.dialog_loading = true;
      let tasksTotal = await getLocalCollection('Task');
      let { data, total, error } = await getFromApi(entity, this, null, 'task');
      if (data.length > 0) {
        this.groups = data;
        this.groups.forEach((group, i) => {
          group.taskTotal = tasksTotal.data.length;
          group.taskValue = tasksTotal.data.length > 0 ? ((group.task.length * 100) / tasksTotal.data.length).toFixed(0) : 0;
          // console.log(tasksTotal.data.length, group);
        });
        // console.log(this.groups);
      }

      if (search) this.groups = this.groups.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
      
      this.noResult = this.groups.length > 0 ? false : true;
      this.dialog_loading = false;
      // console.log('this.noResult >>>>>>>>>>>>>>', this.groups.length, this.noResult);
    },
    async feedSelects (entity) {
      this.dialog_loading = true;
      let { data, total, error } = await getLocalCollection(entity);
      if (error) {
        console.log(error);
      } else {
        console.log(entity, data);
        switch (entity) {
          case 'Group':
            this.groupsItems = data;
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
          if (entity === 'TaskSubGroup') {
            this.addSubGroupDialog = false;
            this.$router.push({ path: '/tasks-group/' + payload.task_group });
          } else {
            this.addGroupDialog = false;
            // this.groups.push(data);
          }
          setTimeout(() => {
            this.addGroup = Object.assign({}, this.defaultAddGroup);
            this.addSubGroup = Object.assign({}, this.defaultAddSubGroup);
            this.getData('TaskGroup');
          }, 300);

          
        }
      }
    }
  }
};
