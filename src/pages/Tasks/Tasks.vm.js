/* global session */
import {
  getFromApi,
  create,
  getLocalCollection,
  getCollection
} from '../../helpers/helpers';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
export default {
  components: {
    VuePerfectScrollbar
  },
  name: 'Sample',
  data: () => ({
    rowsPerPageItems: [4, 8, 12],
    pagination: {
      sortBy: '_id',
      descending: false,
      page: 1,
      rowsPerPage: 100, // -1 for All
      totalItems: 0
    },
    groups: [],
    groupsItems: [],
    taskItems2: [],
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
    },
    taskItems: [
      {
        id: 1, 
        display_name: 'Case FL3476',
        phase: 'Phase 01',
        total: '35',
      },
      {
        id: 2, 
        display_name: 'Case FL3476',
        phase: 'Phase 05',
        total: '20',
      },
      {
        id: 3, 
        display_name: 'Case FL3476',
        phase: 'Phase 05',
        total: '5',
      },
    ],
    dataItem: []
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
    this.getData('Group');
  },
  methods: {
    async getData (entity, search = null) {
      this.dialog_loading = true;
      let tasksTotal = await getLocalCollection('TaskTemplate');
      let { data, total, error } = await getFromApi(entity, this, null, 'group');
      if (data.length > 0) {
        this.groups = data;
        this.groups.forEach((group, i) => {
          group.taskTotal = tasksTotal.data.length;
          group.taskValue = tasksTotal.data.length > 0 ? ((group.phase.length * 100) / tasksTotal.data.length).toFixed(0) : 0;
        })
      }

      if (search) this.groups = this.groups.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
      
      this.noResult = this.groups.length > 0 ? false : true;
      this.dialog_loading = false;
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
          case 'TaskTemplate':
            this.taskItems2 = data;
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
      this.feedSelects('TaskTemplate');
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
            this.getData('Group');
          }, 300);

          
        }
      }
    }
  }
};
